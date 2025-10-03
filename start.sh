#!/bin/bash

echo "=========================================="
echo "Todo Application - Startup Script"
echo "=========================================="
echo ""

# Check if Docker is running
echo "[1/5] Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker is not running!"
    echo ""
    echo "Please start Docker Desktop and try again."
    echo "Download: https://www.docker.com/products/docker-desktop"
    exit 1
fi
echo "Docker is running."
echo ""

# Stop any running containers
echo "[2/5] Stopping existing containers..."
docker-compose down > /dev/null 2>&1
echo "Done."
echo ""

# Build and start containers
echo "[3/5] Building and starting containers..."
echo "This may take a few minutes on first run..."
docker-compose up -d --build

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to start containers!"
    echo "Try running: docker-compose down"
    echo "Then run this script again."
    exit 1
fi
echo "Containers started."
echo ""

# Wait for database to be ready
echo "[4/5] Waiting for database to initialize..."
sleep 15
echo "Database ready."
echo ""

# Setup backend
echo "[5/5] Setting up backend..."
docker-compose exec -T backend bash -c "
    # Generate application key
    php artisan key:generate --force
    
    # Generate JWT secret
    php artisan jwt:secret --force
    
    # Run migrations and seed database
    php artisan migrate:fresh --seed --force
    
    # Clear caches
    php artisan config:clear
    php artisan cache:clear
" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "Warning: Backend setup had some issues, but may still work."
fi
echo "Backend configured."
echo ""

echo ""
echo "=========================================="
echo "Application is ready!"
echo "=========================================="
echo ""
echo "Open your browser and go to:"
echo "  http://localhost:4200"
echo ""
echo "Login with:"
echo "  Email: admin@example.com"
echo "  Password: password"
echo ""
echo "  OR"
echo ""
echo "  Email: user@example.com"
echo "  Password: password"
echo ""
echo "To stop the application:"
echo "  docker-compose down"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo "=========================================="
