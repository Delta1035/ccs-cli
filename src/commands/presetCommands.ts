import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { providerPresets, importPreset, listPresets } from './presets';

export function registerPresetCommands(program: Command): void {
  const presetCmd = program
    .command('preset')
    .description('Manage provider presets');

  // 列出预设
  presetCmd
    .command('list')
    .description('List all provider presets')
    .action(() => {
      listPresets();
    });

  // 导入预设
  presetCmd
    .command('import')
    .description('Import a provider preset')
    .argument('[name]', 'Preset name')
    .action(async (name?: string) => {
      if (!name) {
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'preset',
            message: 'Select preset to import:',
            choices: providerPresets.map(p => ({
              name: `${p.name} (${p.type})`,
              value: p.name
            }))
          }
        ]);
        name = answers.preset;
      }

      const preset = providerPresets.find(p => p.name === name);
      if (!preset) {
        console.log(chalk.red(`Preset "${name}" not found`));
        return;
      }

      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'apiKey',
          message: 'API Key (optional):'
        }
      ]);

      const spinner = ora('Importing preset...').start();
      try {
        importPreset(name!, answers.apiKey || undefined);
        spinner.succeed(`Preset "${name}" imported successfully`);
      } catch (error) {
        spinner.fail(`Failed to import preset: ${error}`);
      }
    });
}
