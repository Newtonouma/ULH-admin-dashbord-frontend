@echo off
echo 🚀 Starting Universal Lighthouse Backend Local Development Setup...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

:: Check if .env file exists
if not exist ".env" (
    echo ❌ .env file not found. Please create one based on .env.example
    pause
    exit /b 1
)

echo ✅ Environment file found

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
) else (
    echo ✅ Dependencies already installed
)

:: Build the application
echo 🔨 Building application...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check for compilation errors.
    pause
    exit /b 1
)

echo ✅ Build successful

:: Database setup options
echo.
echo 🗄️ Database Setup Options:
echo 1. Use existing PostgreSQL (default)
echo 2. Start PostgreSQL with Docker
echo 3. Start complete environment with Docker Compose
echo.
set /p db_option="Choose option (1-3) [1]: "
if "%db_option%"=="" set db_option=1

if "%db_option%"=="2" (
    echo 🐳 Starting PostgreSQL with Docker...
    docker run --name universal-lighthouse-db -e POSTGRES_DB=universal_lighthouse -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:13
    echo ⏳ Waiting for database to start...
    timeout /t 5 /nobreak >nul
) else if "%db_option%"=="3" (
    echo 🐳 Starting complete environment with Docker Compose...
    docker-compose up -d
    echo ✅ Environment started. You can view logs with: docker-compose logs -f
    pause
    exit /b 0
) else (
    echo ✅ Using existing PostgreSQL setup
)

:: Run migrations
echo 📊 Running database migrations...
npm run migration:run

if %errorlevel% neq 0 (
    echo ⚠️ Migration failed. Database might not be running or accessible.
    echo 💡 Check your DATABASE_* environment variables in .env
    echo 💡 Try: docker-compose up postgres -d
    pause
    exit /b 1
)

echo ✅ Migrations completed

:: Start the development server
echo.
echo 🚀 Starting development server...
echo 📍 Application will be available at: http://localhost:3000
echo 📍 API endpoints at: http://localhost:3000/api
echo.
echo Press Ctrl+C to stop the server
echo.

npm run start:dev