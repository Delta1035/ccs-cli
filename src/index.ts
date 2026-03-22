#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { registerProviderCommands } from './commands/providerCommands';
import { registerConfigCommands } from './commands/configCommands';
import { registerSessionCommands } from './commands/sessionCommands';
import { registerMcpCommands } from './commands/mcpCommands';
import { registerUsageCommands } from './commands/usageCommands';
import { registerPresetCommands } from './commands/presetCommands';
import packageJson from '../package.json';

const program = new Command();

program
  .name('ccs')
  .description('AI CLI Tool Manager - Switch between Claude, Codex, Gemini, and more')
  .version(packageJson.version)
  .enablePositionalOptions()
  .exitOverride((err) => {
    // Only exit for errors, not for normal version/help output
    if (err.exitCode !== 0) {
      process.exit(err.exitCode);
    }
  });

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

// 添加版本命令
program
  .command('version')
  .description('Show version information')
  .action(() => {
    console.log(chalk.bold('\n🤖 CC Switch - AI CLI Tool Manager\n'));
    console.log(chalk.cyan(`  Version: ${program.version()}`));
    console.log(chalk.gray(`  Command: ccs`));
    console.log(chalk.gray(`  Package: @delta1035/ccs-cli`));
    console.log(chalk.gray(`  Repository: https://github.com/Delta1035/ccs-cli`));
    console.log('');
  });

// 检查是否有命令参数
const args = process.argv.slice(2);
const hasArgs = args.length > 0;
const isHelp = args.includes('--help') || args.includes('-h') || args.includes('help');

// 如果没有提供命令且不是help命令，显示自定义帮助
if (!hasArgs || (args.length === 1 && isHelp)) {
  console.log(chalk.bold('\n🤖 CC Switch - AI CLI Tool Manager\n'));
  console.log(chalk.gray(`  Version: ${program.version()}`));
  console.log('');
  console.log(chalk.gray('Usage: ccs <command> [options]\n'));
  console.log(chalk.bold('Available commands:'));
  console.log('  provider    Manage AI providers');
  console.log('  preset      Manage provider presets');
  console.log('  config      Manage configuration');
  console.log('  session     Manage sessions');
  console.log('  mcp         Manage MCP configurations');
  console.log('  usage       View usage statistics');
  console.log('  version     Show version information');
  console.log('  help        Show help');
  console.log('\nRun "ccs <command> --help" for more information on a command.');
  console.log('');
  process.exit(0);
}

// 解析命令行参数
program.parse(process.argv);
