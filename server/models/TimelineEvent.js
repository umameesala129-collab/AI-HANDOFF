import mongoose from 'mongoose';
import { isDbUsingMongoose, localCollections } from '../config/db.js';

const timelineEventSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  eventDate: { type: String, required: true },
  eventType: {
    type: String,
    enum: ['Milestone', 'Decision', 'Task Completed', 'Blocker Raised', 'Blocker Resolved', 'Update'],
    default: 'Update'
  },
  sourceDocumentId: { type: String, default: '' },
  sourceDocumentName: { type: String, default: '' },
  sourceExcerpt: { type: String, default: '' },
  relatedTask: { type: String, default: '' },
  aiExplanation: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseTimelineEvent = mongoose.models.TimelineEvent || mongoose.model('TimelineEvent', timelineEventSchema);

const TimelineEventProxy = new Proxy(MongooseTimelineEvent, {
  get(target, prop) {
    if (!isDbUsingMongoose()) {
      return localCollections.timeline_events[prop];
    }
    return target[prop];
  }
});

export default TimelineEventProxy;
