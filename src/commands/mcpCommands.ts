import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import db from '../database/db';
import { v4 as uuidv4 } from 'uuid';

export function registerMcpCommands(program: Command): void {
  const mcpCmd = program
    .command('mcp')
    .description('Manage MCP (Model Context Protocol) configurations');

  // 列出 MCP 配置
  mcpCmd
    .command('list')
    .description('List all MCP configurations')
    .action(() => {
      const configs = db.getMcpConfigs();

      if (configs.length === 0) {
        console.log(chalk.yellow('No MCP configurations found'));
        return;
      }

      console.log(chalk.bold('\n🔧 MCP Configurations:\n'));
      configs.forEach((config, index) => {
        console.log(`  ${index + 1}. ${chalk.cyan(config.name)}`);
        console.log(`     Command: ${chalk.gray(config.command)}`);
        if (config.args && config.args.length > 0) {
          console.log(`     Args: ${chalk.gray(config.args.join(', '))}`);
        }
      });
      console.log('');
    });

  // 添加 MCP 配置
  mcpCmd
    .command('add')
    .description('Add a new MCP configuration')
    .action(async () => {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'MCP name:',
          validate: (input) => input.length > 0 ? true : 'Name is required'
        },
        {
          type: 'input',
          name: 'command',
          message: 'Command:',
          validate: (input) => input.length > 0 ? true : 'Command is required'
        },
        {
          type: 'input',
          name: 'args',
          message: 'Arguments (comma-separated):'
        },
        {
          type: 'input',
          name: 'env',
          message: 'Environment variables (KEY=VALUE, comma-separated):'
        }
      ]);

      const args = answers.args ? answers.args.split(',').map((a: string) => a.trim()) : [];
      const env: Record<string, string> = {};
      if (answers.env) {
        answers.env.split(',').forEach((e: string) => {
          const [key, value] = e.trim().split('=');
          if (key && value) {
            env[key] = value;
          }
        });
      }

      const spinner = ora('Adding MCP configuration...').start();
      try {
        const id = uuidv4();
        db.addMcpConfig({
          id,
          name: answers.name,
          command: answers.command,
          args,
          env,
          createdAt: new Date().toISOString()
        });
        spinner.succeed(`MCP configuration "${answers.name}" added successfully`);
      } catch (error) {
        spinner.fail(`Failed to add MCP configuration: ${error}`);
      }
    });

  // 删除 MCP 配置
  mcpCmd
    .command('remove')
    .description('Remove an MCP configuration')
    .argument('[name]', 'MCP name')
    .action(async (name?: string) => {
      const configs = db.getMcpConfigs();

      if (configs.length === 0) {
        console.log(chalk.yellow('No MCP configurations found'));
        return;
      }

      let configName = name;
      if (!configName) {
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'config',
            message: 'Select MCP configuration to remove:',
            choices: configs.map(c => ({ name: c.name, value: c.name }))
          }
        ]);
        configName = answers.config;
      }

      const confirm = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Remove MCP configuration "${configName}"?`,
          default: false
        }
      ]);

      if (confirm.confirm && configName) {
        db.deleteMcpConfig(configName);
        console.log(chalk.green(`✓ MCP configuration "${configName}" removed`));
      }
    });
}
