import mongoose from 'mongoose';
import { isDbUsingMongoose, localCollections } from '../config/db.js';

const aiInsightSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  insightType: {
    type: String,
    enum: ['Fact', 'Inference', 'Recommendation', 'Conflict', 'ContextConnection'],
    default: 'Inference'
  },
  content: { type: String, required: true },
  confidence: { type: Number, default: 90 }, // e.g. 95%
  evidenceChain: {
    evidence: { type: String, default: '' },
    interpretation: { type: String, default: '' },
    currentContext: { type: String, default: '' },
    actionableStep: { type: String, default: '' }
  },
  conflictDetails: {
    conflictType: { type: String, default: '' }, // dates, task status, decisions, deadlines, assignees
    description: { type: String, default: '' },
    latestResolution: { type: String, default: '' },
    conflictingSources: [
      {
        documentName: String,
        documentId: String,
        date: String,
        claim: String,
        excerpt: String
      }
    ],
    status: { type: String, enum: ['Detected', 'Reviewed', 'Resolved'], default: 'Detected' }
  },
  sourceReferences: [
    {
      documentId: String,
      documentName: String,
      page: Number,
      section: String,
      excerpt: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const MongooseAIInsight = mongoose.models.AIInsight || mongoose.model('AIInsight', aiInsightSchema);

const AIInsightProxy = new Proxy(MongooseAIInsight, {
  get(target, prop) {
    if (!isDbUsingMongoose()) {
      return localCollections.ai_insights[prop];
    }
    return target[prop];
  }
});

export default AIInsightProxy;
