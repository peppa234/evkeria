import mongoose, { Schema, Document, Model } from 'mongoose';

export type EventStatus = 'Upcoming' | 'Active' | 'Past';
export type EventCategory =
  | 'Technology'
  | 'Business'
  | 'Marketing'
  | 'Design'
  | 'Education'
  | 'Other';

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  imageUrl?: string;
  date: Date;
  registrationDeadline?: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  category: EventCategory;
  status: EventStatus;
  maxAttendees?: number;
  price: number;
  applicationLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    imageUrl: {
      type: String,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    registrationDeadline: {
      type: Date,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    location: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Technology', 'Business', 'Marketing', 'Design', 'Education', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Active', 'Past'],
      default: 'Upcoming',
    },
    maxAttendees: {
      type: Number,
      min: [0, 'Max attendees cannot be negative'],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    applicationLink: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
EventSchema.index({ organizationId: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ date: -1 });
EventSchema.index({ category: 1 });
EventSchema.index({ location: 1 });

// Compound indexes for common query patterns
// For filtering by category and status, sorted by date
EventSchema.index({ category: 1, status: 1, date: -1 });
// For filtering by location and status
EventSchema.index({ location: 1, status: 1, date: -1 });
// For organization events sorted by date
EventSchema.index({ organizationId: 1, date: -1 });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;


