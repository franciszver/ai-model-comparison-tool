#!/usr/bin/env node

import { Command } from 'commander';
import { createCompareCommand } from './commands/compare';
import { createAnalyzeCommand } from './commands/analyze';

const program = new Command();

program
  .name('ai-model-compare')
  .description('CLI tool for comparing multiple AI models via OpenRouter')
  .version('1.0.0');

// Add commands
program.addCommand(createCompareCommand());
program.addCommand(createAnalyzeCommand());

// Parse arguments
program.parse();


