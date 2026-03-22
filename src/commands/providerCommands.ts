import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { ProviderService } from '../core/providerService';
import { Provider, ProviderConfig, ProviderType } from '../types';
import { providerPresets, createProviderFromPreset } from '../config/providerPresets';

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
      console.log(chalk.gray('\nUsage: ccs provider switch <number|name|id>'));
      console.log(chalk.gray('Example: ccs provider switch 1 or ccs provider switch claude'));
      console.log('');
    });

  // 添加提供商
  providerCmd
    .command('add')
    .description('Add a new provider')
    .action(async () => {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'usePreset',
          message: 'Use a preset or create custom?',
          choices: [
            { name: 'Use preset (recommended)', value: true },
            { name: 'Create custom', value: false }
          ]
        }
      ]);

      if (answers.usePreset) {
        // 从预设创建
        const presetAnswers = await inquirer.prompt([
          {
            type: 'list',
            name: 'preset',
            message: 'Select preset:',
            choices: providerPresets.map(p => ({
              name: `${p.name} (${p.providerType}) - ${p.description || ''}`,
              value: p.name
            }))
          }
        ]);

        const preset = providerPresets.find(p => p.name === presetAnswers.preset);
        if (!preset) {
          console.log(chalk.red('Preset not found'));
          return;
        }

        const questions = [];
        if (preset.requiresApiKey) {
          questions.push({
            type: 'input',
            name: 'apiKey',
            message: `${preset.apiKeyName || 'API Key'}:`,
            validate: (input: string) => input.length > 0 || 'API Key is required'
          });
        }

        questions.push({
          type: 'input',
          name: 'customName',
          message: 'Custom name (optional):',
          default: preset.name
        });

        const presetAnswers2 = await inquirer.prompt(questions);

        const spinner = ora('Creating provider...').start();
        try {
          const provider = createProviderFromPreset(
            preset,
            Date.now().toString(),
            presetAnswers2.apiKey || '',
            presetAnswers2.customName
          );

          ProviderService.addProviderFromPreset(provider);
          spinner.succeed(`Provider "${provider.name}" created successfully`);
          console.log(chalk.gray(`  ID: ${provider.id}`));
        } catch (error) {
          spinner.fail(`Failed to create provider: ${error}`);
        }
      } else {
        // 自定义创建
        const customAnswers = await inquirer.prompt([
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
          apiKey: customAnswers.apiKey || undefined,
          apiEndpoint: customAnswers.apiEndpoint || undefined,
          model: customAnswers.model || undefined
        };

        const spinner = ora('Adding provider...').start();
        try {
          const provider = ProviderService.addProvider(customAnswers.name, customAnswers.type, config);
          spinner.succeed(`Provider "${provider.name}" added successfully`);
          console.log(chalk.gray(`  ID: ${provider.id}`));
        } catch (error) {
          spinner.fail(`Failed to add provider: ${error}`);
        }
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
        console.log(chalk.gray(`  API Endpoint: ${provider.baseUrl || 'default'}`));
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
      console.log(chalk.gray(`  API Endpoint: ${provider.baseUrl || 'default'}`));
      const model = provider.models.claude || provider.models.codex || provider.models.gemini;
      if (model) {
        console.log(chalk.gray(`  Model: ${model}`));
      }
      console.log('');
    });
}
