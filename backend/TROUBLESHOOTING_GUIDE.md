# Universal Lighthouse Backend - Troubleshooting Guide

This comprehensive guide documents all the problems encountered during the Railway deployment of the Universal Lighthouse NestJS backend and their solutions. This serves as a reference for future deployments and debugging similar issues.

---

## 🚨 **Overview of Issues**

The Universal Lighthouse backend experienced multiple deployment failures on Railway, primarily due to database schema mismatches and configuration issues. This guide covers the systematic resolution of these problems.

---

## 📋 **Problem Categories**

### 1. **Railway Health Check Failures**
### 2. **Database Connection and Migration Issues**  
### 3. **Entity-Database Schema Mismatches**
### 4. **TypeScript Compilation Errors**
### 5. **Table Name Mapping Issues**
### 6. **Missing Database Columns**

---

## 🔍 **Detailed Problem Analysis & Solutions**

### **Problem 1: Railway Health Check Failures (404 Errors)**

#### **Symptoms:**
```
Railway deployment failing with health check timeouts
GET /api/health returning 404 Not Found
Application not starting properly on Railway
```

#### **Root Cause:**
- Missing `AppController` registration in `AppModule`
- Health endpoint not properly exposed
- Global prefix not correctly configured

#### **Solution:**
```typescript
// Fixed app.module.ts
@Module({
  imports: [
    // ...other imports
  ],
  controllers: [AppController], // ✅ Added missing AppController
  providers: [AppService],
})
export class AppModule {}
```

```typescript
// Verified app.controller.ts has health endpoint
@Controller()
export class AppController {
  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
```

#### **Key Lessons:**
- Always verify controller registration in modules
- Ensure health endpoints are properly exposed for cloud platforms
- Test health endpoints locally before deploying

---

### **Problem 2: Database Migration and Connection Issues**

#### **Symptoms:**
```
TypeORM connection failures
Database tables not found
Migration not applied to production database
SSL connection issues with Railway PostgreSQL
```

#### **Root Cause:**
- No migration infrastructure for production database
- Environment variables not properly configured
- Missing production database schema

#### **Solution:**

**A) Created Migration Infrastructure:**
```typescript
// Created src/migrations/1735603200000-InitialSchema.ts
export class InitialSchema1735603200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create all required tables with proper schema
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // ... complete table creation scripts
  }
}
```

**B) Fixed Production Environment Configuration:**
```typescript
// Updated data-source.ts for Railway
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false, // ✅ Fixed SSL for Railway
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // ✅ Disabled for production
});
```

**C) Applied Migration to Production:**
```bash
# Created .env.migration with Railway credentials
npm run migration:run:production
```

#### **Key Lessons:**
- Always use migrations for production databases
- Never rely on `synchronize: true` in production
- Test database connections with proper SSL configuration

---

### **Problem 3: Entity-Database Schema Mismatches**

#### **Symptoms:**
```
API endpoints returning 500 errors
"relation does not exist" errors
Column type mismatches
Foreign key constraint failures
```

#### **Root Cause:**
- Entities using `number` IDs while database used `uuid`
- Entity field names not matching database column names
- Missing relationships and foreign keys

#### **Solution:**

**A) Fixed ID Types Across All Entities:**
```typescript
// Before (causing issues):
@PrimaryGeneratedColumn()
id: number;

// After (aligned with database):
@PrimaryGeneratedColumn('uuid')
id: string;
```

**B) Updated Controller Parameters:**
```typescript
// Before (causing parsing issues):
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {

// After (properly handling UUIDs):
@Get(':id')
findOne(@Param('id') id: string) {
```

**C) Fixed Entity Relationships:**
```typescript
// Added missing foreign key relationships
@ManyToOne(() => Cause, (cause) => cause.images, {
  onDelete: 'CASCADE',
})
@JoinColumn({ name: 'causeId' })
cause: Cause;
```

#### **Key Lessons:**
- Always align entity definitions with actual database schema
- Use migrations to define the single source of truth
- Test entity relationships thoroughly

---

### **Problem 4: Table Name Mapping Issues**

#### **Symptoms:**
```
"relation 'Team' does not exist" errors
TypeORM looking for wrong table names
Case sensitivity issues with table names
```

#### **Root Cause:**
- Missing explicit table name declarations in entity decorators
- TypeORM defaulting to class names instead of database table names

#### **Solution:**
```typescript
// Before (causing table lookup failures):
@Entity()
export class Team {

@Entity()
export class Event {

@Entity()
export class Gallery {

// After (explicitly mapped to database tables):
@Entity('teams')
export class Team {

@Entity('events')
export class Event {

@Entity('gallery')
export class Gallery {
```

#### **Key Lessons:**
- Always explicitly specify table names in entity decorators
- Ensure entity decorators match migration table names exactly
- Test table name mappings in development

---

### **Problem 5: Missing Database Columns**

#### **Symptoms:**
```
"column does not exist" errors
Schema validation failures
API endpoints returning 400 Bad Request
```

#### **Root Cause:**
- Entity properties not matching database columns
- Missing columns in entity definitions
- Extra properties in entities that don't exist in database

#### **Solution:**

