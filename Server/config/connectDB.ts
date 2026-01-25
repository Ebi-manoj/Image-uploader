import mongoose from 'mongoose';
import { Env } from '../utils/Env.js';

export async function connectMongo() {
  try {
    const db = await mongoose.connect(Env.MONGO_URI);
    console.log(
      `Database connected with ${db.connection.host} ${db.connection.name}`,
    );
  } catch (error) {
    console.log('Error in mongoDb connection', error);
    process.exit(1);
  }
}
