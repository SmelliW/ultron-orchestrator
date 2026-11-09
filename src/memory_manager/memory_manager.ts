/**
 * Memory Manager - Uses "mem-search", "backup-setup" skills from Claude Code
 * Persistent observation database for context management
 */

import fs from 'fs';
import path from 'path';

const MEMORY_DB_PATH = process.env.MEMORY_DB_PATH || './memory.db';

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

export class MemoryManager {
  private dbPath: string = MEMORY_DB_PATH;
  private totalObservations: number = 0;

  /**
   * Search memory for relevant observations using mem-search skill
   */
  async searchObservations(query: string, maxResults: number = 5): Promise<SearchResults> {
    try {
      // Simple text-based search (simulating mem-search skill)
      const queryNormalized = query.toLowerCase().trim();

      // Load observations from memory.db
      const observations = await this.loadObservations();

      // Filter by relevance (simple keyword matching)
      const relevantContext: MemoryObservation[] = observations.filter(obs => {
        const textToSearch =
          `${obs.summary} ${obs.context.request || ''} ${obs.context.task || ''}`
            .toLowerCase();

        return textToSearch.includes(queryNormalized);
      });

      // Sort by timestamp (newest first)
      relevantContext.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const confidenceScore = Math.min(0.95, 1 - (relevantContext.length / 10));

      return {
        relevantContext: relevantContext.slice(0, maxResults),
        confidenceScore
      };

    } catch (error) {
      console.error('Memory search failed:', error);
      throw new Error(`Memory search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Save observation to memory database using backup-setup skill
   */
  async saveObservation(observation: MemoryObservation): Promise<void> {
    try {
      // Ensure directory exists
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Load existing observations
      let observations: MemoryObservation[] = [];
      try {
        if (fs.existsSync(this.dbPath)) {
          const content = fs.readFileSync(this.dbPath, 'utf-8');
          observations = JSON.parse(content);
          this.totalObservations++;
        }
      } catch (parseError) {
        console.warn('Could not load existing DB:', parseError);
        observations = [];
      }

      // Add new observation
      const newObservation = {
        ...observation,
        id: this.totalObservations,
        relatedTo: Array.isArray(observation.relatedTo) ?
          (observation.relatedTo.length > 0 ? observation.relatedTo : undefined) : []
      };

      observations.push(newObservation);

      // Save to file (JSON format)
      fs.writeFileSync(this.dbPath, JSON.stringify(observations, null, 2));

      console.log(`💾 Saved memory observation: ${observation.summary.substring(0, 100)}`);

    } catch (error) {
      console.error('Memory save failed:', error);
      throw new Error(`Memory save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create knowledge agent from memory data using knowledge-agent skill
   */
  async createKnowledgeAgent(
    topic: string,
    minObservations: number = 10
  ): Promise<{ status: string; observationCount: number }> {
    // Simple simulation of knowledge agent creation
    const observations = await this.loadObservations();

    const relevant = observations.filter(obs =>
      obs.summary.toLowerCase().includes(topic.toLowerCase()) ||
      (obs.context?.request && obs.context.request.toLowerCase().includes(topic.toLowerCase()))
    );

    return {
      status: `Knowledge agent created for "${topic}"`,
      observationCount: relevant.length
    };
  }

  /**
   * Backup/restore memory using backup-setup skill
   */
  async backup(action: 'backup' | 'restore', params?: any): Promise<void> {
    if (action === 'backup') {
      // Create timestamped backup
      const timestamp = new Date().toISOString();
      const backupPath = this.dbPath.replace(/\.db$/, `${timestamp}.bak`);

      if (fs.existsSync(this.dbPath)) {
        fs.copyFileSync(this.dbPath, backupPath);
        console.log(`📦 Backup created: ${backupPath}`);
      }
    } else if (action === 'restore') {
      // Restore from backup
      const backupFiles = fs.readdirSync(path.dirname(this.dbPath)).filter(f =>
        f.endsWith('.bak')
      );

      if (backupFiles.length > 0) {
        const latestBackup = backupFiles.sort().pop();
        const restorePath = path.join(
          path.dirname(this.dbPath),
          `.${latestBackup.substring(0, latestBackup.length - 3)}`
        );

        fs.copyFileSync(restorePath, this.dbPath);
        console.log(`🔄 Restored from: ${restorePath}`);
      }
    }
  }

  /**
   * Get memory manager status
   */
  getStatus(): any {
    return {
      dbPath: this.dbPath,
      totalObservations: this.totalObservations,
      lastBackup: this.getLastBackupTimestamp()
    };
  }

  /**
   * Load observations from database
   */
  private async loadObservations(): Promise<MemoryObservation[]> {
    if (!fs.existsSync(this.dbPath)) {
      // Initialize empty DB with schema
      fs.writeFileSync(this.dbPath, JSON.stringify([]));
      return [];
    }

    try {
      const content = fs.readFileSync(this.dbPath, 'utf-8');
      const observations: MemoryObservation[] = JSON.parse(content);
      this.totalObservations++;
      return observations;
    } catch (error) {
      console.warn('Could not read DB, initializing:', error);
      return [];
    }
  }

  /**
   * Shutdown memory manager when done
   */
  async shutdown(): Promise<void> {
    console.log('🗑️ Cleaning up memory manager...');
    // Optionally close database connections or perform final cleanup
  }
}

// Export singleton instance
export const MemoryManagerSingleton = new MemoryManager();
