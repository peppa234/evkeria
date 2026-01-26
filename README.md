# Evkeria

<div align="center">

A Next.js platform for discovering volunteering opportunities, events, trainings, and exchange programs across Algeria.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.1-green?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

</div>

## Overview

Evkeria connects students, young professionals, and organizations in Algeria through a centralized platform for opportunity discovery and management. The platform supports two user types:

- **Users**: Students and professionals seeking opportunities
- **Organizations**: Entities creating and managing events

![Homepage](public/homepage.png)

## Tech Stack

### Frontend
- **Next.js 14.2** (App Router) - React framework with server-side rendering
- **TypeScript 5.0** - Type-safe JavaScript
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Markdown** - Secure markdown rendering

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB with Mongoose 9.1** - NoSQL database with ODM
- **JWT Authentication** - Token-based auth with httpOnly cookies
- **bcryptjs** - Password hashing
- **Zod 4.2** - Schema validation

### Architecture
- **Dual Authentication**: Simultaneous user and organization sessions
- **Middleware-based Route Protection**: Automatic authentication checks
- **Modular Structure**: Separation of concerns across components, API routes, and utilities

## Key Features

### User Features
- Secure authentication with JWT tokens
- Profile management (skills, interests, bio, portfolio)
- Save and bookmark events
- Advanced event search and filtering
- Responsive design for all devices

### Organization Features
- Dashboard with event statistics
- Event management (create, edit, delete)
- Image uploads for events and logos
- Organization profile management

### Technical Features
- Input sanitization and XSS protection
- Database indexing for performance
- Type-safe API with Zod validation
- Error boundaries and comprehensive error handling
- Secure markdown rendering

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB 6.0 or higher
- npm 9.x or higher

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd Evkeria
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   
   Create a `.env.local` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/evkeria
   JWT_SECRET=your-secret-key-minimum-32-characters-long
   NODE_ENV=development
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

4. Start MongoDB and run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # React components
├── context/         # React Context providers
├── lib/             # Core utilities (auth, db, validation, errors)
├── middleware.ts    # Next.js middleware for route protection
└── styles/          # Global styles
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user or organization
- `POST /api/auth/login` - Authenticate
- `GET /api/auth/me` - Get current user/organization
- `POST /api/auth/logout` - Logout

### Events
- `GET /api/events` - List events (with pagination and filters)
- `GET /api/events/[id]` - Get event details
- `POST /api/events` - Create event (organization only)
- `PUT /api/events/[id]` - Update event (organization only)
- `DELETE /api/events/[id]` - Delete event (organization only)

### Users
- `GET /api/users/[id]` - Get user profile
- `PUT /api/users/[id]` - Update profile
- `GET /api/users/[id]/saved-events` - Get saved events
- `POST /api/users/[id]/saved-events` - Save event
- `DELETE /api/users/[id]/saved-events` - Unsave event

### Organizations
- `GET /api/organizations` - List organizations
- `GET /api/organizations/[id]` - Get organization details
- `PUT /api/organizations/[id]` - Update organization profile

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `ALLOWED_ORIGINS` | Comma-separated allowed origins | Production |

## Security

- Password hashing with bcrypt
- JWT authentication with httpOnly cookies
- Input sanitization and XSS protection
- CORS protection with configurable origins
- Route protection via middleware
- Zod validation for all API inputs
- Secure markdown rendering

## Future Enhancements

### High Priority
- **AI-Powered Recommendations**: Personalized event suggestions based on user profile and behavior
- **Notifications System**: Email and push notifications for event reminders and new opportunities
- **Mobile Application**: Native iOS and Android apps
- **Payment Integration**: Secure payment processing for paid events
- **Advanced Analytics**: User engagement metrics and event performance analytics

### Medium Priority
- **Social Features**: User reviews, ratings, and event discussions
- **Calendar Integration**: Google Calendar sync and event reminders
- **Internationalization**: Multi-language support (Arabic, French, English)
- **Enhanced Search**: Full-text search with Elasticsearch
- **Two-Factor Authentication**: Additional security layer

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Contact

- Email: aichabrihmouche@gmail.com
- Location: Algiers, Algeria
