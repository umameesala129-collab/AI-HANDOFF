import mongoose from 'mongoose';
import { isDbUsingMongoose, localCollections } from '../config/db.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Project Member' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);

const UserProxy = new Proxy(MongooseUser, {
  get(target, prop) {
    if (!isDbUsingMongoose()) {
      return localCollections.users[prop];
    }
    return target[prop];
  }
});

export default UserProxy;
