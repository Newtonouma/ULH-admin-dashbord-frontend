#!/bin/bash

# Universal Lighthouse Backend - Local Development Startup Script

echo "🚀 Starting Universal Lighthouse Backend Local Development Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if PostgreSQL is running (attempt connection)
if ! command -v psql &> /dev/null; then
    echo "⚠️ psql command not found. Make sure PostgreSQL is installed and in PATH."
    echo "💡 You can use Docker instead: docker-compose up postgres -d"
else
    echo "✅ PostgreSQL client found"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create one based on .env.example"
    exit 1
fi

echo "✅ Environment file found"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for compilation errors."
    exit 1
fi

echo "✅ Build successful"

# Ask user about database setup
echo ""
echo "🗄️ Database Setup Options:"
echo "1. Use existing PostgreSQL (default)"
echo "2. Start PostgreSQL with Docker"
echo "3. Start complete environment with Docker Compose"
echo ""
read -p "Choose option (1-3) [1]: " db_option
db_option=${db_option:-1}

case $db_option in
    2)
        echo "🐳 Starting PostgreSQL with Docker..."
        docker run --name universal-lighthouse-db \
            -e POSTGRES_DB=universal_lighthouse \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=postgres \
            -p 5432:5432 \
            -d postgres:13
        echo "⏳ Waiting for database to start..."
        sleep 5
        ;;
    3)
        echo "🐳 Starting complete environment with Docker Compose..."
        docker-compose up -d
        echo "✅ Environment started. You can view logs with: docker-compose logs -f"
        exit 0
        ;;
    *)
        echo "✅ Using existing PostgreSQL setup"
        ;;
esac

# Run migrations
echo "📊 Running database migrations..."
npm run migration:run

if [ $? -ne 0 ]; then
    echo "⚠️ Migration failed. Database might not be running or accessible."
    echo "💡 Check your DATABASE_* environment variables in .env"
    echo "💡 Try: docker-compose up postgres -d"
    exit 1
fi

echo "✅ Migrations completed"

# Start the development server
echo ""
echo "🚀 Starting development server..."
echo "📍 Application will be available at: http://localhost:3000"
echo "📍 API endpoints at: http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run start:dev