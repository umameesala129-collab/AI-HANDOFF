import mongoose from 'mongoose';
import { isDbUsingMongoose, localCollections } from '../config/db.js';

const taskSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Blocked', 'Completed'],
    default: 'Not Started'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  assignee: { type: String, default: 'Unassigned' },
  deadline: { type: String, default: '' },
  completedDate: { type: String, default: '' },
  dependencies: { type: [String], default: [] },
  sourceDocumentId: { type: String, default: '' },
  sourceDocumentName: { type: String, default: '' },
  sourceExcerpt: { type: String, default: '' },
  pageNumber: { type: Number, default: 1 },
  section: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseTask = mongoose.models.Task || mongoose.model('Task', taskSchema);

const TaskProxy = new Proxy(MongooseTask, {
  get(target, prop) {
    if (!isDbUsingMongoose()) {
      return localCollections.tasks[prop];
    }
    return target[prop];
  }
});

export default TaskProxy;
