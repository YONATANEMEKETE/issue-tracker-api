import argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    // If the stored hash is malformed, argon2.verify can throw an exception.
    // In production, we catch this and return false so the application doesn't crash.
    return false;
  }
}
