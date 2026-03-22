import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import db from '../database/db';
import { v4 as uuidv4 } from 'uuid';

export function registerSessionCommands(program: Command): void {
  const sessionCmd = program
    .command('session')
    .description('Manage sessions');

  // 列出会话
  sessionCmd
    .command('list')
    .description('List all sessions')
    .option('-a, --app <app>', 'Filter by app ID')
    .action((options) => {
      let sessions = db.getSessions();

      if (options.app) {
        sessions = sessions.filter(s => s.appId === options.app);
      }

      // 按更新时间排序
      sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      if (sessions.length === 0) {
        console.log(chalk.yellow('No sessions found'));
        return;
      }

      console.log(chalk.bold('\n📋 Sessions:\n'));
      sessions.forEach((session, index) => {
        const date = new Date(session.updatedAt).toLocaleDateString();
        console.log(`  ${index + 1}. ${chalk.cyan(session.title || 'Untitled')} ${chalk.gray(`(${session.appId})`)}`);
        console.log(`     ${chalk.gray(date)}`);
      });
      console.log('');
    });

  // 查看会话详情
  sessionCmd
    .command('view')
    .description('View session details')
    .argument('[id]', 'Session ID')
    .action(async (id?: string) => {
      let sessions = db.getSessions();

      if (sessions.length === 0) {
        console.log(chalk.yellow('No sessions found'));
        return;
      }

      // 按更新时间排序
      sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      let sessionId = id;
      if (!sessionId) {
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'session',
            message: 'Select session to view:',
            choices: sessions.map(s => ({
              name: `${s.title || 'Untitled'} (${s.appId})`,
              value: s.id
            }))
          }
        ]);
        sessionId = answers.session;
      }

      const session = sessions.find(s => s.id === sessionId);

      if (!session) {
        console.log(chalk.red('Session not found'));
        return;
      }

      console.log(chalk.bold('\n📄 Session Details:\n'));
      console.log(chalk.cyan(`  Title: ${session.title || 'Untitled'}`));
      console.log(chalk.gray(`  App: ${session.appId}`));
      console.log(chalk.gray(`  Created: ${new Date(session.createdAt).toLocaleString()}`));
      console.log(chalk.gray(`  Updated: ${new Date(session.updatedAt).toLocaleString()}`));
      console.log('\n' + chalk.gray('Content:'));
      console.log(session.content);
      console.log('');
    });

  // 删除会话
  sessionCmd
    .command('delete')
    .description('Delete a session')
    .argument('[id]', 'Session ID')
    .action(async (id?: string) => {
      let sessions = db.getSessions();

      if (sessions.length === 0) {
        console.log(chalk.yellow('No sessions found'));
        return;
      }

      // 按更新时间排序
      sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      let sessionId = id;
      if (!sessionId) {
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'session',
            message: 'Select session to delete:',
            choices: sessions.map(s => ({
              name: `${s.title || 'Untitled'} (${s.appId})`,
              value: s.id
            }))
          }
        ]);
        sessionId = answers.session;
      }

      const session = sessions.find(s => s.id === sessionId);

      if (!session) {
        console.log(chalk.red('Session not found'));
        return;
      }

      const confirm = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Delete session "${session.title || 'Untitled'}"?`,
          default: false
        }
      ]);

      if (confirm.confirm && sessionId) {
        db.deleteSession(sessionId);
        console.log(chalk.green('✓ Session deleted'));
      }
    });

  // 清空所有会话
  sessionCmd
    .command('clear')
    .description('Clear all sessions')
    .action(async () => {
      const confirm = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Are you sure you want to delete all sessions?',
          default: false
        }
      ]);

      if (confirm.confirm) {
        const sessions = db.getSessions();
        sessions.forEach(s => db.deleteSession(s.id));
        console.log(chalk.green('✓ All sessions cleared'));
      }
    });
}
