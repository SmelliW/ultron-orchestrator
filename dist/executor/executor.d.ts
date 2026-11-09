/**
 * Executor Engine - Using "do", "executing-plans" skills
 */
import { UltronAgent } from '../index';
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
export declare class ExecutorEngine {
    private ultron;
    private useGitWorktrees;
    private executionTimeout;
    constructor(ultron: UltronAgent);
    /**
     * Executes a phase from the implementation plan
     */
    executePhase(phase: ExecutablePhase, originalRequest: string): Promise<ExecutionResult>;
    /**
     * Check if phase needs isolation
     */
    checkIfIsolationNeeded(phaseName: string, tools: string[]): Promise<boolean>;
    /**
     * Create isolated git worktree for this phase
     */
    isolateWorktree(phaseName: string): Promise<any>;
    /**
     * Execute tools directly in current context
     */
    executeToolsDirectly(tools: string[], verificationSteps: string[]): Promise<any>;
    /**
     * Verify phase results match expectations
     */
    verifyPhase(phaseName: string, verificationSteps: string[], context: any): Promise<{
        failedCount: number;
        artifacts: string[];
    }>;
    /**
     * Clean up isolated worktree after phase
     */
    cleanUpWorktree(worktree: any): Promise<void>;
    /**
     * Get estimated execution time
     */
    getExecutionTime(): number;
    /**
     * Get executor state
     */
    getState(): any;
}
export {};
//# sourceMappingURL=executor.d.ts.map