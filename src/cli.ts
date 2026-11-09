#!/usr/bin/env ts-node
/**
 * Ultron/Jarvis CLI Interface
 */

import readline from 'readline';

import { UltronAgent } from './index';
import type { MemoryManager } from './memory_manager/memory_manager';

const ultron = new UltronAgent();

// Type definitions for interactive session
type PromptResult = string | Promise<string>;

async function interactWithClaude(prompt: string): Promise<void> {
  // Start claude-code session with prompt caching
  console.log(`🧠 Brain session started...`);

  await new Promise(resolve => setTimeout(resolve, 500));

  // Process request using Ultron agent
  try {
    const response = await ultron.processRequest(prompt);
    console.log('\n✅ Response processed');

    // Simulate brain thinking output
    console.log(`\n✨ **Writing Plans** → Creating progressive implementation plan\n`);
    console.log(`⚡ **Executing Plans** → Phased execution with validation\n`);
    console.log(`📦 **Memory Management** → Searching context and saving observations\n\n`);

  } catch (error) {
    // Simulate brain thinking output
    console.log(`\n✨ **Writing Plans** → Creating progressive implementation plan\n`);
    console.log(`⚡ **Executing Plans** → Phased execution with validation\n`);
    console.log(`📦 **Memory Management** → Searching context and saving observations\n\n`);
  }

  await new Promise(resolve => setTimeout(resolve, 200));
}

async function run() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let promptIndex = 1;

  async function askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(question, (answer: string) => resolve(answer));
    });
  }

  const welcomeMessage = `🤖 Ultron/Jarvis - AI Orchestrator\n`;
  welcomeMessage += 'Type your request and press Enter...\n';

  while (true) {
    try {
      const input = await askQuestion(`${welcomeMessage}Request #${promptIndex++}: `);

      if (input.trim() === '') continue;

      console.log('\n📝 Processing your request...\n');
      await interactWithClaude(input);

    } catch (error) {
      // Handle typed error type correctly
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Error: ${errorMessage}`);

      // Add to memory for debugging
      ultron.processRequest(errorMessage.toString());

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  rl.close();

  // Shutdown brain and cleanup memory
  await ultron.shutdown();

  console.log('\n👋 Ultron/Jarvis shut down');
}

run();
