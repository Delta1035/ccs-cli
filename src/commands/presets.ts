import { ProviderService } from '../core/providerService';
import { ProviderConfig } from '../types';

// 预设提供商配置
export const providerPresets = [
  {
    name: 'Claude Official',
    type: 'claude' as const,
    config: {
      apiEndpoint: 'https://api.anthropic.com/v1',
      model: 'claude-3-5-sonnet-20241022'
    }
  },
  {
    name: 'Claude AWS Bedrock',
    type: 'claude' as const,
    config: {
      apiEndpoint: 'https://bedrock-runtime.us-east-1.amazonaws.com',
      model: 'anthropic.claude-3-5-sonnet-20241022-v1:0'
    }
  },
  {
    name: 'Claude OpenRouter',
    type: 'claude' as const,
    config: {
      apiEndpoint: 'https://openrouter.ai/api/v1',
      model: 'anthropic/claude-3-5-sonnet-20241022'
    }
  },
  {
    name: 'Codex Official',
    type: 'codex' as const,
    config: {
      apiEndpoint: 'https://api.openai.com/v1',
      model: 'gpt-4o'
    }
  },
  {
    name: 'Codex Azure',
    type: 'codex' as const,
    config: {
      apiEndpoint: 'https://your-resource.openai.azure.com',
      model: 'gpt-4o'
    }
  },
  {
    name: 'Gemini Official',
    type: 'gemini' as const,
    config: {
      apiEndpoint: 'https://generativelanguage.googleapis.com',
      model: 'gemini-1.5-pro'
    }
  },
  {
    name: 'Gemini OpenRouter',
    type: 'gemini' as const,
    config: {
      apiEndpoint: 'https://openrouter.ai/api/v1',
      model: 'google/gemini-pro-1.5'
    }
  }
];

// 导入预设提供商
export function importPreset(presetName: string, apiKey?: string): void {
  const preset = providerPresets.find(p => p.name === presetName);
  if (!preset) {
    throw new Error(`Preset "${presetName}" not found`);
  }

  const config: ProviderConfig = {
    ...preset.config,
    apiKey
  };

  ProviderService.addProvider(preset.name, preset.type, config);
}

// 列出所有预设
export function listPresets(): void {
  console.log('\n📋 Available Provider Presets:\n');
  providerPresets.forEach((preset, index) => {
    console.log(`  ${index + 1}. ${preset.name} (${preset.type})`);
    console.log(`     Endpoint: ${preset.config.apiEndpoint}`);
    console.log(`     Model: ${preset.config.model}`);
  });
  console.log('');
}
