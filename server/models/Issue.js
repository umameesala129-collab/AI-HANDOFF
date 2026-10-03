import mongoose from 'mongoose';
import { isDbUsingMongoose, localCollections } from '../config/db.js';

const issueSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  severity: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },
  detectedDate: { type: String, default: '' },
  relatedTask: { type: String, default: '' },
  suggestedAction: { type: String, default: '' },
  sourceDocumentId: { type: String, default: '' },
  sourceDocumentName: { type: String, default: '' },
  sourceExcerpt: { type: String, default: '' },
  pageNumber: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

const MongooseIssue = mongoose.models.Issue || mongoose.model('Issue', issueSchema);

const IssueProxy = new Proxy(MongooseIssue, {
  get(target, prop) {
    if (!isDbUsingMongoose()) {
      return localCollections.issues[prop];
    }
    return target[prop];
  }
});

export default IssueProxy;
