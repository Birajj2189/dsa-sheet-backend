import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ISubtopicFields {
  title: string;
  slug: string;
  topicId: Types.ObjectId;
  description?: string;
  order: number;
}

export type ISubtopicDocument = Document & ISubtopicFields;

const subtopicSchema = new Schema<ISubtopicDocument, Model<ISubtopicDocument>>(
  {
    title: {
      type: String,
      required: [true, 'Subtopic title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      lowercase: true,
      trim: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: [true, 'Topic reference is required'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    order: {
      type: Number,
      required: [true, 'Order is required'],
      min: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

subtopicSchema.index({ topicId: 1, slug: 1 }, { unique: true });
subtopicSchema.index({ topicId: 1, order: 1 });

export const Subtopic = mongoose.model<ISubtopicDocument>('Subtopic', subtopicSchema);
