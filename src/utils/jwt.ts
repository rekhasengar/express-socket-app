import jwt from 'jsonwebtoken';

import { serverConfig } from '@src/config';
import { JWT_OBJECT } from '@src/types/jwt';

const jwtSecretKey = serverConfig.JWT_SECRET_KEY;

export function generateJWT(data: JWT_OBJECT): string {
  const token = jwt.sign(data, jwtSecretKey, { expiresIn: '1d' });
  return token;
}

export function validateJwtToken(token: string): JWT_OBJECT | null {
  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    return <JWT_OBJECT>decoded;
  } catch (err) {
    return null;
  }
}
