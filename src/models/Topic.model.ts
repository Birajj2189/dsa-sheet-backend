import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITopicFields {
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  progressWeight: number;
  isActive: boolean;
}

export type ITopicDocument = Document & ITopicFields;

const topicSchema = new Schema<ITopicDocument, Model<ITopicDocument>>(
  {
    title: {
      type: String,
      required: [true, 'Topic title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    icon: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      required: [true, 'Order is required'],
      min: 0,
    },
    progressWeight: {
      type: Number,
      default: 1,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);


topicSchema.index({ order: 1 });
topicSchema.index({ isActive: 1 });

export const Topic = mongoose.model<ITopicDocument>('Topic', topicSchema);
