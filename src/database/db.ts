import fs from 'fs';
import path from 'path';
import os from 'os';

const HOME_DIR = os.homedir();
const CC_SWITCH_DIR = path.join(HOME_DIR, '.cc-switch');
const DB_PATH = path.join(CC_SWITCH_DIR, 'data.json');

// 确保配置目录存在
if (!fs.existsSync(CC_SWITCH_DIR)) {
  fs.mkdirSync(CC_SWITCH_DIR, { recursive: true });
}

// 数据存储接口
interface DataStore {
  providers: any[];
  settings: any;
  sessions: any[];
  mcpConfigs: any[];
  skills: any[];
  usageStats: any[];
}

// 默认数据
const defaultData: DataStore = {
  providers: [],
  settings: {
    theme: 'light',
    autoUpdate: true,
    cloudSync: { enabled: false },
    usageTracking: { enabled: true }
  },
  sessions: [],
  mcpConfigs: [],
  skills: [],
  usageStats: []
};

// 读取数据
function readData(): DataStore {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn('Failed to read data file, using defaults:', error);
  }
  return { ...defaultData };
}

// 写入数据
function writeData(data: DataStore): void {
  const tempPath = DB_PATH + '.tmp';
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_PATH);
}

// 数据库操作类
export class Database {
  private data: DataStore;

  constructor() {
    this.data = readData();
  }

  // 保存数据
  save(): void {
    writeData(this.data);
  }

  // 获取所有数据
  getAll(): DataStore {
    return { ...this.data };
  }

  // 提供商操作
  getProviders(): any[] {
    return [...this.data.providers];
  }

  addProvider(provider: any): void {
    this.data.providers.push(provider);
    this.save();
  }

  updateProvider(id: string, updates: any): void {
    const index = this.data.providers.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.providers[index] = { ...this.data.providers[index], ...updates };
      this.save();
    }
  }

  deleteProvider(id: string): void {
    this.data.providers = this.data.providers.filter(p => p.id !== id);
    this.save();
  }

  getProvider(id: string): any | undefined {
    return this.data.providers.find(p => p.id === id);
  }

  // 会话操作
  getSessions(): any[] {
    return [...this.data.sessions];
  }

  addSession(session: any): void {
    this.data.sessions.push(session);
    this.save();
  }

  deleteSession(id: string): void {
    this.data.sessions = this.data.sessions.filter(s => s.id !== id);
    this.save();
  }

  // MCP 配置操作
  getMcpConfigs(): any[] {
    return [...this.data.mcpConfigs];
  }

  addMcpConfig(config: any): void {
    this.data.mcpConfigs.push(config);
    this.save();
  }

  deleteMcpConfig(name: string): void {
    this.data.mcpConfigs = this.data.mcpConfigs.filter(c => c.name !== name);
    this.save();
  }

  // 使用统计操作
  getUsageStats(): any[] {
    return [...this.data.usageStats];
  }

  addUsageStat(stat: any): void {
    this.data.usageStats.push(stat);
    this.save();
  }

  resetUsageStats(): void {
    this.data.usageStats = [];
    this.save();
  }
}

// 导出单例实例
export const db = new Database();
export default db;
