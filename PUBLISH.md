# CCS CLI 发布指南

## 📋 发布前检查清单

### 1. 更新 package.json

确保以下字段已正确设置：

```json
{
  "name": "@delta1035/ccs-cli",           // 包名称（必须唯一）
  "version": "1.0.0",          // 版本号
  "description": "...",        // 描述
  "author": {                  // 作者信息
    "name": "Your Name",
    "email": "528491526@qq.com"
  },
  "repository": {              // 仓库信息
    "type": "git",
    "url": "https://github.com/Delta1035/ccs-cli.git"
  }
}
```

### 2. 检查依赖

```bash
# 检查过时的依赖
npm outdated

# 更新依赖（可选）
npm update
```

### 3. 构建项目

```bash
npm run build
```

### 4. 测试 CLI

```bash
# 本地测试
node dist/index.js --help

# 全局安装测试
npm install -g .
ccs --help
```

## 🚀 发布步骤

### 方法 1: 使用发布脚本（推荐）

```bash
# 运行发布脚本
./scripts/publish.sh
```

### 方法 2: 手动发布

#### 步骤 1: 登录 NPM

```bash
npm login
```

输入你的 NPM 用户名、密码和邮箱。

#### 步骤 2: 检查包名是否可用

```bash
npm search @delta1035/ccs-cli
```

如果包名已被占用，需要修改 `package.json` 中的 `name` 字段。

#### 步骤 3: 发布到 NPM

```bash
# 发布到公共仓库
npm publish --access public
```

#### 步骤 4: 验证发布

```bash
# 检查包是否已发布
npm view @delta1035/ccs-cli

# 测试安装
npm install -g @delta1035/ccs-cli
ccs --help
```

## 🔄 版本管理

### 语义化版本

遵循 [SemVer](https://semver.org/) 规范：

- **主版本号 (MAJOR)**: 不兼容的 API 修改
- **次版本号 (MINOR)**: 向后兼容的功能新增
- **修订号 (PATCH)**: 向后兼容的问题修正

### 更新版本

```bash
# patch 版本 (1.0.0 -> 1.0.1)
npm version patch

# minor 版本 (1.0.0 -> 1.1.0)
npm version minor

# major 版本 (1.0.0 -> 2.0.0)
npm version major
```

### 发布新版本

#### 方法 1: 使用脚本（推荐）

```bash
# 使用自动化脚本
./scripts/bump-version.sh patch  # patch 版本
./scripts/bump-version.sh minor  # minor 版本
./scripts/bump-version.sh major  # major 版本
```

#### 方法 2: 手动更新

```bash
# 1. 更新版本
npm version patch

# 2. 推送到 GitHub
git push origin main --tags

# 3. 发布到 NPM
npm publish --access public
```

## 📦 发布内容

发布的包包含：

- `dist/` - 编译后的 JavaScript 文件
- `README.md` - 项目说明文档
- `USAGE.md` - 使用指南

排除的文件：

- `src/` - 源代码
- `tsconfig.json` - TypeScript 配置
- `examples/` - 示例文件

## 🔧 常见问题

### Q: 包名已被占用怎么办？

A: 修改 `package.json` 中的 `name` 字段，例如：

```json
{
  "name": "@your-username/ccs-cli"
}
```

### Q: 如何撤销发布？

A: NPM 不支持完全删除包，但可以标记为废弃：

```bash
npm deprecate @delta1035/ccs-cli@1.0.0 "This version is deprecated, please update to the latest version"
```

### Q: 如何发布到私有仓库？

A: 如果你有私有 NPM 账户，可以：

```bash
npm publish --access restricted
```

## 📊 发布后检查

1. ✅ 包页面: https://www.npmjs.com/package/@delta1035/ccs-cli
2. ✅ 安装测试: `npm install -g @delta1035/ccs-cli`
3. ✅ 命令测试: `ccs --help`
4. ✅ GitHub Release: 创建新的 Release

## 🎯 发布成功后的操作

### 1. 创建 GitHub Release

```bash
# 在 GitHub 上创建新的 Release
# https://github.com/your-username/ccs-cli/releases/new
```

### 2. 更新文档

- 在 README 中添加安装说明
- 添加版本 badges

### 3. 社交媒体宣传

- Twitter / X
- Reddit (r/node, r/javascript)
- Hacker News
- Dev.to

## 📝 许可证

ISC License
