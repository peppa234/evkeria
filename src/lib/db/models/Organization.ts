import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrganization extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  type?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  fields: string[];
  opportunities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    logoUrl: {
      type: String,
    },
    websiteUrl: {
      type: String,
      trim: true,
    },
    fields: {
      type: [String],
      default: [],
    },
    opportunities: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
// Note: email already has an index from unique: true, so we don't add it again
// Text search index for name
OrganizationSchema.index({ name: 'text' });

const Organization: Model<IOrganization> =
  mongoose.models.Organization ||
  mongoose.model<IOrganization>('Organization', OrganizationSchema);

export default Organization;

