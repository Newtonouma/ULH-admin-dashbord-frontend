# Database Migration Guide - Production Railway Database

## 🚨 CRITICAL: Production Database Migration

This guide helps you safely run migrations on your **live Railway production database**.

---

## 📋 Prerequisites

1. ✅ Your backend is deployed and running on Railway
2. ✅ PostgreSQL database service is added to your Railway project
3. ✅ You need the Railway database credentials

---

## 🔧 Setup Production Migration Environment

### Step 1: Get Railway Database Credentials

1. Go to your **Railway project dashboard**
2. Click on your **PostgreSQL database service**
3. Go to **"Variables"** tab
4. Copy these values:
   - `PGHOST` (e.g., `roundhouse.proxy.rlwy.net`)
   - `PGPORT` (usually `5432`)
   - `PGUSER` (usually `postgres`)
   - `PGPASSWORD` (long random string)
   - `PGDATABASE` (usually `railway`)

### Step 2: Configure Migration Environment

1. Edit the `.env.migration` file in your project root:

```bash
# Production Migration Environment Variables
DATABASE_HOST=your-actual-railway-pg-host.proxy.rlwy.net
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your-actual-railway-pg-password
DATABASE_NAME=railway
NODE_ENV=production
```

⚠️ **IMPORTANT**: Replace the placeholder values with your actual Railway database credentials.

---

## 🏃‍♂️ Running Migrations

### Check Current Migration Status
```powershell
npm run migration:show:prod
```
This shows which migrations have been applied and which are pending.

### Run Pending Migrations
```powershell
npm run migration:run:prod
```
This applies all pending migrations to your production database.

### Revert Last Migration (if needed)
```powershell
npm run migration:revert:prod
```
⚠️ **USE WITH CAUTION**: This reverts the last applied migration.

---

## 📝 Current Migration

Your project has one migration: `AddRaisedToCauseAndDonations1680000000000`

**What it does:**
- ✅ Adds `raised` column to `causes` table (decimal with default 0)
- ✅ Creates `donations` table with proper foreign key relationships

**SQL Operations:**
```sql
-- Up migration
ALTER TABLE "causes" ADD "raised" decimal(12,2) NOT NULL DEFAULT '0';
CREATE TABLE "donations" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "amount" decimal(12,2) NOT NULL,
    "donorName" varchar(255),
    "donorEmail" varchar(255),
    "causeId" uuid NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "PK_donations_id" PRIMARY KEY ("id"),
    CONSTRAINT "FK_donations_cause" FOREIGN KEY ("causeId") REFERENCES "causes"("id") ON DELETE CASCADE
);
```

---

## 🚀 Automated Migration on Deploy

To run migrations automatically on each Railway deployment, update your `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run migration:run && npm run start:prod",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

⚠️ **Note**: This runs migrations on every deploy. Make sure migrations are idempotent.

---

## 🛟 Safety Tips

1. **Backup First**: Railway automatically backs up your database, but consider manual backup for critical operations
2. **Test Locally**: Always test migrations on a copy of production data first
3. **Read-Only Check**: Ensure your app can handle brief database unavailability during migration
4. **Monitor**: Watch Railway logs during migration execution
5. **Rollback Plan**: Know how to revert changes if something goes wrong

---

## 🔍 Troubleshooting

### Connection Issues
```
Error: password authentication failed for user "postgres"
```
**Solution**: Double-check your Railway database credentials in `.env.migration`

### Migration Already Applied
```
Error: Migration "AddRaisedToCauseAndDonations1680000000000" has already been applied
```
**Solution**: This is normal. The migration was already run successfully.

### SSL Issues
```
Error: self signed certificate
```
**Solution**: The data source is configured to handle Railway's SSL automatically.

---

## 📞 Support

- **Railway Logs**: Check your Railway deployment logs for detailed error messages
- **Database Console**: Use Railway's database console for direct SQL access
- **Migration Status**: Always check `npm run migration:show:prod` before running migrations

---

**⚡ Ready to Run Migration?**

1. ✅ Update `.env.migration` with Railway credentials
2. ✅ Run `npm run migration:show:prod` to check status
3. ✅ Run `npm run migration:run:prod` to apply migrations
4. ✅ Verify your application works correctly

Your production database will be updated safely! 🚀
