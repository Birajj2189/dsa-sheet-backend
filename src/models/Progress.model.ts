import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IProgressFields {
  userId: Types.ObjectId;
  problemId: Types.ObjectId;
  completed: boolean;
  completedAt?: Date;
  bookmarked: boolean;
  notes?: string;
}

export type IProgressDocument = Document & IProgressFields;

const progressSchema = new Schema<IProgressDocument, Model<IProgressDocument>>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'Problem reference is required'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    bookmarked: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [5000, 'Notes cannot exceed 5000 characters'],
      default: '',
    },
  },
  { timestamps: true, versionKey: false },
);

progressSchema.index({ userId: 1, problemId: 1 }, { unique: true });
progressSchema.index({ userId: 1, completed: 1 });
progressSchema.index({ userId: 1, bookmarked: 1 });
progressSchema.index({ userId: 1, completedAt: -1 });

export const Progress = mongoose.model<IProgressDocument>('Progress', progressSchema);
