#!/usr/bin/env tsx

/**
 * CCS CLI 版本更新脚本
 *
 * 用法: tsx scripts/bump-version.ts [patch|minor|major]
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import inquirer from 'inquirer';

type VersionType = 'patch' | 'minor' | 'major';

function getCurrentVersion(): string {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
  return pkg.version;
}

function checkGitStatus(): boolean {
  try {
    execSync('git diff --quiet', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function runCommand(cmd: string): string {
  return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' }).trim();
}

async function main() {
  const args = process.argv.slice(2);
  const versionType = args[0] as VersionType;

  // 验证版本类型
  if (!['patch', 'minor', 'major'].includes(versionType)) {
    console.error('错误: 版本类型必须是 patch、minor 或 major');
    console.error('用法: tsx scripts/bump-version.ts [patch|minor|major]');
    process.exit(1);
  }

  console.log('🚀 开始更新版本号 (%s)...\n', versionType);

  // 1. 检查 Git 状态
  console.log('1. 检查 Git 状态...');
  if (!checkGitStatus()) {
    console.error('⚠️  检测到未提交的更改，请先提交:');
    execSync('git status', { stdio: 'inherit' });
    process.exit(1);
  }
  console.log('✅ Git 工作区干净\n');

  // 2. 获取当前版本
  const currentVersion = getCurrentVersion();
  console.log('当前版本: %s\n', currentVersion);

  // 3. 确认更新
  const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: 'confirm',
      name: 'confirm',
      message: `确认更新 ${versionType} 版本?`,
      default: false,
    },
  ]);

  if (!confirm) {
    console.log('❌ 版本更新已取消');
    process.exit(1);
  }

  // 4. 更新版本号
  console.log('2. 更新版本号...');
  runCommand(`npm version ${versionType}`);
  const newVersion = getCurrentVersion();
  console.log('✅ 版本已更新: %s → %s\n', currentVersion, newVersion);

  // 5. 构建项目
  console.log('3. 构建项目...');
  runCommand('npm run build');
  console.log('✅ 构建成功\n');

  // 6. 推送到 GitHub
  console.log('4. 推送到 GitHub...');
  runCommand('git push origin main --tags');
  console.log('✅ 推送成功\n');

  console.log('🎉 GitHub Actions 将自动完成后续发布流程');
  console.log('   查看 Actions: https://github.com/Delta1035/ccs-cli/actions\n');
}

main().catch((err) => {
  console.error('错误:', err);
  process.exit(1);
});
