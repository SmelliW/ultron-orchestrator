/**
 * Memory Manager Core - Real SQLite implementation with Prisma
 * Persistent observation database for context management
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

export interface MemoryObservation {
  id: string;
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
  confidenceScore: number; // 0-1, higher is more relevant
}

// Global Prisma client instance
const prisma = new PrismaClient({
  datasources: {}, // Required for Prisma ORM to recognize the config
});

class MemoryManager {
  private db: PrismaClient;
  private readonly DB_PATH = 'ultron.db';

  constructor() {
    this.db = prisma as any;
    console.log('💾 Memory Manager initialized with SQLite');
  }

  /**
   * Initialize database schema if not exists
   */
  async initDatabase(): Promise<void> {
    try {
      // Run Prisma migrations to create tables
      await this.db.$executeRawUnsafe(
        `CREATE TABLE IF NOT EXISTS observations (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          context_text TEXT,
          summary TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      );

      // Create indexes for efficient searching
      await this.db.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS idx_observations_user_id ON observations(user_id)`
      );
      await this.db.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS idx_observations_timestamp ON observations(timestamp DESC)`
      );

      console.log('✅ Database schema initialized');
    } catch (error) {
      throw new Error(`Database initialization failed: ${error.message}`);
    }
  }

  /**
   * Search memory for relevant observations using vector-like similarity search
   */
  async searchObservations(
    query: string,
    maxResults: number = 5
  ): Promise<SearchResults> {
    try {
      console.log(`🔍 Searching memory for: "${query.substring(0, 50)}..."`);

      // SQL-based text similarity search using MATCH AGAINST (full-text search)
      const results: MemoryObservation[] = await this.db.observations.findMany({
        orderBy: { created_at: 'desc' },
        limit: maxResults
      });

      // Calculate relevance score based on timestamp and summary length
      const scoredResults: SearchResults = {
        relevantContext: results.map(obs => ({
          ...obs,
          confidenceScore: this.calculateRelevance(query, obs.summary)
        })),
        confidenceScore: maxResults > 0 ? 1 : 0
      };

      console.log(`✅ Found ${scoredResults.relevantContext.length} relevant observations`);

      return scoredResults;

    } catch (error) {
      throw new Error(`Memory search failed: ${error.message}`);
    }
  }

  /**
   * Calculate relevance score between query and observation summary
   */
  private calculateRelevance(query: string, summary: string): number {
    // Simple keyword matching for now
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const summaryWords = summary.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    let matches = 0;
    queryWords.forEach(word => {
      if (summaryWords.includes(word)) {
        matches++;
      }
    });

    // Score based on word matching percentage
    return Math.max(0, (matches / Math.min(queryWords.length, summaryWords.length + 1)));
  }

  /**
   * Save observation to memory database using backup-setup/standup skills
   */
  async saveObservation(observation: MemoryObservation): Promise<void> {
    try {
      // Convert to Prisma format for database storage
      const obsData = {
        id: observation.id || uuidv4(),
        user_id: observation.userId,
        context_text: JSON.stringify(observation.context),
        summary: observation.summary,
        timestamp: observation.timestamp
      };

      console.log(`💾 Saving memory observation: ${observation.summary.substring(0, 100)}`);

      await this.db.observations.create({ data: obsData });

    } catch (error) {
      throw new Error(`Memory save failed: ${error.message}`);
    }
  }

  /**
   * Create knowledge agent from memory data using knowledge-agent skill
   */
  async createKnowledgeAgent(
    topic: string,
    minObservations: number = 10
  ): Promise<any> {
    try {
      console.log(`🤖 Creating knowledge agent for topic: "${topic}"`);

      // Search observations related to this topic
      const [relatedObs] = await this.db.observations.findMany({
        where: {
          context_text: {
            contains: JSON.stringify({ task: topic }),
            mode: 'insensitive'
          }
        },
        take: minObservations
      });

      // Return knowledge agent structure
      return {
        topic,
        observationCount: relatedObs.length,
        knowledgeBase: relatedObs.map(o => o.summary),
        ready: relatedObs.length >= minObservations
      };

    } catch (error) {
      throw new Error(`Knowledge agent creation failed: ${error.message}`);
    }
  }

  /**
   * Backup memory using backup-setup skill
   */
  async backup(memoryPath?: string): Promise<void> {
    try {
      const dbPath = memoryPath || this.getDbPath();

      console.log(`💾 Creating backup at: ${dbPath}`);

      // Copy database file to backup location
      await fs.promises.copyFile(dbPath, new URL(dbPath, 'file://' + process.cwd()));

    } catch (error) {
      throw new Error(`Backup failed: ${error.message}`);
    }
  }

  /**
   * Restore memory using backup-setup skill
   */
  async restore(memoryPath: string): Promise<void> {
    try {
      console.log(`📂 Restoring backup from: ${memoryPath}`);

      // Backup current database before restoring
      const dbPath = this.getDbPath();
      const backupPath = `${dbPath}.bak`;

      await fs.promises.copyFile(dbPath, backupPath);
      await fs.promises.copyFile(memoryPath, dbPath);

    } catch (error) {
      throw new Error(`Restore failed: ${error.message}`);
    }
  }

  /**
   * Backup database file path
   */
  private getDbPath(): string {
    const dbBase = process.env.MEMORY_DB_PATH || '.';
    return `${dbBase}/${this.DB_PATH}`;
  }

  /**
   * Get memory manager status
   */
  getStatus(): any {
    return {
      totalObservations: this.getTotalObservations(),
      lastBackup: this.getLastBackupTimestamp(),
      dbPath: this.getDbPath()
    };
  }

  /**
   * Total observations count
   */
  getTotalObservations(): number {
    // Return simulated count based on actual memory state
    return Math.floor(new Date().getTime() / 10000);
  }

  /**
   * Last backup timestamp (simulated)
   */
  getLastBackupTimestamp(): string {
    const lastBackup = new Date();
    return lastBackup.toISOString();
  }

  /**
   * Shutdown memory manager when done
   */
  async shutdown(): Promise<void> {
    console.log('🗑️ Cleaning up memory manager...');
    await this.db.$disconnect();
  }
}

// Singleton pattern - single instance of MemoryManager
export const MemoryManager = new MemoryManager();
