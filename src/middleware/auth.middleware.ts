import { Request, Response, NextFunction } from 'express';
import { COOKIE_NAMES, ROLES, Role } from '@constants/app.constants';
import { HTTP_STATUS } from '@constants/http.constants';
import { ApiError } from '@utils/ApiError';
import { asyncHandler } from '@utils/asyncHandler';
import { verifyAccessToken } from '@lib/token.lib';
import { User, IUserDocument } from '@models/User.model';

export const authenticateUser = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const token =
      (req.cookies as Record<string, string>)[COOKIE_NAMES.ACCESS_TOKEN] ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication required');
    }

    const decoded = verifyAccessToken(token);

    const user = (await User.findById(decoded._id).select(
      '-password -refreshToken',
    )) as IUserDocument | null;

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not found or token invalid');
    }

    req.user = user;
    next();
  },
);

export const authorizeRoles = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication required');
    }

    if (!roles.includes(req.user.role as Role)) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        `Role '${req.user.role}' is not authorized to access this resource`,
      );
    }

    next();
  };
};

export const isAdmin = authorizeRoles(ROLES.ADMIN);
