import { Command } from 'commander';
import chalk from 'chalk';
import db from '../database/db';

export function registerUsageCommands(program: Command): void {
  const usageCmd = program
    .command('usage')
    .description('View usage statistics');

  // 显示使用统计
  usageCmd
    .command('stats')
    .description('Show usage statistics')
    .option('-a, --app <app>', 'Filter by app ID')
    .option('-p, --period <period>', 'Filter by period (e.g., 2024-01)')
    .action((options) => {
      let stats = db.getUsageStats();

      if (options.app) {
        stats = stats.filter(s => s.appId === options.app);
      }

      if (options.period) {
        stats = stats.filter(s => s.period === options.period);
      }

      // 按应用分组统计
      const groupedStats: Record<string, { requests: number; tokens: number; cost: number }> = {};
      stats.forEach(stat => {
        if (!groupedStats[stat.appId]) {
          groupedStats[stat.appId] = { requests: 0, tokens: 0, cost: 0 };
        }
        groupedStats[stat.appId].requests += stat.requests;
        groupedStats[stat.appId].tokens += stat.tokens;
        groupedStats[stat.appId].cost += stat.cost;
      });

      const entries = Object.entries(groupedStats).sort((a, b) => b[1].cost - a[1].cost);

      if (entries.length === 0) {
        console.log(chalk.yellow('No usage statistics found'));
        return;
      }

      console.log(chalk.bold('\n📊 Usage Statistics:\n'));
      entries.forEach(([appId, stat], index) => {
        console.log(`  ${index + 1}. ${chalk.cyan(appId)}`);
        console.log(`     Requests: ${chalk.gray(stat.requests)}`);
        console.log(`     Tokens: ${chalk.gray(stat.tokens.toLocaleString())}`);
        console.log(`     Cost: ${chalk.green('$' + stat.cost.toFixed(4))}`);
      });
      console.log('');
    });

  // 显示总成本
  usageCmd
    .command('cost')
    .description('Show total cost')
    .action(() => {
      const stats = db.getUsageStats();
      const totalCost = stats.reduce((sum, stat) => sum + stat.cost, 0);

      console.log(chalk.bold('\n💰 Total Cost:\n'));
      console.log(chalk.green(`  $${totalCost.toFixed(4)}`));
      console.log('');
    });

  // 重置使用统计
  usageCmd
    .command('reset')
    .description('Reset usage statistics')
    .action(() => {
      db.resetUsageStats();
      console.log(chalk.green('✓ Usage statistics reset'));
    });
}
