import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Topic } from '../../src/models/Topic.model';
import { Subtopic } from '../../src/models/Subtopic.model';
import { Problem } from '../../src/models/Problem.model';
import { topicsData } from './data/topics.data';
import { subtopicsData } from './data/subtopics.data';
import { problemsData } from './data/problems.data';

async function runFullSeed(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  console.info('🌱 Starting full database seed...');
  await mongoose.connect(uri);
  console.info('✅ Connected to MongoDB');

  // ── Topics ──────────────────────────────────────────────────────
  await Topic.deleteMany({});
  const topics = await Topic.insertMany(topicsData);
  console.info(`✅ Seeded ${topics.length} topics`);

  const topicMap = new Map<string, string>();
  topics.forEach((t) => {
    topicMap.set(t.slug, (t._id as { toString(): string }).toString());
  });

  // ── Subtopics ───────────────────────────────────────────────────
  await Subtopic.deleteMany({});
  const subtopicMap = new Map<string, string>();

  for (const [topicSlug, subs] of Object.entries(subtopicsData)) {
    const topicId = topicMap.get(topicSlug);
    if (!topicId) continue;

    const created = await Subtopic.insertMany(subs.map((s) => ({ ...s, topicId })));
    created.forEach((s) => {
      subtopicMap.set(`${topicSlug}:${s.slug}`, (s._id as { toString(): string }).toString());
    });
  }
  console.info(`✅ Seeded subtopics`);

  // ── Problems ────────────────────────────────────────────────────
  await Problem.deleteMany({});

  const problemDocs = problemsData.map((p) => {
    const topicId = topicMap.get(p.topicSlug);
    if (!topicId) throw new Error(`Topic '${p.topicSlug}' missing`);

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
      ...(p.youtubeLink ? { youtubeLink: p.youtubeLink } : {}),
      ...(p.description ? { description: p.description } : {}),
      order: p.order,
    };
  });

  const problems = await Problem.insertMany(problemDocs);
  console.info(`✅ Seeded ${problems.length} problems`);

  console.info('\n📊 Seed Summary:');
  console.info(`   Topics:    ${topics.length}`);
  console.info(`   Subtopics: ${subtopicMap.size}`);
  console.info(`   Problems:  ${problems.length}`);

  await mongoose.disconnect();
  console.info('\n✅ Seed complete. Disconnected from MongoDB.');
}

void runFullSeed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
