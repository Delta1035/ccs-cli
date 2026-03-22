/**
 * AI 提供商预设配置
 *
 * 包含常见的 AI 服务提供商配置，支持一键导入
 */

import type { Provider, ProviderType } from "../types";

/**
 * 预设接口
 */
export interface ProviderPreset {
  /** 预设名称 */
  name: string;
  /** 提供商类型 */
  providerType: ProviderType;
  /** 默认 API 端点 */
  defaultBaseUrl: string;
  /** 默认模型配置 */
  defaultModels: {
    claude?: string;
    codex?: string;
    gemini?: string;
  };
  /** 网站链接 */
  websiteUrl?: string;
  /** 图标名称 */
  icon?: string;
  /** 图标颜色 */
  iconColor?: string;
  /** 描述 */
  description?: string;
  /** 是否需要 API 密钥 */
  requiresApiKey: boolean;
  /** API 密钥名称（显示用） */
  apiKeyName?: string;
}

/**
 * 预设列表
 */
export const providerPresets: ProviderPreset[] = [
  // === Claude Providers ===
  {
    name: "Claude Official",
    providerType: "claude",
    defaultBaseUrl: "https://api.anthropic.com/v1",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://www.anthropic.com",
    icon: "claude",
    iconColor: "#E99265",
    description: "Anthropic Claude 官方 API",
    requiresApiKey: true,
    apiKeyName: "Anthropic API Key",
  },
  {
    name: "Xiaomi MIMO",
    providerType: "claude",
    defaultBaseUrl: "https://api.xiaomimimo.com/anthropic",
    defaultModels: {
      claude: "mimo-v2-flash",
    },
    websiteUrl: "https://xiaomimimo.com",
    icon: "xiaomi",
    iconColor: "#FF6900",
    description: "小米 MIMO AI 服务",
    requiresApiKey: true,
    apiKeyName: "Xiaomi API Key",
  },
  {
    name: "OpenRouter Claude",
    providerType: "claude",
    defaultBaseUrl: "https://openrouter.ai/api/v1",
    defaultModels: {
      claude: "anthropic/claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://openrouter.ai",
    icon: "openrouter",
    iconColor: "#6366F1",
    description: "OpenRouter Claude 模型",
    requiresApiKey: true,
    apiKeyName: "OpenRouter API Key",
  },
  {
    name: "AWS Bedrock Claude",
    providerType: "claude",
    defaultBaseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
    defaultModels: {
      claude: "anthropic.claude-3-5-sonnet-20241022-v2:0",
    },
    websiteUrl: "https://aws.amazon.com/bedrock/",
    icon: "aws",
    iconColor: "#FF9900",
    description: "AWS Bedrock Claude 模型",
    requiresApiKey: true,
    apiKeyName: "AWS Credentials",
  },
  {
    name: "NVIDIA NIM",
    providerType: "claude",
    defaultBaseUrl: "https://integrate.api.nvidia.com/v1",
    defaultModels: {
      claude: "nvidia/llama-3.1-nemotron-70b-instruct",
    },
    websiteUrl: "https://build.nvidia.com/nim",
    icon: "nvidia",
    iconColor: "#76B900",
    description: "NVIDIA NIM 推理服务",
    requiresApiKey: true,
    apiKeyName: "NVIDIA API Key",
  },

  // === Codex Providers ===
  {
    name: "OpenAI Official",
    providerType: "codex",
    defaultBaseUrl: "https://api.openai.com/v1",
    defaultModels: {
      codex: "gpt-4o",
    },
    websiteUrl: "https://openai.com",
    icon: "openai",
    iconColor: "#10A37F",
    description: "OpenAI 官方 API",
    requiresApiKey: true,
    apiKeyName: "OpenAI API Key",
  },
  {
    name: "Azure OpenAI",
    providerType: "codex",
    defaultBaseUrl: "https://your-resource.openai.azure.com/openai/deployments/your-deployment",
    defaultModels: {
      codex: "gpt-4o",
    },
    websiteUrl: "https://azure.microsoft.com/products/ai-services",
    icon: "azure",
    iconColor: "#0078D4",
    description: "Azure OpenAI 服务",
    requiresApiKey: true,
    apiKeyName: "Azure API Key",
  },
  {
    name: "OpenRouter GPT-4",
    providerType: "codex",
    defaultBaseUrl: "https://openrouter.ai/api/v1",
    defaultModels: {
      codex: "openai/gpt-4o",
    },
    websiteUrl: "https://openrouter.ai",
    icon: "openrouter",
    iconColor: "#6366F1",
    description: "OpenRouter GPT-4 模型",
    requiresApiKey: true,
    apiKeyName: "OpenRouter API Key",
  },

  // === Gemini Providers ===
  {
    name: "Google AI Studio",
    providerType: "gemini",
    defaultBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
    defaultModels: {
      gemini: "gemini-2.0-flash-exp",
    },
    websiteUrl: "https://makersuite.google.com",
    icon: "google",
    iconColor: "#4285F4",
    description: "Google AI Studio Gemini API",
    requiresApiKey: true,
    apiKeyName: "Google AI API Key",
  },
  {
    name: "Vertex AI",
    providerType: "gemini",
    defaultBaseUrl: "https://us-central1-aiplatform.googleapis.com/v1",
    defaultModels: {
      gemini: "gemini-2.0-flash-exp",
    },
    websiteUrl: "https://cloud.google.com/vertex-ai",
    icon: "google",
    iconColor: "#4285F4",
    description: "Google Cloud Vertex AI",
    requiresApiKey: true,
    apiKeyName: "Google Cloud Credentials",
  },

  // === OpenCode Providers ===
  {
    name: "GitHub Copilot",
    providerType: "opencode",
    defaultBaseUrl: "https://api.githubcopilot.com",
    defaultModels: {
      codex: "gpt-4",
    },
    websiteUrl: "https://github.com/features/copilot",
    icon: "github",
    iconColor: "#24292e",
    description: "GitHub Copilot API",
    requiresApiKey: true,
    apiKeyName: "GitHub Copilot Token",
  },

  // === OpenClaw Providers ===
  {
    name: "Claude Desktop",
    providerType: "openclaw",
    defaultBaseUrl: "http://localhost:8080",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    icon: "claude",
    iconColor: "#E99265",
    description: "本地 Claude Desktop 服务",
    requiresApiKey: false,
  },

  // === Community Providers ===
  {
    name: "Together AI",
    providerType: "claude",
    defaultBaseUrl: "https://api.together.xyz/v1",
    defaultModels: {
      claude: "togetherai/claude-3-5-sonnet",
    },
    websiteUrl: "https://together.ai",
    icon: "together",
    iconColor: "#FF6B6B",
    description: "Together AI 多模型服务",
    requiresApiKey: true,
    apiKeyName: "Together AI API Key",
  },
  {
    name: "Perplexity",
    providerType: "claude",
    defaultBaseUrl: "https://api.perplexity.ai",
    defaultModels: {
      claude: "llama-3.1-sonar-large-128k-online",
    },
    websiteUrl: "https://perplexity.ai",
    icon: "perplexity",
    iconColor: "#6B7280",
    description: "Perplexity AI 搜索增强模型",
    requiresApiKey: true,
    apiKeyName: "Perplexity API Key",
  },
  {
    name: "Groq",
    providerType: "claude",
    defaultBaseUrl: "https://api.groq.com/openai/v1",
    defaultModels: {
      claude: "llama-3.1-70b-versatile",
    },
    websiteUrl: "https://groq.com",
    icon: "groq",
    iconColor: "#F472B6",
    description: "Groq 超快推理服务",
    requiresApiKey: true,
    apiKeyName: "Groq API Key",
  },
  {
    name: "Mistral AI",
    providerType: "claude",
    defaultBaseUrl: "https://api.mistral.ai/v1",
    defaultModels: {
      claude: "mistral-large-latest",
    },
    websiteUrl: "https://mistral.ai",
    icon: "mistral",
    iconColor: "#FF6B6B",
    description: "Mistral AI 大模型",
    requiresApiKey: true,
    apiKeyName: "Mistral API Key",
  },
  {
    name: "DeepSeek",
    providerType: "claude",
    defaultBaseUrl: "https://api.deepseek.com/v1",
    defaultModels: {
      claude: "deepseek-chat",
    },
    websiteUrl: "https://deepseek.com",
    icon: "deepseek",
    iconColor: "#6366F1",
    description: "DeepSeek AI 大模型",
    requiresApiKey: true,
    apiKeyName: "DeepSeek API Key",
  },
  {
    name: "Qwen",
    providerType: "claude",
    defaultBaseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    defaultModels: {
      claude: "qwen-max",
    },
    websiteUrl: "https://qwen.ai",
    icon: "qwen",
    iconColor: "#FF6B35",
    description: "阿里云通义千问",
    requiresApiKey: true,
    apiKeyName: "Qwen API Key",
  },
  {
    name: "ZhiPu AI",
    providerType: "claude",
    defaultBaseUrl: "https://open.bigmodel.cn/api/paas/v4",
    defaultModels: {
      claude: "glm-4",
    },
    websiteUrl: "https://zhipuai.cn",
    icon: "zhipu",
    iconColor: "#E91E63",
    description: "智谱 AI GLM 模型",
    requiresApiKey: true,
    apiKeyName: "ZhiPu API Key",
  },
  {
    name: "Moonshot",
    providerType: "claude",
    defaultBaseUrl: "https://api.moonshot.cn/v1",
    defaultModels: {
      claude: "moonshot-v1-128k",
    },
    websiteUrl: "https://moonshot.ai",
    icon: "moonshot",
    iconColor: "#1A1A2E",
    description: "月之暗面 Kimi",
    requiresApiKey: true,
    apiKeyName: "Moonshot API Key",
  },
  {
    name: "MiniMax",
    providerType: "claude",
    defaultBaseUrl: "https://api.minimax.chat/v1",
    defaultModels: {
      claude: "abab6.5s-chat",
    },
    websiteUrl: "https://minimaxi.com",
    icon: "minimax",
    iconColor: "#00D4AA",
    description: "MiniMax 大模型",
    requiresApiKey: true,
    apiKeyName: "MiniMax API Key",
  },
  {
    name: "Baichuan",
    providerType: "claude",
    defaultBaseUrl: "https://api.baichuan.ai/v1",
    defaultModels: {
      claude: "Baichuan4",
    },
    websiteUrl: "https://baichuan-ai.com",
    icon: "baichuan",
    iconColor: "#FF6B35",
    description: "百川智能大模型",
    requiresApiKey: true,
    apiKeyName: "Baichuan API Key",
  },
  {
    name: "SiliconFlow",
    providerType: "claude",
    defaultBaseUrl: "https://api.siliconflow.cn/v1",
    defaultModels: {
      claude: "deepseek-ai/DeepSeek-V2.5",
    },
    websiteUrl: "https://siliconflow.cn",
    icon: "siliconflow",
    iconColor: "#0066FF",
    description: "SiliconFlow 大模型服务",
    requiresApiKey: true,
    apiKeyName: "SiliconFlow API Key",
  },
  {
    name: "PackyCode",
    providerType: "claude",
    defaultBaseUrl: "https://api.packycode.com/v1",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://packycode.com",
    icon: "packycode",
    iconColor: "#6366F1",
    description: "PackyCode AI 服务",
    requiresApiKey: true,
    apiKeyName: "PackyCode API Key",
  },
  {
    name: "AIGoCode",
    providerType: "claude",
    defaultBaseUrl: "https://api.aigocode.com/v1",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://aigocode.com",
    icon: "aigocode",
    iconColor: "#10B981",
    description: "AIGoCode AI 服务",
    requiresApiKey: true,
    apiKeyName: "AIGoCode API Key",
  },
  {
    name: "AICodeMirror",
    providerType: "claude",
    defaultBaseUrl: "https://api.aicodemirror.com/v1",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://aicodemirror.com",
    icon: "aicodemirror",
    iconColor: "#8B5CF6",
    description: "AICodeMirror AI 服务",
    requiresApiKey: true,
    apiKeyName: "AICodeMirror API Key",
  },
  {
    name: "Cubence",
    providerType: "claude",
    defaultBaseUrl: "https://api.cubence.com/v1",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://cubence.com",
    icon: "cubence",
    iconColor: "#EC4899",
    description: "Cubence AI 服务",
    requiresApiKey: true,
    apiKeyName: "Cubence API Key",
  },
  {
    name: "DMXAPI",
    providerType: "claude",
    defaultBaseUrl: "https://api.dmxapi.com/v1",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://dmxapi.com",
    icon: "dmxapi",
    iconColor: "#F59E0B",
    description: "DMXAPI AI 服务",
    requiresApiKey: true,
    apiKeyName: "DMXAPI Key",
  },
  {
    name: "Compshare",
    providerType: "claude",
    defaultBaseUrl: "https://api.compshare.com/v1",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://compshare.com",
    icon: "compshare",
    iconColor: "#14B8A6",
    description: "Compshare AI 服务",
    requiresApiKey: true,
    apiKeyName: "Compshare API Key",
  },
  {
    name: "RightCode",
    providerType: "claude",
    defaultBaseUrl: "https://api.rightcode.com/v1",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://rightcode.com",
    icon: "rightcode",
    iconColor: "#3B82F6",
    description: "RightCode AI 服务",
    requiresApiKey: true,
    apiKeyName: "RightCode API Key",
  },
  {
    name: "AICoding.sh",
    providerType: "claude",
    defaultBaseUrl: "https://api.aicoding.sh/v1",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://aicoding.sh",
    icon: "aicoding",
    iconColor: "#6366F1",
    description: "AICoding.sh AI 服务",
    requiresApiKey: true,
    apiKeyName: "AICoding.sh API Key",
  },
  {
    name: "Crazyrouter",
    providerType: "claude",
    defaultBaseUrl: "https://api.crazyrouter.com/v1",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://crazyrouter.com",
    icon: "crazyrouter",
    iconColor: "#EF4444",
    description: "Crazyrouter AI 服务",
    requiresApiKey: true,
    apiKeyName: "Crazyrouter API Key",
  },
  {
    name: "SSSAiCode",
    providerType: "claude",
    defaultBaseUrl: "https://api.sssaicode.com/v1",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://sssaicode.com",
    icon: "sssaicode",
    iconColor: "#8B5CF6",
    description: "SSSAiCode AI 服务",
    requiresApiKey: true,
    apiKeyName: "SSSAiCode API Key",
  },
  {
    name: "Micu API",
    providerType: "claude",
    defaultBaseUrl: "https://api.micu.ai/v1",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://micu.ai",
    icon: "micu",
    iconColor: "#06B6D4",
    description: "Micu API AI 服务",
    requiresApiKey: true,
    apiKeyName: "Micu API Key",
  },
  {
    name: "XCodeAPI",
    providerType: "claude",
    defaultBaseUrl: "https://api.xcodeapi.com/v1",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://xcodeapi.com",
    icon: "xcodeapi",
    iconColor: "#6366F1",
    description: "XCodeAPI AI 服务",
    requiresApiKey: true,
    apiKeyName: "XCodeAPI Key",
  },
  {
    name: "CTok.ai",
    providerType: "claude",
    defaultBaseUrl: "https://api.ctok.ai/v1",
    defaultModels: {
      claude: "claude-3-5-sonnet-20241022",
    },
    websiteUrl: "https://ctok.ai",
    icon: "ctok",
    iconColor: "#10B981",
    description: "CTok.ai AI 服务",
    requiresApiKey: true,
    apiKeyName: "CTok.ai API Key",
  },
];

/**
 * 根据预设创建提供商
 */
export function createProviderFromPreset(
  preset: ProviderPreset,
  id: string,
  apiKey: string,
  customName?: string,
  customBaseUrl?: string,
): Provider {
  const now = new Date();
  return {
    id,
    name: customName || preset.name,
    type: preset.providerType,
    baseUrl: customBaseUrl || preset.defaultBaseUrl,
    apiKey: apiKey,
    models: { ...preset.defaultModels },
    websiteUrl: preset.websiteUrl,
    icon: preset.icon,
    iconColor: preset.iconColor,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * 获取预设的显示名称
 */
export function getPresetDisplayName(preset: ProviderPreset): string {
  return preset.name;
}

/**
 * 根据类型查找预设
 */
export function findPresetByType(
  providerType: ProviderType,
): ProviderPreset | undefined {
  return providerPresets.find((p) => p.providerType === providerType);
}

/**
 * 搜索预设
 */
export function searchPresets(query: string): ProviderPreset[] {
  const lowerQuery = query.toLowerCase();
  return providerPresets.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery) ||
      p.providerType.toLowerCase().includes(lowerQuery),
  );
}
