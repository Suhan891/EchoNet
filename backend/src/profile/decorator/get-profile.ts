import {
  ConflictException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { profileDto } from '../dto/profile.dto';
import { Request } from 'express';

export const currentProfile = createParamDecorator(
  (data: unknown, context: ExecutionContext): profileDto => {
    const request = context.switchToHttp().getRequest<Request>();

    const profile = request['profile'] as profileDto | null;

    if (!profile) throw new ConflictException('Profile data not received');

    return profile;
  },
);
