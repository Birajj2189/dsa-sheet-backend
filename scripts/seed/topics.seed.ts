import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Topic } from '../../src/models/Topic.model';
import { topicsData } from './data/topics.data';

async function seedTopics(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.info('Connected to MongoDB');

  await Topic.deleteMany({});
  console.info('Cleared existing topics');

  const topics = await Topic.insertMany(topicsData);
  console.info(`✅ Seeded ${topics.length} topics`);

  const map: Record<string, string> = {};
  topics.forEach((t) => {
    map[t.slug] = (t._id as { toString(): string }).toString();
  });
  console.info('Topic slug → ID map:', JSON.stringify(map, null, 2));

  await mongoose.disconnect();
  console.info('Disconnected');
}

void seedTopics().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