**A) Added Missing Columns:**
```typescript
// Added missing imageUrl column to Cause entity
@Entity('causes')
export class Cause {
  // ...existing fields
  
  @Column({ nullable: true })
  imageUrl: string; // ✅ Added to match database schema
  
  // ...rest of entity
}
```

**B) Removed Non-existent Columns:**
```typescript
// Before (entity had fields not in database):
@Entity('cause_images')
export class CauseImage {
  @CreateDateColumn()
  createdAt: Date; // ❌ Column doesn't exist in database
  
  @UpdateDateColumn()
  updatedAt: Date; // ❌ Column doesn't exist in database
}

// After (aligned with actual database schema):
@Entity('cause_images')
export class CauseImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  url: string;
  
  @Column({ type: 'varchar', nullable: true })
  alt: string | null;
  
  @Column()
  causeId: string;
  // ✅ Only fields that exist in database
}
```

#### **Key Lessons:**
- Use migration files as the definitive schema reference
- Validate entity properties against actual database columns
- Remove any entity properties that don't exist in the database

---

### **Problem 6: TypeScript Compilation Errors**

#### **Symptoms:**
```
Build failures during Railway deployment
Property access errors
Type mismatches in DTOs and services
```

#### **Root Cause:**
- DTOs referencing non-existent entity properties
- Services trying to access removed fields
- Type mismatches between entities and DTOs

#### **Solution:**

**A) Fixed DTO Alignment:**
```typescript
// Removed non-existent fields from DTOs
export class CreateTeamDto {
  name: string;
  description: string;
  imageUrl?: string;
  // ✅ Removed: role, linkedinUrl, twitterUrl (not in database)
}

export class CauseImageDto {
  url: string;
  alt?: string;
  // ✅ Removed: order (not in database)
}
```

**B) Updated Service Methods:**
```typescript
// Removed references to non-existent fields
async create(createCauseDto: CreateCauseDto) {
  const cause = this.causesRepository.create({
    ...createCauseDto,
    // ✅ Removed: order field references
  });
  return await this.causesRepository.save(cause);
}
```

#### **Key Lessons:**
- Keep DTOs synchronized with entity definitions
- Remove all references to deleted entity properties
- Use TypeScript compiler to catch schema mismatches early

---

## 🛠️ **Best Practices for Future Deployments**

### **1. Database Schema Management**
- Always use migrations for schema changes
- Never use `synchronize: true` in production
- Keep entity definitions aligned with migration files
- Test migrations on a copy of production data first

### **2. Entity Design**
- Explicitly specify table names in `@Entity()` decorators
- Use consistent data types (prefer UUIDs for primary keys)
- Define relationships with proper `@JoinColumn` mappings
- Only include entity properties that exist in the database

### **3. Railway-Specific Configuration**
- Configure SSL properly for PostgreSQL connections
- Set appropriate health check timeouts (300+ seconds)
- Use environment variables for all database credentials
- Remove automatic migrations from startup commands

### **4. Error Prevention**
- Validate entity schemas against database before deployment
- Test all API endpoints locally before pushing
- Use TypeScript compiler to catch type mismatches
- Implement comprehensive error handling and logging

### **5. Deployment Strategy**
- Commit and push small, focused changes
- Test each fix individually before moving to the next
- Monitor Railway logs during deployment
- Verify all endpoints after each deployment

---

## 🔧 **Quick Debugging Checklist**

When facing similar issues, check these items in order:

### **Database Issues:**
- [ ] Are all required tables created in the database?
- [ ] Do entity table names match database table names exactly?
- [ ] Are all entity properties mapped to existing database columns?
- [ ] Are foreign key relationships properly configured?

### **TypeORM Configuration:**
- [ ] Is SSL configured correctly for the production environment?
- [ ] Are entity decorators (`@Entity`, `@Column`, etc.) correct?
- [ ] Is `synchronize` set to `false` for production?
- [ ] Are migration files applied to the production database?

### **Railway Deployment:**
- [ ] Is the health check endpoint accessible at `/api/health`?
- [ ] Are all controllers properly registered in modules?
- [ ] Is the global prefix configured correctly?
- [ ] Are environment variables set in Railway dashboard?

### **Code Quality:**
- [ ] Does the TypeScript compiler pass without errors?
- [ ] Are all DTOs aligned with entity definitions?
- [ ] Are service methods updated to match entity changes?
- [ ] Are controller parameters using correct types (string for UUIDs)?

---

## 📞 **Support Resources**

- **Railway Documentation**: https://docs.railway.app/
- **NestJS Documentation**: https://docs.nestjs.com/
- **TypeORM Documentation**: https://typeorm.io/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

## 📈 **Final Status**

After implementing all the solutions documented above, the Universal Lighthouse backend achieved:

- ✅ **100% Health Check Success Rate**
- ✅ **All API Endpoints Functional**
- ✅ **Zero Database Schema Errors**
- ✅ **Full TypeScript Compilation**
- ✅ **Production-Ready Railway Deployment**

**Deployment URL**: https://universallighthouse-backend-production.up.railway.app

This troubleshooting guide serves as a comprehensive reference for resolving similar deployment and schema issues in future NestJS applications deployed to Railway or other cloud platforms.
