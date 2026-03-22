# CC Switch CLI 使用说明

## 切换提供商

现在支持四种方式切换提供商：

### 1. 通过序号切换（推荐）
```bash
# 切换到第 1 个提供商
cc-switch provider switch 1

# 切换到第 4 个提供商
cc-switch provider switch 4
```

### 2. 通过名称切换
```bash
# 通过完整名称
cc-switch provider switch "Claude Official"

# 通过部分名称（不区分大小写）
cc-switch provider switch claude
cc-switch provider switch xiaomi
```

### 3. 通过 ID 前缀切换（推荐）
```bash
# 使用显示的 ID 前缀（前 8 个字符）
cc-switch provider switch bd065723
cc-switch provider switch 6df92add
```

### 4. 通过完整 ID 切换
```bash
# 通过完整 UUID
cc-switch provider switch bd065723-4e5f-4a8b-9c1d-1234567890ab
```

### 4. 交互式选择
```bash
# 不带参数，会显示选择列表
cc-switch provider switch
```

## 删除提供商

同样支持三种方式：

### 1. 通过序号删除
```bash
cc-switch provider remove 2
```

### 2. 通过名称删除
```bash
cc-switch provider remove "Codex Official"
```

### 3. 交互式选择
```bash
cc-switch provider remove
```

## 查看提供商列表

```bash
cc-switch provider list
```

输出示例：
```
📋 Available Providers:

  1. ✓ Claude Official (claude)
  2. ○ Codex Official (codex)
  3. ○ Gemini Official (gemini)
  4. ○ xiaomi (claude)
```

- `✓` 表示当前启用的提供商
- `○` 表示未启用的提供商

## 查看当前提供商

```bash
cc-switch provider current
```

输出示例：
```
🎯 Current Provider:

  Name: Claude Official
  Type: claude
  API Endpoint: https://api.anthropic.com/v1
  Model: claude-3-5-sonnet-20241022
```

## 常见问题

### Q: 为什么切换时显示 "Provider not found"？
A: 请先运行 `cc-switch provider list` 查看可用的提供商和它们的序号。

### Q: 如何添加新的提供商？
A: 运行 `cc-switch provider add` 或 `cc-switch preset import`。

### Q: 配置文件在哪里？
A: 配置文件存储在 `~/.cc-switch/` 目录下：
- `data.json` - 主数据文件
- `configs/` - 各 AI 工具的配置文件
