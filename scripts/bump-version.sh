#!/bin/bash

set -e

# 检查参数
if [ $# -eq 0 ]; then
    echo "用法: ./scripts/bump-version.sh [patch|minor|major]"
    exit 1
fi

VERSION_TYPE=$1

# 验证版本类型
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo "错误: 版本类型必须是 patch、minor 或 major"
    echo "用法: ./scripts/bump-version.sh [patch|minor|major]"
    exit 1
fi

echo "🚀 开始更新版本号 ($VERSION_TYPE)..."

# 1. 检查是否有未提交的更改
echo "1. 检查 Git 状态..."
if ! git diff --quiet; then
    echo "⚠️  检测到未提交的更改，请先提交:"
    git status
    exit 1
fi
echo "✅ Git 工作区干净"
echo ""

# 2. 获取当前版本
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "当前版本: $CURRENT_VERSION"
echo ""

# 3. 确认更新
read -p "确认更新 $VERSION_TYPE 版本? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 版本更新已取消"
    exit 1
fi

# 4. 更新版本号
echo "2. 更新版本号..."
npm version $VERSION_TYPE
NEW_VERSION=$(node -p "require('./package.json').version")
echo "✅ 版本已更新: $CURRENT_VERSION → $NEW_VERSION"
echo ""

# 5. 构建项目
echo "3. 构建项目..."
npm run build
echo "✅ 构建成功"
echo ""

# 6. 推送到 GitHub
echo "4. 推送到 GitHub..."
git push origin main --tags
echo "✅ 推送成功"
echo ""

# 7. 发布到 NPM
echo "5. 发布到 NPM..."
npm publish --access public
echo "✅ 发布成功"
echo ""

echo "🎉 版本更新完成！"
echo ""
echo "新版本信息:"
echo "  名称: $(node -p "require('./package.json').name")"
echo "  版本: $NEW_VERSION"
echo ""
echo "安装命令:"
echo "  npm install -g $(node -p "require('./package.json').name")"
echo ""
echo "查看包页面:"
echo "  https://www.npmjs.com/package/$(node -p "require('./package.json').name")"
