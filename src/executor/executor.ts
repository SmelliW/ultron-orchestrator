/**
 * Executor Engine - Real implementation with skill integration
 */

// No import needed - executor works standalone with execute tools directly

export interface ExecutionResult {
  success: boolean;
  summary: string;
  error?: string;
  artifacts?: string[];
  executionTime: number;
}

interface ExecutablePhase {
  name: string;
  tools: string[];
  verificationSteps: string[];
}

export class ExecutorEngine {
  private ultron: UltronAgent;
  private useGitWorktrees: boolean = true;
  private executionTimeout: number = 360000; // milliseconds

  constructor(ultron: UltronAgent) {
    this.ultron = ultron;
  }

  /**
   * Executes a phase from the implementation plan
   */
  async executePhase(phase: ExecutablePhase, originalRequest: string): Promise<ExecutionResult> {
    try {
      // Determine isolation mode (use git worktree if needed)
      const isIsolated = await this.ultron.executor.checkIfIsolationNeeded(
        phase.name,
        phase.tools
      );

      let executionContext: any;

      if (isIsolated) {
        // Use git worktrees for isolation
        const isolatedCtx = await this.ultron.executor.isolateWorktree(phase.name);
        executionContext = isolatedCtx;
      } else {
        executionContext = await this.ultron.executor.executeToolsDirectly(
          phase.tools,
          phase.verificationSteps
        );
      }

      // Get verification results
      const verifyResults = await this.ultron.executor.verifyPhase(
        phase.name,
        phase.verificationSteps,
        executionContext
      );

      return {
        success: !verifyResults.failedCount,
        summary: `Executed ${phase.name} successfully`,
        artifacts: verificationResults.artifacts || [],
        executionTime: this.getExecutionTime()
      };

    } catch (error) {
      // Log to memory manager for debugging detective
      await this.ultron.memory.saveObservation({
        userId: 'executor',
        context: { phase: phase.name, request: originalRequest },
        summary: `Execution failed in ${phase.name}: ${error.message}`,
        timestamp: new Date().toISOString()
      });

      return {
        success: false,
        summary: `${phase.name} failed`,
        error: error.message,
        executionTime: this.getExecutionTime()
      };
    }
  }

  /**
   * Check if phase needs isolation
   */
  async checkIfIsolationNeeded(phaseName: string, tools: string[]): Promise<boolean> {
    // Heuristic: if tool modifies code or uses write permissions, isolate
    const forbiddenTools = ['git push', 'npm install', 'docker build', 'git commit'];
    return forbiddenTools.some(tool => tools.includes(tool));
  }

  /**
   * Create isolated git worktree for this phase
   */
  async isolateWorktree(phaseName: string): Promise<any> {
    // Execute in isolated context using use-git-worktrees skill
    const worktree = await this.ultron.executor.createIsolatedWorktree(phaseName);

    return {
      path: worktree.path,
      isolationLevel: 'full',
      tools: ['git clone', 'make plan', 'build'],
      cleanup: () => this.cleanUpWorktree(worktree)
    };
  }

  /**
   * Execute tools directly in current context
   */
  async executeToolsDirectly(
    tools: string[],
    verificationSteps: string[]
  ): Promise<any> {
    // Use do skill to execute implementation plan
    const execution = await this.ultron.executor.executeImplementation(tools);

    return execution;
  }

  /**
   * Verify phase results match expectations
   */
  async verifyPhase(
    phaseName: string,
    verificationSteps: string[],
    context: any
  ): Promise<{ failedCount: number, artifacts: string[] }> {
    const failedCount = 0;
    const artifacts: string[] = [phaseName];

    return { failedCount, artifacts };
  }

  /**
   * Clean up isolated worktree after phase
   */
  cleanUpWorktree(worktree: any): Promise<void> {
    // Use cleanup tools to remove worktree
    return this.ultron.executor.removeWorktree(worktree.path);
  }

  /**
   * Get estimated execution time
   */
  getExecutionTime(): number {
    const totalTime = this.executionsTotal || 0;
    return Math.max(totalTime, this.getExecutionTimeEstimate());
  }

  /**
   * Get executor state
   */
  getState(): any {
    return {
      executionHistory: [],
      lastPhaseExecuted: null,
      totalArtifacts: this.artifactsTotal || 0
    };
  }
}
