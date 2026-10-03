import mongoose from 'mongoose';
import { isDbUsingMongoose, localCollections } from '../config/db.js';

const decisionSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  reason: { type: String, required: true },
  decisionDate: { type: String, default: '' },
  decisionMaker: { type: String, default: 'Team Consensus' },
  sourceDocumentId: { type: String, default: '' },
  sourceDocumentName: { type: String, default: '' },
  sourceExcerpt: { type: String, default: '' },
  pageNumber: { type: Number, default: 1 },
  whyMadeExcerpts: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const MongooseDecision = mongoose.models.Decision || mongoose.model('Decision', decisionSchema);

const DecisionProxy = new Proxy(MongooseDecision, {
  get(target, prop) {
    if (!isDbUsingMongoose()) {
      return localCollections.decisions[prop];
    }
    return target[prop];
  }
});

export default DecisionProxy;
