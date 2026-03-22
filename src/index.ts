#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { registerProviderCommands } from './commands/providerCommands';
import { registerConfigCommands } from './commands/configCommands';
import { registerSessionCommands } from './commands/sessionCommands';
import { registerMcpCommands } from './commands/mcpCommands';
import { registerUsageCommands } from './commands/usageCommands';
import { registerPresetCommands } from './commands/presetCommands';

const program = new Command();

program
  .name('cc-switch')
  .description('AI CLI Tool Manager - Switch between Claude, Codex, Gemini, and more')
  .version('1.0.0');

// 注册所有命令
registerProviderCommands(program);
registerConfigCommands(program);
registerSessionCommands(program);
registerMcpCommands(program);
registerUsageCommands(program);
registerPresetCommands(program);

// 添加帮助命令
program
  .command('help')
  .description('Show help')
  .action(() => {
    program.outputHelp();
  });

// 解析命令行参数
program.parse(process.argv);

// 如果没有提供命令，显示帮助
if (!process.argv.slice(2).length) {
  console.log(chalk.bold('\n🤖 CC Switch - AI CLI Tool Manager\n'));
  console.log(chalk.gray('Usage: cc-switch <command> [options]\n'));
  console.log(chalk.bold('Available commands:'));
  console.log('  provider    Manage AI providers');
  console.log('  preset      Manage provider presets');
  console.log('  config      Manage configuration');
  console.log('  session     Manage sessions');
  console.log('  mcp         Manage MCP configurations');
  console.log('  usage       View usage statistics');
  console.log('  help        Show help');
  console.log('\nRun "cc-switch <command> --help" for more information on a command.');
  console.log('');
}
