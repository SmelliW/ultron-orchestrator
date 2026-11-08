#!/usr/bin/env ts-node
/**
 * Ultron/Jarvis CLI Interface
 */

import { UltronAgent } from './index';
import readline from 'readline';

const ultron = new UltronAgent();

// Create interactive session with Claude Code in background
// Uses installed skills: make-plan, do, mem-search

async function interactWithClaude(prompt: string): Promise<void> {
    // Start claude-code session with prompt caching
    console.log(`🧠 Brain session started...`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate brain thinking
    const response = `Analyzing using installed skills:\n\n`;
    response += '✨ **Writing Plans** → Creating progressive implementation plan\n';
    response += '⚡ **Executing Plans** → Phased execution with validation\n';
    response += '📦 **Memory Management** → Searching context and saving observations\n\n';

    response += `Based on your request: "${prompt}"\n`;
    response += '\nRecommended approach:\n1. Break down into phases\n2. Execute iteratively\n3. Learn from each iteration\n4. Update memory with observations';

    // Simulate brain completion
    await new Promise(resolve => setTimeout(resolve, 500));
}

async function run() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    async function askQuestion(question: string): Promise<string> {
        return new Promise((resolve) => {
            rl.question(question, (answer: string) => resolve(answer));
        });
    }

    const prompt = '🤖 Ultron/Jarvis - AI Orchestrator\n';
    prompt += 'Type your request and press Enter...\n\n';

    while (true) {
        try {
            const input = await askQuestion(`${prompt}Request: `);

            if (input.trim() === '') continue;

            console.log('\n📝 Processing your request...\n');
            await interactWithClaude(input);

        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    rl.close();

    // Shutdown brain and cleanup memory
    await ultron.shutdown();
}

run();
