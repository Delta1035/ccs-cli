import db from '../database/db';
import { Provider, ProviderConfig, ProviderType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// 导出便捷函数
export function saveProvider(provider: Provider): void {
  const dbProvider = {
    id: provider.id,
    name: provider.name,
    type: provider.type,
    baseUrl: provider.baseUrl,
    apiKey: provider.apiKey,
    models: provider.models,
    websiteUrl: provider.websiteUrl,
    icon: provider.icon,
    iconColor: provider.iconColor,
    enabled: provider.enabled || false,
    order: provider.order || 0,
    createdAt: provider.createdAt,
    updatedAt: provider.updatedAt
  };
  db.addProvider(dbProvider);
}

export class ProviderService {
  // 获取所有提供商
  static getAllProviders(): Provider[] {
    const providers = db.getProviders();
    return providers.map(row => {
      // 处理旧的 config 对象结构和新的字段结构
      let models: { claude?: string; codex?: string; gemini?: string };

      if (row.models) {
        // 新的结构：models 对象
        models = row.models;
      } else if (row.config?.model) {
        // 旧的结构：config.model 是字符串，需要根据类型映射
        const model = row.config.model;
        switch (row.type) {
          case 'claude':
            models = { claude: model };
            break;
          case 'codex':
            models = { codex: model };
            break;
          case 'gemini':
            models = { gemini: model };
            break;
          default:
            models = { claude: model, codex: model, gemini: model };
        }
      } else {
        models = {};
      }

      return {
        id: row.id,
        name: row.name,
        type: row.type,
        baseUrl: row.baseUrl || row.config?.apiEndpoint || '',
        apiKey: row.apiKey || row.config?.apiKey || '',
        models: models,
        websiteUrl: row.websiteUrl,
        icon: row.icon,
        iconColor: row.iconColor,
        enabled: row.enabled,
        order: row.order,
        createdAt: typeof row.createdAt === 'number' ? new Date(row.createdAt) : new Date(row.createdAt),
        updatedAt: typeof row.updatedAt === 'number' ? new Date(row.updatedAt) : new Date(row.updatedAt)
      };
    });
  }

  // 获取启用的提供商
  static getEnabledProvider(): Provider | null {
    const providers = db.getProviders();
    const provider = providers.find(p => p.enabled);
    if (!provider) return null;

    // 处理旧的 config 对象结构和新的字段结构
    let models: { claude?: string; codex?: string; gemini?: string };

    if (provider.models) {
      // 新的结构：models 对象
      models = provider.models;
    } else if (provider.config?.model) {
      // 旧的结构：config.model 是字符串，需要根据类型映射
      const model = provider.config.model;
      switch (provider.type) {
        case 'claude':
          models = { claude: model };
          break;
        case 'codex':
          models = { codex: model };
          break;
        case 'gemini':
          models = { gemini: model };
          break;
        default:
          models = { claude: model, codex: model, gemini: model };
      }
    } else {
      models = {};
    }

    return {
      id: provider.id,
      name: provider.name,
      type: provider.type,
      baseUrl: provider.baseUrl || provider.config?.apiEndpoint || '',
      apiKey: provider.apiKey || provider.config?.apiKey || '',
      models: models,
      websiteUrl: provider.websiteUrl,
      icon: provider.icon,
      iconColor: provider.iconColor,
      enabled: provider.enabled,
      order: provider.order,
      createdAt: typeof provider.createdAt === 'number' ? new Date(provider.createdAt) : new Date(provider.createdAt),
      updatedAt: typeof provider.updatedAt === 'number' ? new Date(provider.updatedAt) : new Date(provider.updatedAt)
    };
  }

  // 添加提供商
  static addProvider(name: string, type: Provider['type'], config: ProviderConfig): Provider {
    const id = uuidv4();
    const order = this.getNextOrder();
    const now = new Date();

    const provider = {
      id,
      name,
      type,
      config,
      enabled: false,
      order,
      createdAt: now.getTime(),
      updatedAt: now.getTime()
    };

    db.addProvider(provider);

    return {
      id,
      name,
      type,
      baseUrl: config.apiEndpoint || '',
      apiKey: config.apiKey || '',
      models: { claude: config.model, codex: config.model, gemini: config.model },
      enabled: false,
      order,
      createdAt: now,
      updatedAt: now
    };
  }

  // 从预设添加提供商
  static addProviderFromPreset(provider: Provider): void {
    const dbProvider = {
      id: provider.id,
      name: provider.name,
      type: provider.type,
      baseUrl: provider.baseUrl,
      apiKey: provider.apiKey,
      models: provider.models,
      websiteUrl: provider.websiteUrl,
      icon: provider.icon,
      iconColor: provider.iconColor,
      enabled: provider.enabled || false,
      order: provider.order || this.getNextOrder(),
      createdAt: provider.createdAt.getTime(),
      updatedAt: provider.updatedAt.getTime()
    };
    db.addProvider(dbProvider);
  }

  // 更新提供商
  static updateProvider(id: string, updates: Partial<Provider>): Provider {
    const existing = this.getProviderById(id);
    if (!existing) {
      throw new Error(`Provider with id ${id} not found`);
    }

    const updated = { ...existing, ...updates, updatedAt: new Date() };
    db.updateProvider(id, {
      ...updated,
      createdAt: updated.createdAt.getTime(),
      updatedAt: updated.updatedAt.getTime()
    });

    return updated;
  }

  // 删除提供商
  static deleteProvider(id: string): void {
    db.deleteProvider(id);
  }

  // 切换提供商
  static switchProvider(id: string): Provider {
    // 先禁用所有提供商
    const providers = db.getProviders();
    providers.forEach(p => {
      db.updateProvider(p.id, { enabled: false, updatedAt: new Date().getTime() });
    });

    // 启用指定的提供商
    db.updateProvider(id, { enabled: true, updatedAt: new Date().getTime() });

    // 返回启用的提供商
    const provider = this.getProviderById(id);
    if (!provider) {
      throw new Error(`Provider with id ${id} not found`);
    }

    // 更新配置文件
    this.applyProviderConfig(provider);

    return { ...provider, enabled: true };
  }

  // 获取提供商详情
  static getProviderById(id: string): Provider | null {
    const provider = db.getProvider(id);
    if (!provider) return null;

    // 处理旧的 config 对象结构和新的字段结构
    let models: { claude?: string; codex?: string; gemini?: string };

    if (provider.models) {
      // 新的结构：models 对象
      models = provider.models;
    } else if (provider.config?.model) {
      // 旧的结构：config.model 是字符串，需要根据类型映射
      const model = provider.config.model;
      switch (provider.type) {
        case 'claude':
          models = { claude: model };
          break;
        case 'codex':
          models = { codex: model };
          break;
        case 'gemini':
          models = { gemini: model };
          break;
        default:
          models = { claude: model, codex: model, gemini: model };
      }
    } else {
      models = {};
    }

    return {
      id: provider.id,
      name: provider.name,
      type: provider.type,
      baseUrl: provider.baseUrl || provider.config?.apiEndpoint || '',
      apiKey: provider.apiKey || provider.config?.apiKey || '',
      models: models,
      websiteUrl: provider.websiteUrl,
      icon: provider.icon,
      iconColor: provider.iconColor,
      enabled: provider.enabled,
      order: provider.order,
      createdAt: typeof provider.createdAt === 'number' ? new Date(provider.createdAt) : new Date(provider.createdAt),
      updatedAt: typeof provider.updatedAt === 'number' ? new Date(provider.updatedAt) : new Date(provider.updatedAt)
    };
  }

  // 获取下一个排序号
  private static getNextOrder(): number {
    const providers = db.getProviders();
    if (providers.length === 0) return 1;
    return Math.max(...providers.map(p => p.order || 0)) + 1;
  }

  // 应用提供商配置到配置文件
  private static applyProviderConfig(provider: Provider): void {
    const fs = require('fs');
    const path = require('path');
    const os = require('os');

    const homeDir = os.homedir();
    const configDir = path.join(homeDir, '.cc-switch', 'configs');

    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // 清理所有旧的配置文件
    const configFiles = ['claude-config.json', 'codex-config.json', 'gemini-config.json'];
    configFiles.forEach(file => {
      const filePath = path.join(configDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // 根据提供商类型写入新的配置文件
    let configFile: string;
    let configContent: string;

    switch (provider.type) {
      case 'claude':
        configFile = path.join(configDir, 'claude-config.json');
        configContent = JSON.stringify({
          apiKey: provider.apiKey,
          apiEndpoint: provider.baseUrl,
          model: provider.models.claude,
          temperature: 0.7,
          maxTokens: 4096,
          customHeaders: {}
        }, null, 2);
        break;

      case 'codex':
        configFile = path.join(configDir, 'codex-config.json');
        configContent = JSON.stringify({
          apiKey: provider.apiKey,
          apiEndpoint: provider.baseUrl,
          model: provider.models.codex
        }, null, 2);
        break;

      case 'gemini':
        configFile = path.join(configDir, 'gemini-config.json');
        configContent = JSON.stringify({
          apiKey: provider.apiKey,
          apiEndpoint: provider.baseUrl,
          model: provider.models.gemini
        }, null, 2);
        break;

      default:
        configFile = path.join(configDir, `${provider.type}-config.json`);
        configContent = JSON.stringify({
          apiKey: provider.apiKey,
          apiEndpoint: provider.baseUrl,
          models: provider.models
        }, null, 2);
    }

    // 原子写入配置文件
    const tempFile = configFile + '.tmp';
    fs.writeFileSync(tempFile, configContent, 'utf-8');
    fs.renameSync(tempFile, configFile);

    console.log(`✅ 已切换到提供商: ${provider.name}`);
    console.log(`   配置文件: ${configFile}`);
  }
}
