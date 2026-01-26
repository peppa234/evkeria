import { hashPassword, comparePassword } from '../password';

describe('Password utilities', () => {
  const testPassword = 'TestPassword123';

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const hashed = await hashPassword(testPassword);
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(testPassword);
      expect(hashed.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for the same password', async () => {
      const hash1 = await hashPassword(testPassword);
      const hash2 = await hashPassword(testPassword);
      // Bcrypt includes salt, so hashes should be different
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', async () => {
      const hashed = await hashPassword('');
      expect(hashed).toBeDefined();
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      const hashed = await hashPassword(testPassword);
      const result = await comparePassword(testPassword, hashed);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const hashed = await hashPassword(testPassword);
      const result = await comparePassword('WrongPassword', hashed);
      expect(result).toBe(false);
    });

    it('should handle empty password', async () => {
      const hashed = await hashPassword('');
      const result = await comparePassword('', hashed);
      expect(result).toBe(true);
    });
  });
});
