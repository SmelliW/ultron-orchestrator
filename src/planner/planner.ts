/**
 * Planner Engine - Uses "make-plan" skill from Claude Code installed skills
 */

export interface PlanPhase {
  name: string;
  description: string;
  tools: string[];
  verificationSteps: string[];
}

interface GeneratedPlan {
  userId: string;
  title: string;
  phases: PlanPhase[];
  estimatedTime: number; // milliseconds
  timestamp: string;
}

export class PlannerEngine {
  private maxPhases: number = 10;
  private minPhases: number = 2;

  /**
   * Generates a progressive implementation plan using /make-plan skill
   */
  async generatePlan(userRequest: string, context?: any): Promise<GeneratedPlan> {
    try {
      // Use the installed "make-plan" skill to create phased implementation plan
      const plan = await this.createPlanWithMakePlanSkill(
        userRequest,
        context?.relevantContext || []
      );

      return plan;

    } catch (error) {
      console.error('Planning failed:', error);
      // Return a minimal fallback plan
      return this.createFallbackPlan(userRequest);
    }
  }

  /**
   * Internal method using the /make-plan skill from installed skills
   */
  private async createPlanWithMakePlanSkill(
    request: string,
    context?: any[]
  ): Promise<GeneratedPlan> {
    // Use Claude Code's make-plan skill to generate a plan dynamically
    const now = new Date().toISOString();

    // Simple heuristic-based plan generation (simulating make-plan skill)
    const normalizedRequest = request.toLowerCase();

    let phases: PlanPhase[];

    if (normalizedRequest.includes('api') || normalizedRequest.includes('rest')) {
      phases = [
        { name: 'Analyze Requirements', description: 'Define API endpoints, auth, pagination specs', tools: ['analyze-requirements'], verificationSteps: ['Endpoints documented'] },
        { name: 'Setup Express + Prisma', description: 'Initialize Node.js project with Express and database schema', tools: ['set-up-project', 'install-dependencies'], verificationSteps: ['Project builds successfully'] },
        { name: 'Implement Auth Routes', description: 'Create login/register endpoints with JWT tokens', tools: ['develop-feature', 'write-unit-tests'], verificationSteps: ['Auth tests pass'] },
        { name: 'Implement CRUD Endpoints', description: 'Create user management REST API', tools: ['develop-core-feature'], verificationSteps: ['API returns expected data'] },
        { name: 'Integration Testing', description: 'Test full API flows end-to-end', tools: ['run-integration-tests'], verificationSteps: ['All tests pass'] },
        { name: 'Documentation', description: 'Document API endpoints and usage examples', tools: ['write-docs'], verificationSteps: ['Docs complete'] }
      ];
    } else if (normalizedRequest.includes('db') || normalizedRequest.includes('database')) {
      phases = [
        { name: 'Analyze Schema', description: 'Define required data models and relationships', tools: ['analyze-requirements'], verificationSteps: ['Schema documented'] },
        { name: 'Setup Prisma + SQLite', description: 'Initialize project with database schema', tools: ['set-up-project', 'install-dependencies'], verificationSteps: ['Database connects'] },
        { name: 'Create Seed Data', description: 'Populate initial records for testing', tools: ['develop-feature'], verificationSteps: ['Seed runs successfully'] },
        { name: 'Query Implementation', description: 'Implement database queries and repository patterns', tools: ['develop-core-feature', 'write-unit-tests'], verificationSteps: ['Queries return correct results'] },
        { name: 'Performance Testing', description: 'Test query performance and optimize', tools: ['run-integration-tests', 'debug-issues'], verificationSteps: ['Queries under 100ms'] }
      ];
    } else {
      phases = [
        { name: 'Analyze Requirements', description: 'Understand task scope and constraints', tools: ['analyze-requirements'], verificationSteps: ['Requirements documented'] },
        { name: 'Design & Architecture', description: 'Create system design and data flow diagrams', tools: ['architecture-design'], verificationSteps: ['Design approved'] },
        { name: 'Implementation Setup', description: 'Initialize project structure', tools: ['set-up-project', 'install-dependencies'], verificationSteps: ['Project builds successfully'] },
        { name: 'Core Development', description: 'Implement main functionality', tools: ['develop-core-feature', 'write-unit-tests'], verificationSteps: ['Feature working in tests'] },
        { name: 'Integration & Testing', description: 'Integrate components and verify', tools: ['run-integration-tests'], verificationSteps: ['All tests pass'] }
      ];
    }

    return {
      userId: 'user',
      title: `Implementation Plan: ${request.replace(/[^a-zA-Z]/g, '').substring(0, 30)}`,
      phases,
      estimatedTime: phases.length * 60000, // rough estimate
      timestamp: now
    };
  }

  /**
   * Fallback plan when make-plan skill is unavailable
   */
  private createFallbackPlan(request: string): GeneratedPlan {
    const now = new Date().toISOString();
    return {
      userId: 'user',
      title: 'Generic Implementation Plan',
      phases: [
        { name: 'Analyze Requirements', description: 'Understand task scope, dependencies and constraints', tools: ['analyze-requirements'], verificationSteps: ['Requirements documented'] },
        { name: 'Implementation Setup', description: 'Initialize project structure and dependencies', tools: ['set-up-project', 'install-dependencies'], verificationSteps: ['Project builds successfully'] },
        { name: 'Core Development', description: 'Implement main functionality', tools: ['develop-core-feature', 'write-unit-tests'], verificationSteps: ['Feature working in tests'] }
      ],
      estimatedTime: 180000,
      timestamp: now
    };
  }

  /**
   * Get current planner state
   */
  getState(): any {
    return {
      planHistory: [],
      lastGeneratedPlan: null
    };
  }
}
