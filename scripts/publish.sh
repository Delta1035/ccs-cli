#!/bin/bash

# CCS CLI 发布脚本

set -e  # 遇到错误立即退出

echo "🚀 开始发布 CCS CLI 到 NPM..."
echo ""

# 1. 检查是否登录 NPM
echo "1. 检查 NPM 登录状态..."
if ! npm whoami &> /dev/null; then
    echo "❌ 未登录 NPM，请先登录:"
    echo "   npm login"
    exit 1
fi
echo "✅ 已登录 NPM: $(npm whoami)"
echo ""

# 2. 检查是否有未提交的更改
echo "2. 检查 Git 状态..."
if ! git diff --quiet; then
    echo "⚠️  检测到未提交的更改，请先提交:"
    git status
    exit 1
fi
echo "✅ Git 工作区干净"
echo ""

# 3. 运行测试
echo "3. 运行测试..."
npm run build
echo "✅ 构建成功"
echo ""

# 4. 显示将要发布的包信息
echo "4. 包信息预览:"
echo "   名称: $(node -p "require('./package.json').name")"
echo "   版本: $(node -p "require('./package.json').version")"
echo "   描述: $(node -p "require('./package.json').description")"
echo ""

# 5. 确认发布
read -p "确认发布到 NPM? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 发布已取消"
    exit 1
fi

# 6. 发布到 NPM
echo "5. 发布到 NPM..."
npm publish --access public

echo ""
echo "✅ 发布成功！"
echo ""
echo "安装命令:"
echo "   npm install -g $(node -p "require('./package.json').name")"
echo ""
echo "查看包页面:"
echo "   https://www.npmjs.com/package/$(node -p "require('./package.json').name")"
