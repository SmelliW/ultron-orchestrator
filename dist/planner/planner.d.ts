/**
 * Planner Engine - Using "make-plan", "writing-plans", "executing-plans" skills
 */
import { UltronAgent } from '../index';
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
    estimatedTime: number;
    timestamp: string;
}
export declare class PlannerEngine {
    private ultron;
    private maxPhases;
    private minPhases;
    constructor(ultron: UltronAgent);
    /**
     * Generates a progressive implementation plan using Writing Plans skill
     */
    generatePlan(userRequest: string, context?: any): Promise<GeneratedPlan>;
    /**
     * Internal method using the /make-plan skill from installed skills
     */
    private generatePlanInternal;
    /**
     * Get current planner state
     */
    getState(): any;
}
export {};
//# sourceMappingURL=planner.d.ts.map