import { User } from '@models/User.model';
import { IUserDocument } from '@models/User.model';
import { ApiError } from '@utils/ApiError';
import { HTTP_STATUS } from '@constants/http.constants';

export interface UpdateProfileData {
  name?: string;
  avatar?: string;
}

export async function getUserProfile(userId: string): Promise<IUserDocument> {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }
  return user;
}

export async function updateUserProfile(
  userId: string,
  data: UpdateProfileData,
): Promise<IUserDocument> {
  const user = await User.findByIdAndUpdate(userId, { $set: data }, { new: true, runValidators: true });

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  return user;
}
