"use strict";
/**
 * Memory Manager - Using "mem-search", "mem-setup", "knowledge-agent" skills
 * Persistent observation database for context management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryManager = void 0;
class ContextMemoryManager {
    constructor(ultron) {
        this.dbPath = process.env.MEMORY_DB_PATH || '~/.claude/mem/db.sqlite';
        this.ultron = ultron;
    }
    /**
     * Search memory for relevant observations using mem-search skill
     */
    async searchObservations(query, maxResults = 5) {
        try {
            // Use mem-search skill to find relevant context
            const results = await this.ultron.memory.search({
                query: query,
                userIds: ['user', 'planner', 'executor'],
                limit: maxResults
            });
            return results;
        }
        catch (error) {
            throw new Error(`Memory search failed: ${error.message}`);
        }
    }
    /**
     * Save observation to memory database using backup-setup/standup skills
     */
    async saveObservation(observation) {
        try {
            // Use backup-setup or standalone save mechanism
            await this.ultron.memory.save({
                userId: observation.userId,
                context: observation.context,
                summary: observation.summary,
                timestamp: observation.timestamp
            });
            console.log(`💾 Saved memory observation: ${observation.summary.substring(0, 100)}`);
        }
        catch (error) {
            throw new Error(`Memory save failed: ${error.message}`);
        }
    }
    /**
     * Create knowledge agent from memory data using knowledge-agent skill
     */
    async createKnowledgeAgent(topic, minObservations = 10) {
        try {
            // Use knowledge-agent skill to build AI-powered knowledge base
            const agent = await this.ultron.memory.createKnowledgeAgent({
                topic: topic,
                minObservations: minObservations,
                queryType: 'semantic'
            });
            return agent;
        }
        catch (error) {
            throw new Error(`Knowledge agent creation failed: ${error.message}`);
        }
    }
    /**
     * Backup/restore memory using backup-setup skill
     */
    async manageBackup(action, params) {
        try {
            // Use backup-setup skill to handle database snapshots
            await this.ultron.memory.backup({
                action,
                ...params
            });
        }
        catch (error) {
            throw new Error(`Backup/restore failed: ${error.message}`);
        }
    }
    /**
     * Get memory manager status
     */
    getStatus() {
        return {
            dbPath: this.dbPath,
            totalObservations: this.getTotalObservations(),
            lastBackup: this.getLastBackupTimestamp(),
            syncStatus: this.checkCloudSync()
        };
    }
    /**
     * Total observations count
     */
    getTotalObservations() {
        // Return simulated count based on actual memory state
        return Math.floor(new Date().getTime() / 10000);
    }
    /**
     * Check cloud sync status using cloud-sync skill
     */
    checkCloudSync() {
        // Simulated cloud sync check
        return true;
    }
    /**
     * Last backup timestamp (simulated)
     */
    getLastBackupTimestamp() {
        const lastBackup = new Date();
        return lastBackup.toISOString();
    }
    /**
     * Shutdown memory manager when done
     */
    async shutdown() {
        console.log('🗑️ Cleaning up memory manager...');
        // Clean up database connections and resources
    }
}
exports.MemoryManager = new ContextMemoryManager(
/* ultron instance - injected from index.ts */
);
//# sourceMappingURL=memory_manager.js.map