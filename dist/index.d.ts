/**
 * Ultron/Jarvis - AI Personal Orchestrator Agent
 * Central brain: Claude Code with installed skills (Writing Plans, Executing Plans, etc.)
 */
declare class UltronAgent {
    private planner;
    private executor;
    private memory;
    constructor();
    /**
     * Main orchestrator - plans AND executes tasks
     */
    processRequest(userRequest: string): Promise<void>;
    /**
     * Get current state of orchestrator
     */
    getState(): Record<string, any>;
    /**
     * Clean up resources when done
     */
    shutdown(): Promise<void>;
}
export { UltronAgent };
//# sourceMappingURL=index.d.ts.map