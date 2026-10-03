import dns from 'node:dns';
import mongoose from 'mongoose';
import localCollections from './localStore.js';

let isMongooseConnected = false;

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.trim() === '') {
    console.log('[Database] No MONGO_URI provided. Running in-memory / local persistent JSON storage mode (Zero-config out of the box).');
    return false;
  }

  try {
    const connectionOptions = { serverSelectionTimeoutMS: 5000 };
    let conn;

    try {
      conn = await mongoose.connect(uri, connectionOptions);
    } catch (error) {
      if (!error.message?.includes('querySrv ETIMEOUT')) {
        throw error;
      }

      const originalDnsServers = dns.getServers();
      try {
        dns.setServers([process.env.MONGO_DNS_SERVER || '8.8.8.8']);
        conn = await mongoose.connect(uri, connectionOptions);
      } finally {
        dns.setServers(originalDnsServers);
      }
    }

    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    isMongooseConnected = true;
    return true;
  } catch (error) {
    console.warn(`[Database] MongoDB Atlas connection failed (${error.message}). Activating local fallback storage mode.`);
    isMongooseConnected = false;
    return false;
  }
}

export function isDbUsingMongoose() {
  return isMongooseConnected;
}

export { localCollections };
