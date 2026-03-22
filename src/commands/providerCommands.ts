import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { ProviderService } from '../core/providerService';
import { Provider, ProviderConfig } from '../types';

export function registerProviderCommands(program: Command): void {
  const providerCmd = program
    .command('provider')
    .description('Manage AI providers');

  // 列出所有提供商
  providerCmd
    .command('list')
    .description('List all providers')
    .action(() => {
      const providers = ProviderService.getAllProviders();
      if (providers.length === 0) {
        console.log(chalk.yellow('No providers found. Add one with: cc-switch provider add'));
        return;
      }

      console.log(chalk.bold('\n📋 Available Providers:\n'));
      providers.forEach((provider, index) => {
        const status = provider.enabled ? chalk.green('✓') : chalk.gray('○');
        const name = chalk.cyan(provider.name);
        const type = chalk.gray(`(${provider.type})`);
        const id = chalk.gray(`[${provider.id.substring(0, 8)}...]`);
        console.log(`  ${index + 1}. ${status} ${name} ${type} ${id}`);
      });
      console.log(chalk.gray('\nUsage: cc-switch provider switch <number|name|id>'));
      console.log(chalk.gray('Example: cc-switch provider switch 1 or cc-switch provider switch claude'));
      console.log('');
    });

  // 添加提供商
  providerCmd
    .command('add')
    .description('Add a new provider')
    .action(async () => {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Provider name:',
          validate: (input) => input.length > 0 ? true : 'Name is required'
        },
        {
          type: 'list',
          name: 'type',
          message: 'Provider type:',
          choices: [
            { name: 'Claude Code', value: 'claude' },
            { name: 'Codex', value: 'codex' },
            { name: 'Gemini CLI', value: 'gemini' },
            { name: 'OpenCode', value: 'opencode' },
            { name: 'OpenClaw', value: 'openclaw' }
          ]
        },
        {
          type: 'input',
          name: 'apiKey',
          message: 'API Key (optional):'
        },
        {
          type: 'input',
          name: 'apiEndpoint',
          message: 'API Endpoint (optional):'
        },
        {
          type: 'input',
          name: 'model',
          message: 'Model (optional):'
        }
      ]);

      const config: ProviderConfig = {
        apiKey: answers.apiKey || undefined,
        apiEndpoint: answers.apiEndpoint || undefined,
        model: answers.model || undefined
      };

      const spinner = ora('Adding provider...').start();
      try {
        const provider = ProviderService.addProvider(answers.name, answers.type, config);
        spinner.succeed(`Provider "${provider.name}" added successfully`);
        console.log(chalk.gray(`  ID: ${provider.id}`));
      } catch (error) {
        spinner.fail(`Failed to add provider: ${error}`);
      }
    });

  // 切换提供商
  providerCmd
    .command('switch')
    .description('Switch to a provider')
    .argument('[input]', 'Provider number, ID, or name')
    .action(async (input?: string) => {
      const providers = ProviderService.getAllProviders();
      if (providers.length === 0) {
        console.log(chalk.yellow('No providers found. Add one with: cc-switch provider add'));
        return;
      }

      let providerId: string | undefined;

      if (input) {
        // 尝试解析输入：序号、ID 或名称
        const num = parseInt(input, 10);
        if (!isNaN(num) && num > 0 && num <= providers.length) {
          // 输入的是序号
          providerId = providers[num - 1].id;
        } else {
          // 尝试匹配 ID（完整或前缀）或名称
          const provider = providers.find(p =>
            p.id === input ||
            p.id.startsWith(input) ||
            p.name.toLowerCase() === input.toLowerCase() ||
            p.name.toLowerCase().includes(input.toLowerCase())
          );
          if (provider) {
            providerId = provider.id;
          }
        }

        if (!providerId) {
          console.log(chalk.red(`Provider not found: ${input}`));
          console.log(chalk.gray('Available providers:'));
          providers.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.name} (${p.type})`);
          });
          return;
        }
      } else {
        // 没有输入，使用交互式选择
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'provider',
            message: 'Select provider to switch to:',
            choices: providers.map((p, i) => ({
              name: `${i + 1}. ${p.name} (${p.type})${p.enabled ? ' (current)' : ''}`,
              value: p.id
            }))
          }
        ]);
        providerId = answers.provider;
      }

      const spinner = ora('Switching provider...').start();
      try {
        const provider = ProviderService.switchProvider(providerId!);
        spinner.succeed(`Switched to provider: ${chalk.cyan(provider.name)}`);
        console.log(chalk.gray(`  Type: ${provider.type}`));
        console.log(chalk.gray(`  API Endpoint: ${provider.config.apiEndpoint || 'default'}`));
      } catch (error) {
        spinner.fail(`Failed to switch provider: ${error}`);
      }
    });

  // 删除提供商
  providerCmd
    .command('remove')
    .description('Remove a provider')
    .argument('[input]', 'Provider number, ID, or name')
    .action(async (input?: string) => {
      const providers = ProviderService.getAllProviders();
      if (providers.length === 0) {
        console.log(chalk.yellow('No providers found.'));
        return;
      }

      let providerId: string | undefined;

      if (input) {
        // 尝试解析输入：序号、ID 或名称
        const num = parseInt(input, 10);
        if (!isNaN(num) && num > 0 && num <= providers.length) {
          // 输入的是序号
          providerId = providers[num - 1].id;
        } else {
          // 尝试匹配 ID（完整或前缀）或名称
          const provider = providers.find(p =>
            p.id === input ||
            p.id.startsWith(input) ||
            p.name.toLowerCase() === input.toLowerCase() ||
            p.name.toLowerCase().includes(input.toLowerCase())
          );
          if (provider) {
            providerId = provider.id;
          }
        }

        if (!providerId) {
          console.log(chalk.red(`Provider not found: ${input}`));
          console.log(chalk.gray('Available providers:'));
          providers.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.name} (${p.type})`);
          });
          return;
        }
      } else {
        // 没有输入，使用交互式选择
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'provider',
            message: 'Select provider to remove:',
            choices: providers.map((p, i) => ({
              name: `${i + 1}. ${p.name} (${p.type})`,
              value: p.id
            }))
          }
        ]);
        providerId = answers.provider;
      }

      const provider = ProviderService.getProviderById(providerId!);
      if (!provider) {
        console.log(chalk.red('Provider not found'));
        return;
      }

      const confirm = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Are you sure you want to remove "${provider.name}"?`,
          default: false
        }
      ]);

      if (confirm.confirm) {
        ProviderService.deleteProvider(providerId!);
        console.log(chalk.green(`✓ Provider "${provider.name}" removed`));
      }
    });

  // 获取当前启用的提供商
  providerCmd
    .command('current')
    .description('Show current provider')
    .action(() => {
      const provider = ProviderService.getEnabledProvider();
      if (!provider) {
        console.log(chalk.yellow('No provider is currently enabled'));
        return;
      }

      console.log(chalk.bold('\n🎯 Current Provider:\n'));
      console.log(chalk.cyan(`  Name: ${provider.name}`));
      console.log(chalk.gray(`  Type: ${provider.type}`));
      console.log(chalk.gray(`  API Endpoint: ${provider.config.apiEndpoint || 'default'}`));
      if (provider.config.model) {
        console.log(chalk.gray(`  Model: ${provider.config.model}`));
      }
      console.log('');
    });
}
