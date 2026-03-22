import db from '../database/db';
import { Provider, ProviderConfig } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ProviderService {
  // 获取所有提供商
  static getAllProviders(): Provider[] {
    const providers = db.getProviders();
    return providers.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type,
      config: row.config,
      enabled: row.enabled,
      order: row.order,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }));
  }

  // 获取启用的提供商
  static getEnabledProvider(): Provider | null {
    const providers = db.getProviders();
    const provider = providers.find(p => p.enabled);
    if (!provider) return null;
    return {
      id: provider.id,
      name: provider.name,
      type: provider.type,
      config: provider.config,
      enabled: provider.enabled,
      order: provider.order,
      createdAt: new Date(provider.createdAt),
      updatedAt: new Date(provider.updatedAt)
    };
  }

  // 添加提供商
  static addProvider(name: string, type: Provider['type'], config: ProviderConfig): Provider {
    const id = uuidv4();
    const order = this.getNextOrder();

    const provider = {
      id,
      name,
      type,
      config,
      enabled: false,
      order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.addProvider(provider);

    return {
      id,
      name,
      type,
      config,
      enabled: false,
      order,
      createdAt: new Date(),
      updatedAt: new Date()
    };
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
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString()
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
      db.updateProvider(p.id, { enabled: false, updatedAt: new Date().toISOString() });
    });

    // 启用指定的提供商
    db.updateProvider(id, { enabled: true, updatedAt: new Date().toISOString() });

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
    return {
      id: provider.id,
      name: provider.name,
      type: provider.type,
      config: provider.config,
      enabled: provider.enabled,
      order: provider.order,
      createdAt: new Date(provider.createdAt),
      updatedAt: new Date(provider.updatedAt)
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

    // 根据提供商类型写入不同的配置文件
    let configFile: string;
    let configContent: string;

    switch (provider.type) {
      case 'claude':
        configFile = path.join(configDir, 'claude-config.json');
        configContent = JSON.stringify({
          apiKey: provider.config.apiKey,
          apiEndpoint: provider.config.apiEndpoint,
          model: provider.config.model,
          temperature: provider.config.temperature,
          maxTokens: provider.config.maxTokens,
          customHeaders: provider.config.customHeaders
        }, null, 2);
        break;

      case 'codex':
        configFile = path.join(configDir, 'codex-config.json');
        configContent = JSON.stringify({
          apiKey: provider.config.apiKey,
          apiEndpoint: provider.config.apiEndpoint,
          model: provider.config.model
        }, null, 2);
        break;

      case 'gemini':
        configFile = path.join(configDir, 'gemini-config.json');
        configContent = JSON.stringify({
          apiKey: provider.config.apiKey,
          apiEndpoint: provider.config.apiEndpoint,
          model: provider.config.model
        }, null, 2);
        break;

      default:
        configFile = path.join(configDir, `${provider.type}-config.json`);
        configContent = JSON.stringify(provider.config, null, 2);
    }

    // 原子写入配置文件
    const tempFile = configFile + '.tmp';
    fs.writeFileSync(tempFile, configContent, 'utf-8');
    fs.renameSync(tempFile, configFile);

    console.log(`✅ 已切换到提供商: ${provider.name}`);
    console.log(`   配置文件: ${configFile}`);
  }
}
