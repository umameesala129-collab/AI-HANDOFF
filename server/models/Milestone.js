import mongoose from 'mongoose';
import { isDbUsingMongoose, localCollections } from '../config/db.js';

const milestoneSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  milestoneDate: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Delayed'],
    default: 'Upcoming'
  },
  sourceDocumentId: { type: String, default: '' },
  sourceDocumentName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseMilestone = mongoose.models.Milestone || mongoose.model('Milestone', milestoneSchema);

const MilestoneProxy = new Proxy(MongooseMilestone, {
  get(target, prop) {
    if (!isDbUsingMongoose()) {
      return localCollections.milestones[prop];
    }
    return target[prop];
  }
});

export default MilestoneProxy;
