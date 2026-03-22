#!/bin/bash

# CC Switch CLI 使用示例

echo "=== CC Switch CLI 使用示例 ==="
echo

# 1. 查看可用预设
echo "1. 查看可用预设:"
cc-switch preset list
echo

# 2. 添加 Claude Official 预设（需要 API Key）
echo "2. 添加 Claude Official 预设:"
echo "   运行: cc-switch preset import"
echo "   选择: Claude Official"
echo "   输入 API Key: your-api-key-here"
echo

# 3. 列出所有提供商
echo "3. 列出所有提供商:"
cc-switch provider list
echo

# 4. 切换提供商
echo "4. 切换提供商:"
echo "   运行: cc-switch provider switch"
echo "   选择要切换的提供商"
echo

# 5. 查看当前提供商
echo "5. 查看当前提供商:"
cc-switch provider current
echo

# 6. 添加 MCP 配置
echo "6. 添加 MCP 配置:"
echo "   运行: cc-switch mcp add"
echo "   输入名称、命令等信息"
echo

# 7. 查看使用统计
echo "7. 查看使用统计:"
cc-switch usage stats
echo

echo "=== 示例完成 ==="
