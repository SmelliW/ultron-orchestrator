/**
 * Memory Manager - Using "mem-search", "mem-setup", "knowledge-agent" skills
 * Persistent observation database for context management
 */
import { UltronAgent } from '../index';
export interface MemoryObservation {
    userId: string;
    context: {
        request?: string;
        task?: string;
        phase?: string;
        project?: string;
    };
    summary: string;
    timestamp: string;
    relatedTo?: string[];
}
interface SearchResults {
    relevantContext: MemoryObservation[];
    confidenceScore: number;
}
declare class ContextMemoryManager {
    private ultron;
    private dbPath;
    constructor(ultron: UltronAgent);
    /**
     * Search memory for relevant observations using mem-search skill
     */
    searchObservations(query: string, maxResults?: number): Promise<SearchResults>;
    /**
     * Save observation to memory database using backup-setup/standup skills
     */
    saveObservation(observation: MemoryObservation): Promise<void>;
    /**
     * Create knowledge agent from memory data using knowledge-agent skill
     */
    createKnowledgeAgent(topic: string, minObservations?: number): Promise<any>;
    /**
     * Backup/restore memory using backup-setup skill
     */
    manageBackup(action: 'backup' | 'restore', params?: any): Promise<void>;
    /**
     * Get memory manager status
     */
    getStatus(): any;
    /**
     * Total observations count
     */
    getTotalObservations(): number;
    /**
     * Check cloud sync status using cloud-sync skill
     */
    checkCloudSync(): boolean;
    /**
     * Last backup timestamp (simulated)
     */
    getLastBackupTimestamp(): string;
    /**
     * Shutdown memory manager when done
     */
    shutdown(): Promise<void>;
}
export declare const MemoryManager: ContextMemoryManager;
export {};
//# sourceMappingURL=memory_manager.d.ts.map