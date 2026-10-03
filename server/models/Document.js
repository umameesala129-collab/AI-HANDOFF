import mongoose from 'mongoose';
import { isDbUsingMongoose, localCollections } from '../config/db.js';

const documentSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  name: { type: String, required: true },
  fileType: { type: String, default: 'TXT' }, // PDF, DOCX, TXT, CSV
  category: {
    type: String,
    enum: [
      'Meeting Notes',
      'Task List',
      'Project Report',
      'Client Communication',
      'Requirements',
      'Technical Documentation',
      'Other'
    ],
    default: 'Other'
  },
  storagePath: { type: String, default: '' },
  fileData: { type: String, default: '' },
  mimeType: { type: String, default: 'application/octet-stream' },
  extractedText: { type: String, default: '' },
  chunks: [
    {
      page: Number,
      section: String,
      content: String
    }
  ],
  processingStatus: {
    type: String,
    enum: ['Uploading', 'Processing', 'Analyzing', 'Completed', 'Failed'],
    default: 'Processing'
  },
  pageCount: { type: Number, default: 1 },
  lineCount: { type: Number, default: 0 },
  fileSize: { type: String, default: '0 KB' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseDocument = mongoose.models.Document || mongoose.model('Document', documentSchema);

const DocumentProxy = new Proxy(MongooseDocument, {
  get(target, prop) {
    if (!isDbUsingMongoose()) {
      return localCollections.documents[prop];
    }
    return target[prop];
  }
});

export default DocumentProxy;
