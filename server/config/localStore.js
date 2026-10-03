import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'local_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let store = {
  users: [],
  projects: [],
  documents: [],
  tasks: [],
  decisions: [],
  issues: [],
  milestones: [],
  timeline_events: [],
  ai_insights: []
};

function loadStore() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      store = { ...store, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('[LocalStore] Warning: Could not read local_db.json, starting fresh', err.message);
  }
}

function saveStore() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[LocalStore] Error saving store:', err.message);
  }
}

loadStore();

function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

class LocalCollection {
  constructor(name) {
    this.name = name;
    if (!store[this.name]) {
      store[this.name] = [];
    }
  }

  get items() {
    return store[this.name];
  }

  _matches(item, filter = {}) {
    for (const key of Object.keys(filter)) {
      if (key === '_id' || key === 'id') {
        const targetId = filter._id || filter.id;
        const itemId = item._id || item.id;
        if (String(targetId) !== String(itemId)) return false;
      } else if (filter[key] !== undefined && item[key] !== filter[key]) {
        return false;
      }
    }
    return true;
  }

  async find(filter = {}) {
    const matched = this.items.filter(item => this._matches(item, filter));
    const result = matched.map(i => ({ ...i }));
    return {
      sort: (sortObj = {}) => {
        const keys = Object.keys(sortObj);
        if (keys.length > 0) {
          const k = keys[0];
          const dir = sortObj[k];
          result.sort((a, b) => {
            if (a[k] < b[k]) return dir === 1 ? -1 : 1;
            if (a[k] > b[k]) return dir === 1 ? 1 : -1;
            return 0;
          });
        }
        return Promise.resolve(result);
      },
      lean: () => Promise.resolve(result),
      then: (resolve, reject) => Promise.resolve(result).then(resolve, reject)
    };
  }

  async findOne(filter = {}) {
    const item = this.items.find(i => this._matches(i, filter));
    return item ? { ...item } : null;
  }

  async findById(id) {
    const item = this.items.find(i => String(i._id || i.id) === String(id));
    return item ? { ...item } : null;
  }

  async create(data) {
    const newItem = {
      _id: generateId(),
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    this.items.push(newItem);
    saveStore();
    return { ...newItem };
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const index = this.items.findIndex(i => String(i._id || i.id) === String(id));
    if (index === -1) return null;
    const existing = this.items[index];
    const updated = {
      ...existing,
      ...update,
      updatedAt: new Date().toISOString()
    };
    this.items[index] = updated;
    saveStore();
    return { ...updated };
  }

  async findByIdAndDelete(id) {
    const index = this.items.findIndex(i => String(i._id || i.id) === String(id));
    if (index === -1) return null;
    const [removed] = this.items.splice(index, 1);
    saveStore();
    return { ...removed };
  }

  async deleteMany(filter = {}) {
    const beforeCount = this.items.length;
    store[this.name] = this.items.filter(i => !this._matches(i, filter));
    const deletedCount = beforeCount - store[this.name].length;
    saveStore();
    return { deletedCount };
  }

  async countDocuments(filter = {}) {
    return this.items.filter(i => this._matches(i, filter)).length;
  }
}

export const localCollections = {
  users: new LocalCollection('users'),
  projects: new LocalCollection('projects'),
  documents: new LocalCollection('documents'),
  tasks: new LocalCollection('tasks'),
  decisions: new LocalCollection('decisions'),
  issues: new LocalCollection('issues'),
  milestones: new LocalCollection('milestones'),
  timeline_events: new LocalCollection('timeline_events'),
  ai_insights: new LocalCollection('ai_insights')
};

export default localCollections;
