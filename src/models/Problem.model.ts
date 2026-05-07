import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { DIFFICULTY, Difficulty } from '@constants/app.constants';

export interface IProblemFields {
  title: string;
  slug: string;
  topicId: Types.ObjectId;
  subtopicId?: Types.ObjectId;
  difficulty: Difficulty;
  tags: string[];
  estimatedTime?: number;
  leetcodeLink?: string;
  codeforcesLink?: string;
  articleLink?: string;
  youtubeLink?: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export type IProblemDocument = Document & IProblemFields;

const problemSchema = new Schema<IProblemDocument, Model<IProblemDocument>>(
  {
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: [true, 'Topic reference is required'],
    },
    subtopicId: {
      type: Schema.Types.ObjectId,
      ref: 'Subtopic',
    },
    difficulty: {
      type: String,
      enum: Object.values(DIFFICULTY) as Difficulty[],
      required: [true, 'Difficulty is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    estimatedTime: {
      type: Number,
      min: 1,
      max: 300,
    },
    leetcodeLink: { type: String, trim: true },
    codeforcesLink: { type: String, trim: true },
    articleLink: { type: String, trim: true },
    youtubeLink: { type: String, trim: true },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    order: {
      type: Number,
      required: [true, 'Order is required'],
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);


problemSchema.index({ topicId: 1, order: 1 });
problemSchema.index({ topicId: 1, difficulty: 1 });
problemSchema.index({ subtopicId: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ isActive: 1 });

export const Problem = mongoose.model<IProblemDocument>('Problem', problemSchema);
