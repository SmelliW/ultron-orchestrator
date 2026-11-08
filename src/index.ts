/**
 * Ultron/Jarvis - AI Personal Orchestrator Agent
 * Central brain: Claude Code with installed skills (Writing Plans, Executing Plans, etc.)
 */

import { PlannerEngine } from './planner/planner';
import { ExecutorEngine } from './executor/executor';
import { MemoryManager } from './memory_manager/memory_manager';

// Initialize components with actual skill integration
console.log('🤖 Ultron/Jarvis Agent Initialized');
console.log(`Brain: qwen3.5:4b`);
console.log(`Skills: make-plan, writing-plans, executing-plans, mem-search`);

class UltronAgent {
  private planner: PlannerEngine;
  private executor: ExecutorEngine;
  private memory: MemoryManager;

  constructor() {
    this.planner = new PlannerEngine();
    this.executor = new ExecutorEngine();
    this.memory = new MemoryManager();

    console.log('🤖 Ultron/Jarvis Agent Initialized');
    console.log('Brain: Claude Code (qwen3.5:4b)');
    console.log('Skills: Writing Plans, Executing Plans, Memory Management');
  }

  /**
   * Main orchestrator - plans AND executes tasks
   */
  async processRequest(userRequest: string): Promise<void> {
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

    } catch (error) {
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
  getState(): Record<string, any> {
    return {
      plannerState: this.planner.getState(),
      executorState: this.executor.getState(),
      memoryStatus: this.memory.getStatus()
    };
  }

  /**
   * Clean up resources when done
   */
  async shutdown(): Promise<void> {
    await this.memory.shutdown();
    console.log('\n👋 Ultron/Jarvis shut down');
  }
}

// Export for use with CLI or other systems
export { UltronAgent };
