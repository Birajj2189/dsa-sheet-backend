import { Document, Types } from 'mongoose';
import { Role, Difficulty } from '@constants/app.constants';

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: Role;
  streak: number;
  xp: number;
  lastActiveDate?: Date;
  refreshToken?: string;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export type IUserDocument = IUser & IUserMethods & Document;

export interface ITopic {
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  progressWeight: number;
  isActive: boolean;
}

export type ITopicDocument = ITopic & Document;

export interface ISubtopic {
  title: string;
  slug: string;
  topicId: Types.ObjectId;
  description?: string;
  order: number;
}

export type ISubtopicDocument = ISubtopic & Document;

export interface IProblem {
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

export type IProblemDocument = IProblem & Document;

export interface IProgress {
  userId: Types.ObjectId;
  problemId: Types.ObjectId;
  completed: boolean;
  completedAt?: Date;
  bookmarked: boolean;
  notes?: string;
}

export type IProgressDocument = IProgress & Document;
