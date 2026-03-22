import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import os from 'os';

export function registerConfigCommands(program: Command): void {
  const configCmd = program
    .command('config')
    .description('Manage configuration');

  // 显示配置目录
  configCmd
    .command('dir')
    .description('Show configuration directory')
    .action(() => {
      const homeDir = os.homedir();
      const configDir = path.join(homeDir, '.cc-switch');
      console.log(chalk.cyan(`Configuration directory: ${configDir}`));
    });

  // 导出配置
  configCmd
    .command('export')
    .description('Export configuration to file')
    .argument('[file]', 'Output file path')
    .action(async (file?: string) => {
      const homeDir = os.homedir();
      const configDir = path.join(homeDir, '.cc-switch');

      if (!file) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'file',
            message: 'Output file path:',
            default: path.join(process.cwd(), 'cc-switch-config.json')
          }
        ]);
        file = answers.file;
      }

      const spinner = ora('Exporting configuration...').start();
      try {
        // 收集所有配置文件
        const configs: Record<string, any> = {};
        const configFiles = [
          'cc-switch.db',
          'settings.json',
          'configs/claude-config.json',
          'configs/codex-config.json',
          'configs/gemini-config.json'
        ];

        for (const configFile of configFiles) {
          const filePath = path.join(configDir, configFile);
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            configs[configFile] = JSON.parse(content);
          }
        }

        // 写入导出文件
        fs.writeFileSync(file!, JSON.stringify(configs, null, 2), 'utf-8');
        spinner.succeed(`Configuration exported to: ${chalk.cyan(file!)}`);
      } catch (error) {
        spinner.fail(`Failed to export configuration: ${error}`);
      }
    });

  // 导入配置
  configCmd
    .command('import')
    .description('Import configuration from file')
    .argument('[file]', 'Input file path')
    .action(async (file?: string) => {
      if (!file) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'file',
            message: 'Input file path:'
          }
        ]);
        file = answers.file;
      }

      if (!fs.existsSync(file!)) {
        console.log(chalk.red(`File not found: ${file}`));
        return;
      }

      const spinner = ora('Importing configuration...').start();
      try {
        const content = fs.readFileSync(file!, 'utf-8');
        const configs = JSON.parse(content);

        const homeDir = os.homedir();
        const configDir = path.join(homeDir, '.cc-switch');

        // 确保配置目录存在
        if (!fs.existsSync(configDir)) {
          fs.mkdirSync(configDir, { recursive: true });
        }

        // 写入配置文件
        for (const [configFile, data] of Object.entries(configs)) {
          const filePath = path.join(configDir, configFile);
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        }

        spinner.succeed('Configuration imported successfully');
      } catch (error) {
        spinner.fail(`Failed to import configuration: ${error}`);
      }
    });

  // 重置配置
  configCmd
    .command('reset')
    .description('Reset configuration to defaults')
    .action(async () => {
      const confirm = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Are you sure you want to reset all configuration?',
          default: false
        }
      ]);

      if (!confirm.confirm) {
        return;
      }

      const spinner = ora('Resetting configuration...').start();
      try {
        const homeDir = os.homedir();
        const configDir = path.join(homeDir, '.cc-switch');

        // 删除配置目录
        if (fs.existsSync(configDir)) {
          fs.rmSync(configDir, { recursive: true, force: true });
        }

        // 重新初始化
        fs.mkdirSync(configDir, { recursive: true });

        spinner.succeed('Configuration reset to defaults');
      } catch (error) {
        spinner.fail(`Failed to reset configuration: ${error}`);
      }
    });
}
