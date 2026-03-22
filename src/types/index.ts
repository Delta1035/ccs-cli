// 类型定义文件

export interface Provider {
  id: string;
  name: string;
  type: 'claude' | 'codex' | 'gemini' | 'opencode' | 'openclaw';
  config: ProviderConfig;
  enabled: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderConfig {
  apiKey?: string;
  apiEndpoint?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  customHeaders?: Record<string, string>;
  proxy?: ProxyConfig;
}

export interface ProxyConfig {
  enabled: boolean;
  host: string;
  port: number;
  failoverEnabled: boolean;
  failoverEndpoints: string[];
}

export interface AppSettings {
  theme: 'light' | 'dark';
  autoUpdate: boolean;
  cloudSync: {
    enabled: boolean;
    provider: 'dropbox' | 'onedrive' | 'icloud' | 'webdav';
    config: Record<string, string>;
  };
  usageTracking: {
    enabled: boolean;
    customPricing: Record<string, number>;
  };
}

export interface Session {
  id: string;
  appId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MCPConfig {
  id: string;
  name: string;
  command: string;
  args: string[];
  env: Record<string, string>;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  source: string;
  installedAt: Date;
}

export interface UsageStats {
  appId: string;
  requests: number;
  tokens: number;
  cost: number;
  period: string;
}

export interface CommandOptions {
  verbose?: boolean;
  quiet?: boolean;
  config?: string;
}
