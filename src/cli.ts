#!/usr/bin/env node
import { Command } from 'commander';
import { scan } from './lib/scan.js';

const program = new Command();

program
  .name('portscan')
  .description('Which process is using port X? Show PIDs, paths, stale ports.')
  .version('1.0.0');

program
  .argument('[port]')
  .description('Port number to scan')
  .option('-a, --all', 'Scan all active ports')
  .action(scan);

program.parse();