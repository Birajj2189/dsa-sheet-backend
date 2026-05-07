import { User } from '@models/User.model';
import { IUserDocument } from '@models/User.model';
import { ApiError } from '@utils/ApiError';
import { HTTP_STATUS } from '@constants/http.constants';
import { RegisterInput, LoginInput } from '@validations/auth.validation';
import { verifyRefreshToken } from '@lib/token.lib';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: Record<string, unknown>;
}

export async function registerUser(data: RegisterInput): Promise<AuthTokens> {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'An account with this email already exists');
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
  });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken, user: user.toJSON() as unknown as Record<string, unknown> };
}

export async function loginUser(data: LoginInput): Promise<AuthTokens> {
  const user = (await User.findOne({ email: data.email }).select('+password')) as IUserDocument | null;

  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(data.password);
  if (!isPasswordValid) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  user.lastActiveDate = new Date();
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken, user: user.toJSON() as unknown as Record<string, unknown> };
}

export async function logoutUser(userId: string): Promise<void> {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
}

export async function refreshAccessToken(incomingRefreshToken: string): Promise<AuthTokens> {
  const decoded = verifyRefreshToken(incomingRefreshToken);

  const user = (await User.findById(decoded._id).select('+refreshToken')) as IUserDocument | null;

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Refresh token is invalid or has been revoked');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken, user: user.toJSON() as unknown as Record<string, unknown> };
}

export async function getCurrentUser(userId: string): Promise<IUserDocument> {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }
  return user;
}
