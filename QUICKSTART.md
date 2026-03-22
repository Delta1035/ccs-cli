# 快速开始

## 📦 安装

```bash
# 通过 npm 全局安装
npm install -g ccs-cli

# 或者使用 yarn
yarn global add ccs-cli
```

## 🚀 快速使用

### 1. 查看帮助

```bash
ccs --help
```

### 2. 添加 AI 提供商

```bash
# 使用交互式添加
ccs provider add

# 或者导入预设
ccs preset import
```

### 3. 切换提供商

```bash
# 列出所有提供商
ccs provider list

# 切换到第 1 个提供商
ccs provider switch 1

# 或者通过名称切换
ccs provider switch claude
```

### 4. 查看当前提供商

```bash
ccs provider current
```

## 📝 示例工作流

```bash
# 1. 查看可用预设
ccs preset list

# 2. 导入 Claude Official 预设
ccs preset import
# 选择: Claude Official
# 输入 API Key: your-api-key

# 3. 列出提供商
ccs provider list

# 4. 切换到 Claude
ccs provider switch 1

# 5. 验证切换成功
ccs provider current
```

## 🔧 配置文件位置

- 数据文件: `~/.cc-switch/data.json`
- 配置文件: `~/.cc-switch/configs/`
- 备份文件: `~/.cc-switch/backups/`

## 🆘 获取帮助

```bash
# 查看所有命令
ccs --help

# 查看特定命令帮助
ccs provider --help
ccs preset --help
```

## 🎯 常用命令速查

| 命令 | 说明 |
|------|------|
| `ccs provider list` | 列出所有提供商 |
| `ccs provider switch 1` | 切换到第 1 个提供商 |
| `ccs provider current` | 查看当前提供商 |
| `ccs preset list` | 列出可用预设 |
| `ccs config dir` | 查看配置目录 |
| `ccs usage stats` | 查看使用统计 |
