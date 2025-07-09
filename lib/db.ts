import mongoose from 'mongoose';

export default async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return mongoose.connections[0];
  }

  return mongoose.connect(process.env.MONGODB_URI || '', {
    dbName: 'inventory-app',
  });
}
