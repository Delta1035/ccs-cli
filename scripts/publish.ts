#!/usr/bin/env tsx

/**
 * CCS CLI 发布脚本 (本地发布用)
 *
 * 用法: tsx scripts/publish.ts
 *
 * 注意: 推荐使用 GitHub Actions 自动发布，此脚本仅供本地测试
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import * as readline from 'readline';

interface PackageJson {
  name: string;
  version: string;
  description?: string;
}

function getPackageInfo(): PackageJson {
  return JSON.parse(readFileSync('./package.json', 'utf-8'));
}

function runCommand(cmd: string): string {
  return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' }).trim();
}

function checkNpmLogin(): boolean {
  try {
    runCommand('pnpm whoami');
    return true;
  } catch {
    return false;
  }
}

function checkGitStatus(): boolean {
  try {
    execSync('git diff --quiet', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function askConfirm(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question + ' (y/N): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

async function main() {
  console.log('🚀 开始发布 CCS CLI 到 NPM...\n');

  // 1. 检查 NPM 登录状态
  console.log('1. 检查 NPM 登录状态...');
  if (!checkNpmLogin()) {
    console.error('❌ 未登录 NPM，请先登录:');
    console.error('   pnpm login');
    process.exit(1);
  }
  console.log('✅ 已登录 NPM: %s\n', runCommand('pnpm whoami'));

  // 2. 检查 Git 状态
  console.log('2. 检查 Git 状态...');
  if (!checkGitStatus()) {
    console.error('⚠️  检测到未提交的更改，请先提交:');
    execSync('git status', { stdio: 'inherit' });
    process.exit(1);
  }
  console.log('✅ Git 工作区干净\n');

  // 3. 运行构建
  console.log('3. 运行构建...');
  runCommand('pnpm run build');
  console.log('✅ 构建成功\n');

  // 4. 显示包信息
  const pkg = getPackageInfo();
  console.log('4. 包信息预览:');
  console.log('   名称: %s', pkg.name);
  console.log('   版本: %s', pkg.version);
  console.log('   描述: %s', pkg.description || 'N/A');
  console.log('');

  // 5. 确认发布
  // const confirm = await askConfirm('确认发布到 NPM?');

  // if (!confirm) {
  //   console.log('❌ 发布已取消');
  //   process.exit(1);
  // }

//   // 6. 发布到 NPM
//   console.log('5. 发布到 NPM...');
//   runCommand('pnpm publish --access public');

//   console.log('');
//   console.log('✅ 发布成功!');
//   console.log('');
//   console.log('安装命令:');
//   console.log('   pnpm add -g %s', pkg.name);
//   console.log('');
//   console.log('查看包页面:');
//   console.log('   https://www.npmjs.com/package/%s', pkg.name);
}

main().catch((err) => {
  console.error('错误:', err);
  process.exit(1);
});
