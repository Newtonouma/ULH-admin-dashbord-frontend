# Universal Lighthouse API - Postman Testing Guide

## Base URL
```
http://localhost:3000
```

## Authentication Flow

### 1. Register a New User (Admin)
**Method:** `POST`  
**URL:** `http://localhost:3000/auth/register`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "username": "admin",
  "email": "admin@universallighthouse.com",
  "password": "AdminPassword123!"
}
```
**Expected Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-here",
    "username": "admin",
    "email": "admin@universallighthouse.com",
    "role": "admin",
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  }
}
```

### 2. Login
**Method:** `POST`  
**URL:** `http://localhost:3000/auth/login`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "usernameOrEmail": "admin",
  "password": "AdminPassword123!"
}
```
**Expected Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "username": "admin",
    "email": "admin@universallighthouse.com",
    "role": "admin"
  }
}
```

**🔑 IMPORTANT:** Copy the `access_token` from the response - you'll need it for all protected endpoints!

### 3. Refresh Token
**Method:** `POST`  
**URL:** `http://localhost:3000/auth/refresh`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "refreshToken": "your-refresh-token-here"
}
```

### 4. Logout
**Method:** `POST`  
**URL:** `http://localhost:3000/auth/logout`  
**Headers:**
```
Authorization: Bearer your-access-token-here
Content-Type: application/json
```

### 5. Forgot Password
**Method:** `POST`  
**URL:** `http://localhost:3000/auth/forgot-password`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "email": "admin@universallighthouse.com"
}
```

### 6. Reset Password
**Method:** `POST`  
**URL:** `http://localhost:3000/auth/reset-password`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewPassword123!"
}
```

### 7. Change Password
**Method:** `POST`  
**URL:** `http://localhost:3000/auth/change-password`  
**Headers:**
```
Authorization: Bearer your-access-token-here
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "currentPassword": "AdminPassword123!",
  "newPassword": "NewAdminPassword123!"
}
```

---

## Protected Endpoints (Require JWT Token)

### Setting up Authorization in Postman:
1. Go to the **Authorization** tab in your request
2. Select **Bearer Token** as the type
3. Paste your access token in the **Token** field

OR add to Headers:
```
Authorization: Bearer your-access-token-here
```

---

## Causes API

### 1. Get All Causes
**Method:** `GET`  
**URL:** `http://localhost:3000/causes`  
**Headers:**
```
Authorization: Bearer your-access-token-here
```

### 2. Get Single Cause
**Method:** `GET`  
**URL:** `http://localhost:3000/causes/:id`  
**Headers:**
```
Authorization: Bearer your-access-token-here
```

### 3. Create Cause
**Method:** `POST`  
**URL:** `http://localhost:3000/causes`  
**Headers:**
```
Authorization: Bearer your-access-token-here
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "title": "Clean Water Initiative",
  "goal": 50000,
  "category": "Environment",
  "description": "Providing clean water access to underserved communities",
  "imageUrl": "https://example.com/water-image.jpg"
}
```

### 4. Update Cause
**Method:** `PATCH`  
**URL:** `http://localhost:3000/causes/:id`  
**Headers:**
```
Authorization: Bearer your-access-token-here
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "title": "Updated Clean Water Initiative",
  "raised": 15000
}
```

### 5. Delete Cause
**Method:** `DELETE`  
**URL:** `http://localhost:3000/causes/:id`  
**Headers:**
```
Authorization: Bearer your-access-token-here
```

---

## Events API

### 1. Get All Events
**Method:** `GET`  
**URL:** `http://localhost:3000/events`  
**Headers:**
```
Authorization: Bearer your-access-token-here
```

### 2. Create Event
**Method:** `POST`  
**URL:** `http://localhost:3000/events`  
**Headers:**
```
Authorization: Bearer your-access-token-here
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "title": "Charity Gala 2025",
  "description": "Annual fundraising gala event",
  "date": "2025-03-15T19:00:00.000Z",
  "endTime": "2025-03-15T23:00:00.000Z",
  "location": "Grand Ballroom, City Center",
  "imageUrl": "https://example.com/gala-image.jpg"
}
```

