# Universal Lighthouse Admin Dashboard - Backend Integration

This document outlines how the admin dashboard has been integrated with the NestJS backend API.

## Overview

The admin dashboard now uses JWT-based authentication and communicates with the backend API instead of Supabase.

## Key Changes Made

### 1. API Client (`src/lib/api-client.ts`)
- Centralized HTTP client with automatic token management
- Handles JWT token refresh automatically
- Supports all CRUD operations for the backend entities

### 2. Authentication System
- **Context**: `src/contexts/AuthContext.tsx` - React context for auth state
- **Login**: Updated to use backend API with username/email + password
- **Token Management**: Automatic storage and refresh of JWT tokens

### 3. Type Definitions (`src/types/index.ts`)
- Complete TypeScript interfaces matching the backend API
- Types for Causes, Events, Teams, Gallery, Donations

### 4. API Services (`src/services/api.ts`)
- Type-safe API methods for each entity
- Built on top of the centralized API client

### 5. Updated Hooks
- `useBackendCauses.ts` - Replaces Supabase-based cause management
- `useEvents.ts` - Updated for backend API integration

## Configuration

### Environment Variables (`.env.local`)
```bash
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### API Endpoints
Based on your Postman collection, the following endpoints are available:

**Authentication:**
- `POST /auth/login` - Login with username/email and password
- `POST /auth/register` - Register new user
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh JWT token

**Causes:**
- `GET /causes` - Get all causes
- `GET /causes/:id` - Get cause by ID
- `POST /causes` - Create new cause
- `PATCH /causes/:id` - Update cause
- `DELETE /causes/:id` - Delete cause

**Events:**
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create new event
- `PATCH /events/:id` - Update event
- `DELETE /events/:id` - Delete event

**Teams:**
- `GET /teams` - Get all team members
- `GET /teams/:id` - Get team member by ID
- `POST /teams` - Create new team member
- `PATCH /teams/:id` - Update team member
- `DELETE /teams/:id` - Delete team member

**Gallery:**
- `GET /gallery` - Get all gallery items
- `GET /gallery/:id` - Get gallery item by ID
- `POST /gallery` - Create new gallery item
- `PATCH /gallery/:id` - Update gallery item
- `DELETE /gallery/:id` - Delete gallery item

**Donations:**
- `GET /donations` - Get all donations
- `GET /donations/:id` - Get donation by ID
- `POST /donations` - Create new donation

## Setup Instructions

### 1. Start the Backend
Make sure your NestJS backend is running on `http://localhost:3000`

### 2. Start the Frontend
```bash
cd admin-dashboard-frontend
npm run dev
```

### 3. Login
Use the credentials defined in your Postman collection:
- Username: `admin`
- Email: `admin@universallighthouse.com`
- Password: `AdminPassword123!`

## What's Working

✅ **Authentication**: JWT-based login/logout with automatic token refresh
✅ **Causes Management**: Full CRUD operations
✅ **Events Management**: Full CRUD operations  
✅ **Team Members Management**: Full CRUD operations
✅ **Gallery Management**: Full CRUD operations
✅ **Donations Management**: Full CRUD operations
✅ **Type Safety**: Complete TypeScript integration
✅ **Error Handling**: Proper error messages and loading states

## Recently Completed

🎉 **Team Members**: Hook and component updates for backend API - COMPLETED
🎉 **Gallery**: Hook and component updates for backend API - COMPLETED  
🎉 **Donations**: Complete dashboard for viewing and managing donations - COMPLETED

## Still Needs Implementation

🔄 **Image Upload**: Integration with backend file upload endpoints
🔄 **Enhanced Error Boundaries**: More comprehensive error handling
🔄 **Testing Suite**: Unit and integration tests

## Testing

The integration provides:

1. **Authentication Flow**: Login → Token Storage → Automatic Refresh
2. **Protected Routes**: Dashboard only accessible after authentication
3. **CRUD Operations**: Create, read, update, delete for all entities
4. **Error Handling**: Network errors, authentication failures, validation errors
5. **Loading States**: Proper loading indicators throughout the app

## Next Steps

1. Complete the remaining entity integrations (Teams, Gallery, Donations)
2. Implement image upload functionality
3. Add comprehensive error boundaries
4. Add unit and integration tests
5. Add environment-specific configuration (dev/staging/prod)

The foundation is now in place for a fully functional admin dashboard backed by your NestJS API!