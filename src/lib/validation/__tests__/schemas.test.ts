// Mock mongoose to avoid ES module issues in tests
jest.mock('mongoose', () => ({
  Types: {
    ObjectId: {
      isValid: jest.fn((val) => /^[0-9a-fA-F]{24}$/.test(val)),
    },
  },
}));

import { registerSchema, loginSchema, createEventSchema } from '../schemas';

describe('registerSchema', () => {
  it('should validate valid user registration', () => {
    const validData = {
      type: 'user' as const,
      email: 'test@example.com',
      password: 'Password123',
      name: 'Test User',
    };
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate valid organization registration', () => {
    const validData = {
      type: 'organization' as const,
      email: 'org@example.com',
      password: 'Password123',
      name: 'Test Org',
      description: 'Test description',
    };
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      type: 'user' as const,
      email: 'invalid-email',
      password: 'Password123',
      name: 'Test User',
    };
    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject weak password', () => {
    const invalidData = {
      type: 'user' as const,
      email: 'test@example.com',
      password: 'weak',
      name: 'Test User',
    };
    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject password without uppercase', () => {
    const invalidData = {
      type: 'user' as const,
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };
    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject password without number', () => {
    const invalidData = {
      type: 'user' as const,
      email: 'test@example.com',
      password: 'Password',
      name: 'Test User',
    };
    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject empty name', () => {
    const invalidData = {
      type: 'user' as const,
      email: 'test@example.com',
      password: 'Password123',
      name: '',
    };
    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('should validate valid login', () => {
    const validData = {
      type: 'user' as const,
      email: 'test@example.com',
      password: 'anypassword',
    };
    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      type: 'user' as const,
      email: 'invalid-email',
      password: 'password',
    };
    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject empty password', () => {
    const invalidData = {
      type: 'user' as const,
      email: 'test@example.com',
      password: '',
    };
    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('createEventSchema', () => {
  it('should validate valid event', () => {
    const validData = {
      title: 'Test Event',
      description: 'Test description',
      date: '2024-12-31T10:00:00Z',
      category: 'Technology' as const,
      status: 'Upcoming' as const,
      price: 0,
    };
    const result = createEventSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const invalidData = {
      title: '',
      date: '2024-12-31T10:00:00Z',
      category: 'Technology' as const,
      status: 'Upcoming' as const,
      price: 0,
    };
    const result = createEventSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid date format', () => {
    const invalidData = {
      title: 'Test Event',
      date: 'invalid-date',
      category: 'Technology' as const,
      status: 'Upcoming' as const,
      price: 0,
    };
    const result = createEventSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject negative price', () => {
    const invalidData = {
      title: 'Test Event',
      date: '2024-12-31T10:00:00Z',
      category: 'Technology' as const,
      status: 'Upcoming' as const,
      price: -10,
    };
    const result = createEventSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should validate registration deadline before event date', () => {
    const validData = {
      title: 'Test Event',
      date: '2024-12-31T10:00:00Z',
      registrationDeadline: '2024-12-30T10:00:00Z',
      category: 'Technology' as const,
      status: 'Upcoming' as const,
      price: 0,
    };
    const result = createEventSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject registration deadline after event date', () => {
    const invalidData = {
      title: 'Test Event',
      date: '2024-12-31T10:00:00Z',
      registrationDeadline: '2025-01-01T10:00:00Z',
      category: 'Technology' as const,
      status: 'Upcoming' as const,
      price: 0,
    };
    const result = createEventSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