### 3. Update Event
**Method:** `PATCH`  
**URL:** `http://localhost:3000/events/:id`  
**Headers:**
```
Authorization: Bearer your-access-token-here
Content-Type: application/json
```

### 4. Delete Event
**Method:** `DELETE`  
**URL:** `http://localhost:3000/events/:id`  
**Headers:**
```
Authorization: Bearer your-access-token-here
```

---

## Teams API

### 1. Get All Teams
**Method:** `GET`  
**URL:** `http://localhost:3000/teams`  
**Headers:**
```
Authorization: Bearer your-access-token-here
```

### 2. Create Team
**Method:** `POST`  
**URL:** `http://localhost:3000/teams`  
**Headers:**
```
Authorization: Bearer your-access-token-here
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "name": "John Doe",
  "position": "Executive Director",
  "bio": "Passionate about making a difference in the world",
  "imageUrl": "https://example.com/john-doe.jpg",
  "socialMedia": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "twitter": "https://twitter.com/johndoe"
  },
  "contact": {
    "email": "john.doe@universallighthouse.com",
    "phone": "+1-555-0123"
  }
}
```

### 3. Update Team Member
**Method:** `PATCH`  
**URL:** `http://localhost:3000/teams/:id`  
**Headers:**
```
Authorization: Bearer your-access-token-here
Content-Type: application/json
```

### 4. Delete Team Member
**Method:** `DELETE`  
**URL:** `http://localhost:3000/teams/:id`  
**Headers:**
```
Authorization: Bearer your-access-token-here
```

---

## Gallery API

### 1. Get All Gallery Items
**Method:** `GET`  
**URL:** `http://localhost:3000/gallery`  
**Headers:**
```
Authorization: Bearer your-access-token-here
```

### 2. Create Gallery Item
**Method:** `POST`  
**URL:** `http://localhost:3000/gallery`  
**Headers:**
```
Authorization: Bearer your-access-token-here
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "title": "Community Outreach 2024",
  "description": "Photos from our community outreach program",
  "imageUrl": "https://example.com/outreach-2024.jpg",
  "type": "photo"
}
```

### 3. Update Gallery Item
**Method:** `PATCH`  
**URL:** `http://localhost:3000/gallery/:id`  
**Headers:**
```
Authorization: Bearer your-access-token-here
Content-Type: application/json
```

### 4. Delete Gallery Item
**Method:** `DELETE`  
**URL:** `http://localhost:3000/gallery/:id`  
**Headers:**
```
Authorization: Bearer your-access-token-here
```

---

## Donations API

### 1. Get All Donations
**Method:** `GET`  
**URL:** `http://localhost:3000/donations`  
**Headers:**
```
Authorization: Bearer your-access-token-here
```

### 2. Create Donation
**Method:** `POST`  
**URL:** `http://localhost:3000/donations`  
**Headers:**
```
Authorization: Bearer your-access-token-here
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "amount": 100.00,
  "currency": "USD",
  "donorEmail": "donor@example.com",
  "donorName": "Jane Smith",
  "causeId": "cause-uuid-here",
  "message": "Keep up the great work!"
}
```

---

## Health Check (No Authentication Required)

### Health Check
**Method:** `GET`  
**URL:** `http://localhost:3000/api/health`  
**Headers:** None required

**Expected Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

---

## Testing Tips

1. **Start with Authentication**: Always test registration and login first to get your JWT token
2. **Copy the JWT Token**: After successful login, copy the access_token for use in protected endpoints
3. **Test Order**: Test in this order:
   - Register → Login → Create operations → Read operations → Update operations → Delete operations
4. **Error Testing**: Try accessing protected endpoints without the Authorization header to test security
5. **Token Expiration**: JWT tokens expire after 1 hour - you'll need to refresh or login again

## Common Error Responses

- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Valid token but insufficient permissions
- **400 Bad Request**: Invalid request body or missing required fields
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Resource already exists (e.g., duplicate email/username)

## Environment Variables Check

Make sure these environment variables are set:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `JWT_REFRESH_SECRET` - Secret for refresh token signing
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Email configuration
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3001)