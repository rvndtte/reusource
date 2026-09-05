import * as jose from 'jose';
import bcrypt from 'bcryptjs';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'reusource_super_secret_jwt_key_2026_change_in_production';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const ACCESS_TOKEN_EXPIRE_HOURS = 24;

export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

export async function verifyPassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) return false;
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch {
    return false;
  }
}

export async function createAccessToken(userId) {
  const token = await new jose.SignJWT({ sub: String(userId) })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_EXPIRE_HOURS}h`)
    .sign(secretKey);
  return token;
}

export async function verifyAccessToken(token) {
  try {
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(request) {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload || !payload.sub) return null;

  const user = db.users.findById(payload.sub);
  if (!user || user.is_active === false) {
    return null;
  }

  const company = user.company_id ? db.companies.findById(user.company_id) : null;
  return {
    ...user,
    company,
  };
}

export async function requireUser(request) {
  const user = await getCurrentUser(request);
  if (!user) {
    const error = new Error('Authentication token required or invalid.');
    error.status = 401;
    throw error;
  }
  return user;
}

export async function requireRoles(request, allowedRoles = []) {
  const user = await requireUser(request);
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const error = new Error(`Access denied: Requires role in [${allowedRoles.join(', ')}]`);
    error.status = 403;
    throw error;
  }
  return user;
}
