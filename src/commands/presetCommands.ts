import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { providerPresets, createProviderFromPreset, searchPresets } from '../config/providerPresets';
import { saveProvider } from '../core/providerService';

export function registerPresetCommands(program: Command): void {
  const presetCmd = program
    .command('preset')
    .description('Manage provider presets');

  // 列出预设
  presetCmd
    .command('list')
    .description('List all provider presets')
    .action(() => {
      console.log(chalk.bold.cyan('\n📋 Available Provider Presets:\n'));

      providerPresets.forEach((preset, index) => {
        const icon = preset.icon ? chalk.hex(preset.iconColor || '#888')(`[${preset.icon}]`) : '';
        console.log(`  ${index + 1}. ${chalk.bold(preset.name)} ${icon}`);
        console.log(`     ${chalk.gray('Type:')}${preset.providerType}`);
        if (preset.description) {
          console.log(`     ${chalk.gray('Desc:')}${preset.description}`);
        }
        if (preset.websiteUrl) {
          console.log(`     ${chalk.gray('URL:')} ${preset.websiteUrl}`);
        }
        console.log('');
      });

      console.log(chalk.gray(`Total: ${providerPresets.length} presets available`));
    });

  // 导入预设
  presetCmd
    .command('import')
    .description('Import a provider preset')
    .argument('[name]', 'Preset name or search query')
    .action(async (query?: string) => {
      let preset;

      if (!query) {
        // 交互式选择
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'preset',
            message: 'Select preset to import:',
            choices: providerPresets.map(p => ({
              name: `${p.name} (${p.providerType}) - ${p.description || ''}`,
              value: p.name
            }))
          }
        ]);
        preset = providerPresets.find(p => p.name === answers.preset);
      } else {
        // 搜索预设
        const results = searchPresets(query);
        if (results.length === 0) {
          console.log(chalk.red(`No presets found matching "${query}"`));
          return;
        }
        if (results.length === 1) {
          preset = results[0];
        } else {
          // 多个结果，让用户选择
          const answers = await inquirer.prompt([
            {
              type: 'list',
              name: 'preset',
              message: `Found ${results.length} presets, select one:`,
              choices: results.map(p => ({
                name: `${p.name} (${p.providerType})`,
                value: p.name
              }))
            }
          ]);
          preset = providerPresets.find(p => p.name === answers.preset);
        }
      }

      if (!preset) {
        console.log(chalk.red(`Preset not found`));
        return;
      }

      console.log(chalk.bold.cyan(`\n导入预设: ${preset.name}`));
      console.log(chalk.gray(`类型: ${preset.providerType}`));
      console.log(chalk.gray(`描述: ${preset.description || '无'}`));
      console.log('');

      // 收集必要信息
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

      questions.push({
        type: 'input',
        name: 'customBaseUrl',
        message: 'Custom base URL (optional):',
        default: preset.defaultBaseUrl
      });

      const answers = await inquirer.prompt(questions);

      const spinner = ora('Creating provider...').start();
      try {
        const provider = createProviderFromPreset(
          preset,
          Date.now().toString(),
          answers.apiKey || '',
          answers.customName,
          answers.customBaseUrl
        );

        saveProvider(provider);
        spinner.succeed(`Provider "${provider.name}" created successfully`);

        console.log(chalk.green('\n✅ Provider created!'));
        console.log(chalk.gray(`   ID: ${provider.id}`));
        console.log(chalk.gray(`   Name: ${provider.name}`));
        console.log(chalk.gray(`   Type: ${provider.type}`));
        console.log(chalk.gray(`   Base URL: ${provider.baseUrl}`));
        console.log('');
        console.log(chalk.yellow('Tip: Use "ccs provider switch" to activate this provider'));
      } catch (error) {
        spinner.fail(`Failed to create provider: ${error}`);
      }
    });
}
