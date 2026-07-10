import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, createToken, verifyToken } from '@/lib/auth';

describe('auth', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('test-password');
    expect(hash).not.toBe('test-password');
    const valid = await verifyPassword('test-password', hash);
    expect(valid).toBe(true);
    const invalid = await verifyPassword('wrong', hash);
    expect(invalid).toBe(false);
  });

  it('creates and verifies a JWT token', async () => {
    const token = await createToken();
    expect(typeof token).toBe('string');
    const payload = await verifyToken(token);
    expect(payload).toHaveProperty('role', 'admin');
    expect(payload).toHaveProperty('iat');
  });

  it('rejects invalid token', async () => {
    await expect(verifyToken('bad-token')).rejects.toThrow();
  });
});
