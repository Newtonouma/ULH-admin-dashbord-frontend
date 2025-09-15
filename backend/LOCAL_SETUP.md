# Universal Lighthouse Backend - Local Development Setup

This guide will help you set up the Universal Lighthouse backend for local development, independent of any cloud platform deployments.

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn package manager
- Git

### **1. Clone the Repository**

```bash
git clone https://github.com/Newtonouma/universallighthouse-backend.git
cd universallighthouse-backend
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Database Setup**

#### **Option A: Local PostgreSQL Installation**

1. **Install PostgreSQL** on your system:
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql`
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL service**:
   - **Windows**: PostgreSQL should auto-start after installation
   - **macOS**: `brew services start postgresql`
   - **Linux**: `sudo systemctl start postgresql`

3. **Create database and user**:
   ```sql
   -- Connect to PostgreSQL as superuser
   sudo -u postgres psql
   
   -- Create database
   CREATE DATABASE universal_lighthouse;
   
   -- Create user (optional, you can use default postgres user)
   CREATE USER lighthouse_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE universal_lighthouse TO lighthouse_user;
   
   -- Exit
   \q
   ```

#### **Option B: Docker PostgreSQL**

```bash
# Run PostgreSQL in Docker
docker run --name universal-lighthouse-db \
  -e POSTGRES_DB=universal_lighthouse \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:13
```

#### **Option C: Docker Compose (Complete Environment)**

For a complete containerized development environment:

```bash
# Start PostgreSQL only
docker-compose up postgres -d

# Or start both database and application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

### **4. Environment Configuration**

The `.env` file is already configured for local development. Verify these settings:

```bash
# Verify your .env file contains:
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=universal_lighthouse
```

**Important**: Update the `DATABASE_PASSWORD` to match your PostgreSQL setup.

### **5. Database Migration**

Run the database migrations to create all necessary tables:

```bash
# Run migrations
npm run migration:run

# Verify migrations
npm run migration:show
```

### **6. Start the Application**

```bash
# Development mode with hot reload
npm run start:dev

# Debug mode
npm run start:debug

# Production build
npm run build
npm run start:prod
```

The application will be available at: **http://localhost:3000**

## 📊 **Development Tools**

### **Database Management**

```bash
# Generate new migration
npm run migration:generate

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

### **Code Quality**

```bash
# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# End-to-end tests
npm run test:e2e
```

## 🔧 **Configuration Details**

### **Environment Variables**

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Application port | `3000` |
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_USER` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | `postgres` |
| `DATABASE_NAME` | Database name | `universal_lighthouse` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3001` |
| `PAYPAL_CLIENT_ID` | PayPal sandbox client ID | Configure for testing |
| `PAYPAL_CLIENT_SECRET` | PayPal sandbox secret | Configure for testing |

### **Database Schema**

The application includes these entities:
- **Causes** - Fundraising causes and projects
- **Teams** - Team member profiles with social media
- **Events** - Community events with start/end times
- **Gallery** - Project images and documentation
- **Donations** - Donation records and tracking

## 🚀 **API Endpoints**

### **Base URL**: `http://localhost:3000/api`

#### **Causes**
- `GET /causes` - List all causes
- `POST /causes` - Create new cause
- `GET /causes/:id` - Get specific cause
- `PATCH /causes/:id` - Update cause
- `DELETE /causes/:id` - Delete cause

#### **Teams**
- `GET /teams` - List all team members
- `POST /teams` - Create team member
- `GET /teams/:id` - Get specific team member
- `PATCH /teams/:id` - Update team member
- `DELETE /teams/:id` - Delete team member

#### **Events**
- `GET /events` - List all events
- `POST /events` - Create event
- `GET /events/:id` - Get specific event
- `PATCH /events/:id` - Update event
- `DELETE /events/:id` - Delete event

#### **Gallery**
- `GET /gallery` - List all gallery items
- `POST /gallery` - Create gallery item
- `GET /gallery/:id` - Get specific gallery item
- `PATCH /gallery/:id` - Update gallery item
- `DELETE /gallery/:id` - Delete gallery item

#### **Donations**
- `GET /donations` - List all donations
- `POST /donations` - Create donation

## 🧪 **Testing**

### **API Testing with Postman**

Import the provided Postman collection from `API_TESTING_GUIDE.md` and update the base URL to:
```
http://localhost:3000
```

### **Sample Test Data**

Use the comprehensive test data provided in `POSTMAN_TEST_DATA.md` for testing all endpoints.

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Database Connection Failed**
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql  # Linux
   brew services list | grep postgresql  # macOS
   
   # Check if database exists
   psql -U postgres -l
   ```

2. **Port Already in Use**
   ```bash
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill -9  # macOS/Linux
   netstat -ano | findstr :3000  # Windows
   ```

3. **Migration Errors**
   ```bash
   # Reset migrations (caution: will lose data)
   npm run migration:revert
   npm run migration:run
   ```

4. **TypeScript Compilation Errors**
   ```bash
   # Clean build
   rm -rf dist/
   npm run build
   ```

### **Performance Optimization**

For local development, the application includes:
- ✅ Hot reload for faster development
- ✅ Database synchronization in development mode
- ✅ Detailed logging and error reporting
- ✅ Development-friendly CORS settings

## 📝 **Next Steps**

After successful local setup:

1. **Test all API endpoints** using Postman or your preferred API client
2. **Run the test suite** to ensure everything works correctly
3. **Explore the codebase** to understand the application structure
4. **Make your modifications** and improvements
5. **Consider deployment options** when ready for production

## 🔗 **Additional Resources**

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [API Testing Guide](./API_TESTING_GUIDE.md)
- [Postman Test Data](./POSTMAN_TEST_DATA.md)

---

**Happy Coding!** 🎉

For questions or issues, please check the existing documentation or create an issue in the repository.
