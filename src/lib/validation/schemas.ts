import { z } from 'zod';
import mongoose from 'mongoose';

// Common validations
const objectIdSchema = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: 'Invalid ID format' }
);

const emailSchema = z.string().email('Invalid email format').toLowerCase().trim();

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const urlSchema = z.string().url('Invalid URL format').or(z.literal(''));

const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .or(z.literal(''));

// Auth schemas
export const registerSchema = z.object({
  type: z.enum(['user', 'organization']),
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters').trim(),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
});

export const loginSchema = z.object({
  type: z.enum(['user', 'organization']),
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Avatar/Image URL schema - can be full URL or relative path
const imageUrlSchema = z.string()
  .refine(
    (val) => {
      if (!val || val === '') return true; // Empty is allowed
      // Allow full URLs (http:// or https://)
      if (val.startsWith('http://') || val.startsWith('https://')) {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      }
      // Allow relative paths starting with /
      if (val.startsWith('/')) return true;
      return false;
    },
    { message: 'Image URL must be a valid URL or a relative path starting with /' }
  )
  .optional()
  .or(z.literal(''));

// User schemas
export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  phone: phoneSchema.optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  portfolioUrl: urlSchema.optional(),
  avatarUrl: imageUrlSchema,
});

export const updateSkillsSchema = z.object({
  skills: z.array(z.string().trim()).max(20, 'Maximum 20 skills allowed'),
});

export const updateInterestsSchema = z.object({
  interests: z.array(z.string().trim()).max(20, 'Maximum 20 interests allowed'),
});

// Organization schemas
// Logo URL can be a full URL or a relative path starting with /
const logoUrlSchema = z.string()
  .refine(
    (val) => {
      if (!val || val === '') return true; // Empty is allowed
      // Allow full URLs (http:// or https://)
      if (val.startsWith('http://') || val.startsWith('https://')) {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      }
      // Allow relative paths starting with /
      if (val.startsWith('/')) return true;
      return false;
    },
    { message: 'Logo URL must be a valid URL or a relative path starting with /' }
  )
  .optional()
  .or(z.literal(''));

export const updateOrganizationSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  email: emailSchema.optional(),
  type: z.string().max(50).trim().optional(),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  logoUrl: logoUrlSchema,
  websiteUrl: urlSchema.optional(),
});

export const updateFieldsSchema = z.object({
  fields: z.array(z.string().trim()).max(20, 'Maximum 20 fields allowed'),
});

export const updateOpportunitiesSchema = z.object({
  opportunities: z.array(z.string().trim()).max(20, 'Maximum 20 opportunities allowed'),
});

// Event schemas
export const createEventSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long').trim(),
    description: z.string().max(2000, 'Description cannot exceed 2000 characters').optional(),
    imageUrl: imageUrlSchema,
    date: z.string().datetime('Invalid date format'),
    registrationDeadline: z.string().datetime('Invalid date format').optional().nullable(),
    startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional(),
    endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional(),
    location: z.string().max(200, 'Location too long').trim().optional(),
    category: z.enum(['Technology', 'Business', 'Marketing', 'Design', 'Education', 'Other']),
    status: z.enum(['Upcoming', 'Active', 'Past']),
    maxAttendees: z.number().int().min(0, 'Max attendees cannot be negative').optional().nullable(),
    price: z.number().min(0, 'Price cannot be negative').default(0),
    applicationLink: urlSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.registrationDeadline && data.date) {
        return new Date(data.registrationDeadline) < new Date(data.date);
      }
      return true;
    },
    {
      message: 'Registration deadline must be before event date',
      path: ['registrationDeadline'],
    }
  )
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.startTime < data.endTime;
      }
      return true;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  );

export const updateEventSchema = createEventSchema.partial();

// Query parameter schemas
export const eventQuerySchema = z.object({
  search: z.string().optional(),
  category: z.enum(['Technology', 'Business', 'Marketing', 'Design', 'Education', 'Other']).optional(),
  location: z.string().optional(),
  status: z.enum(['Upcoming', 'Active', 'Past']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// ID parameter schema
export const idParamSchema = z.object({
  id: objectIdSchema,
});

