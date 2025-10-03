# Todo Application - Full Stack

A complete todo management application with user authentication and authorization.

## What is this?

This is a web application where users can:
- Login with their account
- Create, view, edit, and delete their personal todo items
- Each user can only see and manage their own todos
- Admin users can manage user roles
- Everything runs in isolated containers (no need to install anything on your computer)

## What you need before starting

1. **Docker Desktop** installed and running
   - Windows/Mac: Download from https://www.docker.com/products/docker-desktop
   - Linux: Install docker and docker-compose from your package manager
   
2. **A terminal/command line**
   - Windows: PowerShell, CMD, or WSL
   - Mac/Linux: Terminal

3. **A web browser** (Chrome, Firefox, Safari, Edge, etc.)

That's it! No need to install PHP, Node.js, MySQL, or anything else.

## How to run the application

### Step 1: Open terminal and navigate to project folder

```bash
# Replace with your actual path
cd /path/to/project/folder
```

### Step 2: Start the application

```bash
# Make the script executable (only needed once)
chmod +x start.sh

# Run the application
./start.sh
```

**What happens:**
- Docker will download required images (first time only, takes a few minutes)
- Creates 3 containers: database, backend, and frontend
- Sets up the database with test users
- Starts all services

### Step 3: Access the application

Open your browser and go to:
- **Application**: http://localhost:4200

You should see a login page.

### Step 4: Login with test account

Use one of these accounts:

**Admin Account** (can manage users):
- Email: `admin@example.com`
- Password: `password`

**Regular User Account**:
- Email: `user@example.com`
- Password: `password`

### Step 5: Use the application

**All users can:**
- Create new todos
- Mark todos as complete/incomplete
- Edit existing todos
- Delete todos

**Admin users can also:**
- Click "Users" button to see all users
- Change user roles (admin/user)
- View user information

## How to stop the application

```bash
# Stop all containers
docker-compose down
```

## Troubleshooting

### Application won't start

**Problem**: Port already in use
```
Error: port is already allocated
```

**Solution**: Another application is using the port. Stop it or change ports in `docker-compose.yml`

---

**Problem**: Docker is not running
```
Error: Cannot connect to Docker daemon
```

**Solution**: Start Docker Desktop

---

**Problem**: Permission denied
```
Error: Permission denied
```

**Solution**: 
- Linux/Mac: Run with `sudo ./start.sh`
- Windows: Run terminal as Administrator

### Can't login

**Problem**: Login button doesn't work

**Solution**: 
1. Wait 30 seconds after starting (backend needs time to initialize)
2. Check if all containers are running: `docker-compose ps`
3. Restart: `docker-compose down` then `./start.sh`

### Page is blank

**Problem**: Frontend shows blank page

**Solution**:
1. Check browser console (F12) for errors
2. Make sure you're accessing http://localhost:4200 (not 8000)
3. Clear browser cache and reload

## Project Structure

```
.
├── backend/              # Laravel API (you don't need to touch this)
├── frontend/             # Angular application (you don't need to touch this)
├── docker-compose.yml    # Docker configuration
├── start.sh              # Script to start everything
└── README.md             # This file
```

## Features

- **Authentication**: JWT-based authentication system
- **Authorization**: Role-based access control (Admin/User)
- **Todo Management**: Full CRUD operations for todos
- **User Management**: Admin can view and manage user roles
- **Security**: Password hashing, token expiration, resource ownership validation
- **Containerization**: Everything runs in Docker containers

## Technologies Used

### Backend
- Laravel 10
- PHP 8.2
- MySQL 8.0
- JWT Authentication (tymon/jwt-auth)

### Frontend
- Angular 17
- TypeScript
- RxJS
- Reactive Forms

### Infrastructure
- Docker & Docker Compose
- MySQL 8.0

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/refresh` - Refresh token
- `GET /api/me` - Get current user

### Todos
- `GET /api/todos` - List all user's todos
- `POST /api/todos` - Create new todo
- `GET /api/todos/{id}` - Get specific todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo

### Users (Admin Only)
- `GET /api/users` - List all users
- `PUT /api/users/{id}/role` - Update user role

## Database Structure

### Table: users
- id
- name
- email
- role (admin/user)
- password
- created_at
- updated_at

### Table: todos
- id
- user_id (foreign key to users)
- title
- description
- completed 
- created_at
- updated_at
