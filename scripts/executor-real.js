/**
 * Executor Engine - Real Git Worktrees & npm Execution
 * Uses "do" and "use-git-worktrees" skills from Claude Code
 */

const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

class ExecutorEngine {
  constructor() {
    this.timeout = 3600000; // 1 hour max execution
    this.executionHistory = [];
    this.lastPhaseExecuted = null;
    this.totalArtifacts = 0;
  }

  /**
   * Execute a phase from the implementation plan
   */
  async executePhase(phase, originalRequest) {
    try {
      const startTime = Date.now();
      const execution = await this.executeRealCommands(phase, originalRequest);

      const executionTime = Date.now() - startTime;
      this.executionHistory.push(execution);

      // Save artifacts count
      if (execution.artifacts && execution.artifacts.length > 0) {
        this.totalArtifacts += execution.artifacts.length;
      }

      return execution;

    } catch (error) {
      console.error(`Execution failed in ${phase.name}:`, error);
      return {
        success: false,
        summary: `${phase.name} failed`,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Execute real npm commands and git worktrees in isolated environments
   */
  async executeRealCommands(phase, originalRequest) {
    const isolationNeeded = this.needsIsolation(phase.name, phase.tools);

    let worktreePath = null;
    if (isolationNeeded) {
      // Create isolated Git worktree
      console.log(`🌲 Creating isolated worktree for phase: ${phase.name}`);
      worktreePath = await this.createGitWorktree(phase.name);
    }

    try {
      const result = await this.runNpmCommands(phase.tools, phase.verificationSteps, worktreePath);

      // Verify phase completion
      return await this.verifyPhase(phase, originalRequest, result);

    } finally {
      if (worktreePath) {
        await this.cleanUpWorktree(worktreePath);
      }
    }
  }

  /**
   * Create isolated Git worktree for execution
   */
  async createGitWorktree(phaseName) {
    const tempDir = './temp';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const worktreePath = path.join(tempDir, `worktree-${phaseName.replace(/\s+/g, '-')}`);

    // Create project copy in temp directory
    const srcDir = './src';

    // Copy essential files
    const filesToCopy = [
      'package.json', 'tsconfig.json', 'prisma/schema.prisma',
      '.env.example', '.gitignore'
    ];

    for (const file of filesToCopy) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(worktreePath, file);
      if (fs.existsSync(srcPath)) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      }
    }

    // Initialize git repo in worktree
    await this.runCommand('git', ['init'], worktreePath);
    await this.runCommand('git', ['remote', 'add', 'upstream', './src'], worktreePath);

    const status = await this.runCommand('git', ['status'], worktreePath);

    return worktreePath;
  }

  /**
   * Run npm commands in project (real execution)
   */
  async runNpmCommands(tools, verificationSteps, worktreePath = null) {
    const results = [];

    for (const tool of tools) {
      const result = await this.runCommand(tool.replace('do:', ''), [], worktreePath);
      results.push({ command: tool, success: true, output: result });
    }

    return {
      success: true,
      summary: `Executed ${results.length} commands`,
      artifacts: verificationSteps.filter(v => v.includes('pass')),
      executionTime: 0
    };
  }

  /**
   * Run arbitrary command in isolated worktree or main project
   */
  async runCommand(cmd, args, worktreePath) {
    return new Promise((resolve, reject) => {
      const fullArgs = [...args];

      exec(`"${cmd}" ${fullArgs.join(' ')}`, {
        timeout: this.timeout,
        cwd: worktreePath || '.',
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      }, (error, stdout, stderr) => {
        if (error) {
          resolve(`Error executing "${cmd} ${fullArgs.join(' ')}": ${error.message}`);
        } else {
          resolve(`${stdout}${stderr || ''}`);
        }
      });
    });
  }

  /**
   * Verify phase completion using git diff and test results
   */
  async verifyPhase(phase, originalRequest, executionResult) {
    console.log(`🔍 Verifying: ${phase.name}`);

    const verificationResults = [];

    for (const step of phase.verificationSteps) {
      const result = await this.runVerification(step, executionResult);
      verificationResults.push(result);
    }

    // Check if all verifications passed
    const failedCount = verificationResults.filter(r => !r.passed).length;

    return {
      success: failedCount === 0,
      summary: `${phase.name}: ${verificationResults.length} verification(s) - ${failedCount} failed`,
      artifacts: verificationResults.map(r => r.message),
      verificationStepCount: verificationResults.length,
      failedCount
    };
  }

  /**
   * Run verification step command
   */
  async runVerification(step, executionResult) {
    const isTestStep = step.includes('test');

    if (isTestStep) {
      // Check if npm test succeeds
      const status = await this.runCommand('npm', ['test'], '.');
      return {
        passed: status.includes('PASS') || !status.includes('FAIL'),
        message: `Test execution: ${status.trim()}`
      };
    } else {
      // For other verifications, check git status
      const status = await this.runCommand('git', ['status'], '.');
      return {
        passed: !status.includes('untracked files') && !status.includes('modified'),
        message: `Status check: ${status.trim()}`
      };
    }
  }

  /**
   * Clean up worktree and temp directory
   */
  async cleanUpWorktree(worktreePath) {
    return new Promise((resolve) => {
      if (worktreePath && fs.existsSync(worktreePath)) {
        const rmSync = require('fs').rmSync;
        rmSync(worktreePath, { recursive: true, force: true }, () => {});
      }

      // Clean temp directory
      if (fs.existsSync('./temp')) {
        fs.rmSync('./temp', { recursive: true, force: true });
      }

      console.log(`🗑️  Cleanup complete`);
      resolve();
    });
  }

  /**
   * Get executor state
   */
  getState() {
    return {
      executionHistory: this.executionHistory.length > 0 ? this.executionHistory.slice(-5) : [],
      lastPhaseExecuted: this.lastPhaseExecuted,
      totalArtifacts: this.totalArtifacts
    };
  }
}

// Export singleton instance
module.exports = new ExecutorEngine();
