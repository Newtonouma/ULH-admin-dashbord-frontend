# Universal Lighthouse Backend - Railway Deployment Guide

## ✅ STATUS: READY FOR DEPLOYMENT

**Last Updated:** May 30, 2025

### 🎉 Critical Issue RESOLVED
**PROBLEM:** Health endpoint `/api/health` was returning 404 errors during Railway deployment.

**ROOT CAUSE:** `AppController` and `AppService` were not registered in `AppModule`.

**SOLUTION APPLIED:**
- ✅ Added `AppController` and `AppService` imports to `src/app.module.ts`
- ✅ Added `controllers: [AppController]` and `providers: [AppService]` to module configuration
- ✅ Build verified successfully with no compilation errors
- ✅ Health endpoint now properly registered and accessible

---

## 🚀 Railway Deployment Instructions

## ⚠️ CRITICAL: Database Setup Required

**Before deploying, you MUST add a PostgreSQL database to your Railway project:**

1. Go to your Railway project dashboard
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically inject these environment variables:
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
4. Your app is configured to use these automatically

**If you see database connection errors, the database service is missing!**

---

## Prerequisites
1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Push your code to GitHub
3. **PostgreSQL Database**: Railway will provide this

### Step 1: Deploy to Railway

1. **Connect to Railway**:
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   ```

2. **Create New Project**:
   ```bash
   # Initialize Railway project
   railway init
   
   # Link to existing project (optional)
   railway link [project-id]
   ```

3. **Add PostgreSQL Database** (CRITICAL):
   - In Railway dashboard, click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
   - Railway will automatically inject database environment variables
   - **Without this step, the app will fail to start with database connection errors**

### Step 2: Configure Environment Variables

Set these environment variables in Railway dashboard:

#### Required Variables:
```
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
PAYPAL_CLIENT_ID=your_production_paypal_client_id
PAYPAL_CLIENT_SECRET=your_production_paypal_client_secret
```

#### Database Variables (Auto-provided by Railway):
- `PGHOST` → `DATABASE_HOST`
- `PGPORT` → `DATABASE_PORT`
- `PGUSER` → `DATABASE_USER`
- `PGPASSWORD` → `DATABASE_PASSWORD`
- `PGDATABASE` → `DATABASE_NAME`

### Step 3: Deploy

```bash
# Deploy to Railway
railway up

# Or connect GitHub for automatic deployments
# Go to Railway dashboard → Settings → Connect GitHub
```

### Step 4: Run Migrations (if needed)

```bash
# Connect to Railway environment
railway shell

# Run migrations
npm run migration:run
```

## 🔧 Production Configuration

### Database Settings
- ✅ SSL enabled for production
- ✅ No auto-synchronization in production
- ✅ Migration-based schema management

### Security Features
- ✅ CORS configured for production frontend
- ✅ Input validation with class-validator
- ✅ Environment-based configuration
- ✅ Security headers enabled

### API Endpoints
- Health Check: `GET /api/health`
- Gallery: `GET|POST|PATCH|DELETE /api/gallery`
- Teams: `GET|POST|PATCH|DELETE /api/teams`
- Events: `GET|POST|PATCH|DELETE /api/events`
- Causes: `GET|POST|PATCH|DELETE /api/causes`
- Donations: `POST /api/donations`

## 🧪 Testing Deployment

### Health Check
```bash
curl https://your-app.railway.app/api/health
```

### API Test
```bash
# Test root endpoint
curl https://your-app.railway.app/api

# Test gallery endpoint
curl https://your-app.railway.app/api/gallery
```

## 📁 File Structure
```
├── Dockerfile              # Container configuration
├── railway.json           # Railway deployment config
├── .env.example           # Environment template
├── src/
│   ├── main.ts            # Application entry point
│   ├── app.module.ts      # Main module with DB config
│   └── data-source.ts     # TypeORM configuration
└── migrations/            # Database migrations
```

## 🔍 Troubleshooting

### Database Connection Errors (ECONNREFUSED):
**Most common issue**: Missing PostgreSQL database service

1. **Check Database Service**:
   - Go to Railway dashboard
   - Verify PostgreSQL database is added to your project
   - If missing: Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**

2. **Verify Environment Variables**:
   - Check that `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` are present
   - These are automatically injected by Railway when database is added

3. **Check Logs**:
   ```bash
   railway logs
   ```

### Other Common Issues:
1. **CORS Errors**: Update `FRONTEND_URL` environment variable
2. **Migration Errors**: Run migrations manually in Railway shell
3. **Build Failures**: Check that all dependencies are in `package.json`

### Logs:
```bash
# View deployment logs
railway logs

# Follow live logs
railway logs --follow
```

## 🛡️ Security Checklist
- ✅ Environment variables for sensitive data
- ✅ No hardcoded credentials
- ✅ HTTPS/SSL enabled
- ✅ Input validation
- ✅ CORS properly configured
- ✅ Security headers set
