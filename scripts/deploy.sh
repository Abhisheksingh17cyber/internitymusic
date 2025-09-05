#!/bin/bash
# Production deployment script

set -e

echo "🚀 Starting deployment..."

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
cd backend && npm ci --only=production
cd ../frontend && npm ci

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Copy build to backend public folder
cp -r build/* ../backend/public/

# Restart services
echo "🔄 Restarting services..."
pm2 restart musicstream-backend || pm2 start ecosystem.config.js

# Run database migrations if any
echo "🗄️ Running migrations..."
cd ../backend
npm run migrate

echo "✅ Deployment completed successfully!"

# Health check
sleep 5
curl -f http://localhost:5000/api/health || exit 1
echo "💚 Health check passed!"
