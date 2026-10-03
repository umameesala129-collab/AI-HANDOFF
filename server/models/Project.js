import mongoose from 'mongoose';
import { isDbUsingMongoose, localCollections } from '../config/db.js';

const projectSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['On Track', 'At Risk', 'Blocked', 'Completed'],
    default: 'On Track'
  },
  projectType: { type: String, default: 'Web Application' },
  teamMembers: { type: [String], default: [] },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  progress: { type: Number, default: 0 },
  handoffReadiness: {
    score: { type: Number, default: 0 },
    status: { type: String, enum: ['Ready', 'Needs Review'], default: 'Needs Review' },
    missingContext: { type: [String], default: [] }
  },
  currentSituation: { type: String, default: '' },
  summary: { type: String, default: '' },
  isDemo: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MongooseProject = mongoose.models.Project || mongoose.model('Project', projectSchema);

const ProjectProxy = new Proxy(MongooseProject, {
  get(target, prop) {
    if (!isDbUsingMongoose()) {
      return localCollections.projects[prop];
    }
    return target[prop];
  }
});

export default ProjectProxy;
