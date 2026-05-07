import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { ROLES, Role } from '@constants/app.constants';
import { env } from '@config/env';

export interface IUserFields {
  name: string;
  email: string;
  password: string;
  avatar: string;
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

export type IUserDocument = Document & IUserFields & IUserMethods;

type UserModel = Model<IUserDocument>;

const userSchema = new Schema<IUserDocument, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    avatar: { type: String, default: '' },
    role: {
      type: String,
      enum: Object.values(ROLES) as Role[],
      default: ROLES.USER,
    },
    streak: { type: Number, default: 0, min: 0 },
    xp: { type: Number, default: 0, min: 0 },
    lastActiveDate: { type: Date },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true, versionKey: false },
);



userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  this.password = await bcrypt.hash(this.password, env.BCRYPT_SALT_ROUNDS);
});

userSchema.methods.comparePassword = async function (
  this: IUserDocument,
  candidatePassword: string,
): Promise<boolean> {
  const userWithPassword = await User.findById(this._id).select('+password');
  if (!userWithPassword) return false;
  return bcrypt.compare(candidatePassword, userWithPassword.password);
};

userSchema.methods.generateAccessToken = function (this: IUserDocument): string {
  const options: SignOptions = {
    expiresIn: env.ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn'],
  };
  return jwt.sign(
    {
      _id: (this._id as { toString(): string }).toString(),
      email: this.email,
      role: this.role,
    },
    env.ACCESS_TOKEN_SECRET,
    options,
  );
};

userSchema.methods.generateRefreshToken = function (this: IUserDocument): string {
  const options: SignOptions = {
    expiresIn: env.REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn'],
  };
  return jwt.sign(
    { _id: (this._id as { toString(): string }).toString() },
    env.REFRESH_TOKEN_SECRET,
    options,
  );
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = ret as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete r.password;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete r.refreshToken;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return r;
  },
});

export const User = mongoose.model<IUserDocument, UserModel>('User', userSchema);
