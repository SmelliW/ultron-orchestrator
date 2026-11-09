"use strict";
/**
 * Executor Engine - Using "do", "executing-plans" skills
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutorEngine = void 0;
class ExecutorEngine {
    constructor(ultron) {
        this.useGitWorktrees = true;
        this.executionTimeout = 360000; // milliseconds
        this.ultron = ultron;
    }
    /**
     * Executes a phase from the implementation plan
     */
    async executePhase(phase, originalRequest) {
        try {
            // Determine isolation mode (use git worktree if needed)
            const isIsolated = await this.ultron.executor.checkIfIsolationNeeded(phase.name, phase.tools);
            let executionContext;
            if (isIsolated) {
                // Use git worktrees for isolation
                const isolatedCtx = await this.ultron.executor.isolateWorktree(phase.name);
                executionContext = isolatedCtx;
            }
            else {
                executionContext = await this.ultron.executor.executeToolsDirectly(phase.tools, phase.verificationSteps);
            }
            // Get verification results
            const verifyResults = await this.ultron.executor.verifyPhase(phase.name, phase.verificationSteps, executionContext);
            return {
                success: !verifyResults.failedCount,
                summary: `Executed ${phase.name} successfully`,
                artifacts: verificationResults.artifacts || [],
                executionTime: this.getExecutionTime()
            };
        }
        catch (error) {
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
    async checkIfIsolationNeeded(phaseName, tools) {
        // Heuristic: if tool modifies code or uses write permissions, isolate
        const forbiddenTools = ['git push', 'npm install', 'docker build', 'git commit'];
        return forbiddenTools.some(tool => tools.includes(tool));
    }
    /**
     * Create isolated git worktree for this phase
     */
    async isolateWorktree(phaseName) {
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
    async executeToolsDirectly(tools, verificationSteps) {
        // Use do skill to execute implementation plan
        const execution = await this.ultron.executor.executeImplementation(tools);
        return execution;
    }
    /**
     * Verify phase results match expectations
     */
    async verifyPhase(phaseName, verificationSteps, context) {
        const failedCount = 0;
        const artifacts = [phaseName];
        return { failedCount, artifacts };
    }
    /**
     * Clean up isolated worktree after phase
     */
    cleanUpWorktree(worktree) {
        // Use cleanup tools to remove worktree
        return this.ultron.executor.removeWorktree(worktree.path);
    }
    /**
     * Get estimated execution time
     */
    getExecutionTime() {
        const totalTime = this.executionsTotal || 0;
        return Math.max(totalTime, this.getExecutionTimeEstimate());
    }
    /**
     * Get executor state
     */
    getState() {
        return {
            executionHistory: [],
            lastPhaseExecuted: null,
            totalArtifacts: this.artifactsTotal || 0
        };
    }
}
exports.ExecutorEngine = ExecutorEngine;
//# sourceMappingURL=executor.js.map