"use strict";
/**
 * Ultron/Jarvis - AI Personal Orchestrator Agent
 * Central brain: Claude Code with installed skills (Writing Plans, Executing Plans, etc.)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltronAgent = void 0;
const planner_1 = require("./planner/planner");
const executor_1 = require("./executor/executor");
const memory_manager_1 = require("./memory_manager/memory_manager");
class UltronAgent {
    constructor() {
        this.planner = new planner_1.PlannerEngine();
        this.executor = new executor_1.ExecutorEngine();
        this.memory = new memory_manager_1.MemoryManager();
        console.log('🤖 Ultron/Jarvis Agent Initialized');
        console.log('Brain: Claude Code (qwen3.5:4b)');
        console.log('Skills: Writing Plans, Executing Plans, Memory Management');
    }
    /**
     * Main orchestrator - plans AND executes tasks
     */
    async processRequest(userRequest) {
        try {
            // STEP 1: Search memory for relevant context
            const memoryContext = await this.memory.searchObservations(userRequest);
            // STEP 2: Generate implementation plan
            const plan = await this.planner.generatePlan(userRequest, memoryContext);
            // STEP 3: Execute the plan phase by phase
            for (const phase of plan.phases) {
                console.log(`\n📋 Phase: ${phase.name}`);
                const result = await this.executor.executePhase(phase, userRequest);
                // STEP 4: Update memory with observation
                await this.memory.saveObservation({
                    userId: 'user',
                    context: { request: userRequest },
                    summary: result.summary,
                    timestamp: new Date().toISOString()
                });
                if (result.error) {
                    throw new Error(result.error);
                }
            }
            console.log('\n✅ Task completed successfully');
            await this.memory.saveObservation({
                userId: 'user',
                context: { request: userRequest },
                summary: 'All phases completed successfully',
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error(`❌ Error in Ultron execution: ${error.message}`);
            // Save error for debugging detective dashboard
            await this.memory.saveObservation({
                userId: 'user',
                context: { request: userRequest },
                summary: `Execution failed: ${error.message}`,
                timestamp: new Date().toISOString()
            });
        }
    }
    /**
     * Get current state of orchestrator
     */
    getState() {
        return {
            plannerState: this.planner.getState(),
            executorState: this.executor.getState(),
            memoryStatus: this.memory.getStatus()
        };
    }
    /**
     * Clean up resources when done
     */
    async shutdown() {
        await this.memory.shutdown();
        console.log('\n👋 Ultron/Jarvis shut down');
    }
}
exports.UltronAgent = UltronAgent;
//# sourceMappingURL=index.js.map