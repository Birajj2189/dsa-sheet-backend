import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Topic } from '../../src/models/Topic.model';
import { Subtopic } from '../../src/models/Subtopic.model';
import { Problem } from '../../src/models/Problem.model';
import { subtopicsData } from './data/subtopics.data';
import { problemsData } from './data/problems.data';

async function seedProblemsAndSubtopics(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.info('Connected to MongoDB');

  const topics = await Topic.find({});
  if (!topics.length) {
    console.error('No topics found. Run topics seeder first: npm run seed:topics');
    await mongoose.disconnect();
    process.exit(1);
  }

  const topicMap = new Map<string, string>();
  topics.forEach((t) => {
    topicMap.set(t.slug, (t._id as { toString(): string }).toString());
  });

  await Subtopic.deleteMany({});
  console.info('Cleared existing subtopics');

  const subtopicMap = new Map<string, string>();

  for (const [topicSlug, subs] of Object.entries(subtopicsData)) {
    const topicId = topicMap.get(topicSlug);
    if (!topicId) {
      console.warn(`Topic '${topicSlug}' not found, skipping subtopics`);
      continue;
    }

    const created = await Subtopic.insertMany(
      subs.map((s) => ({ ...s, topicId })),
    );

    created.forEach((s) => {
      subtopicMap.set(`${topicSlug}:${s.slug}`, (s._id as { toString(): string }).toString());
    });
  }

  console.info(`✅ Seeded subtopics for ${Object.keys(subtopicsData).length} topics`);

  await Problem.deleteMany({});
  console.info('Cleared existing problems');

  const problemDocs = problemsData.map((p) => {
    const topicId = topicMap.get(p.topicSlug);
    if (!topicId) {
      throw new Error(`Topic '${p.topicSlug}' not found for problem '${p.slug}'`);
    }

    const subtopicId = p.subtopicSlug
      ? subtopicMap.get(`${p.topicSlug}:${p.subtopicSlug}`)
      : undefined;

    return {
      title: p.title,
      slug: p.slug,
      topicId,
      ...(subtopicId ? { subtopicId } : {}),
      difficulty: p.difficulty,
      tags: p.tags,
      estimatedTime: p.estimatedTime,
      ...(p.leetcodeLink ? { leetcodeLink: p.leetcodeLink } : {}),
      ...(p.articleLink ? { articleLink: p.articleLink } : {}),
      ...(p.youtubeLink ? { youtubeLink: p.youtubeLink } : {}),
      ...(p.description ? { description: p.description } : {}),
      order: p.order,
    };
  });

  const problems = await Problem.insertMany(problemDocs);
  console.info(`✅ Seeded ${problems.length} problems`);

  await mongoose.disconnect();
  console.info('Disconnected');
}

void seedProblemsAndSubtopics().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
