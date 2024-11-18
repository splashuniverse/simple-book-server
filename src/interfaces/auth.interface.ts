import { Request as ExpressRequest } from 'express';

export interface AccessTokenRequest extends ExpressRequest {
  userId: number;
  token: string;
}
