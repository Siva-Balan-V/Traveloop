# Traveloop - Setup and Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v18.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (v9.0.0 or higher)
   - Comes with Node.js
   - Verify installation: `npm --version`

3. **PostgreSQL** (v15.0 or higher)
   - Download from: https://www.postgresql.org/download/
   - Verify installation: `psql --version`

4. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

### Optional Tools

- **pgAdmin** or **DBeaver**: Database management GUI
- **Postman** or **Insomnia**: API testing
- **VS Code**: Recommended code editor

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/traveloop.git
cd traveloop
```

### Step 2: Database Setup

#### 2.1 Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE traveloop;

# Exit psql
\q
```

#### 2.2 Run Schema

```bash
# Navigate to database directory
cd database

# Run schema creation
psql -U postgres -d traveloop -f schema.sql

# Run seed data
psql -U postgres -d traveloop -f seed.sql

# Verify tables created
psql -U postgres -d traveloop -c "\dt"
```

Expected output should show all tables:
- users
- trips
- trip_stops
- activities
- stop_activities
- cities
- countries
- trip_notes
- packing_items
- user_sessions
- security_logs
- user_preferences
- saved_destinations
- activity_categories

### Step 3: Backend Setup

#### 3.1 Install Dependencies

```bash
# Navigate to backend directory
cd ../backend

# Install npm packages
npm install
```

#### 3.2 Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# Use your preferred text editor
```

**Required Environment Variables:**

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=traveloop
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_token_secret_min_32_characters
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=Traveloop <noreply@traveloop.com>

# Security Configuration
BCRYPT_ROUNDS=12
PASSWORD_RESET_EXPIRES=3600000
EMAIL_VERIFICATION_EXPIRES=86400000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

**Gmail App Password Setup:**
1. Go to Google Account settings
2. Security → 2-Step Verification
3. App passwords → Generate new app password
4. Use generated password in EMAIL_PASSWORD

#### 3.3 Start Backend Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

Server should start on http://localhost:5000

**Verify Backend:**
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Traveloop API is running",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

### Step 4: Frontend Setup

#### 4.1 Install Dependencies

```bash
# Navigate to frontend directory
cd ../frontend

# Install npm packages
npm install
```

#### 4.2 Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
```

**Required Environment Variables:**

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 4.3 Start Frontend Server

```bash
# Development mode
npm start
```

Frontend should start on http://localhost:3000

Browser should automatically open. If not, navigate to http://localhost:3000

### Step 5: Verify Installation

#### 5.1 Test User Registration

1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill in registration form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: Test123!@#
4. Click "Register"
5. Check email for verification link
6. Click verification link

#### 5.2 Test User Login

1. Navigate to login page
2. Enter credentials:
   - Email: test@example.com
   - Password: Test123!@#
3. Click "Login"
4. Should redirect to dashboard

#### 5.3 Test Trip Creation

1. Click "Create New Trip"
2. Fill in trip details:
   - Trip Name: Summer Vacation
   - Start Date: Future date
   - End Date: After start date
   - Description: Optional
3. Click "Create Trip"
4. Should see trip in trips list

## Troubleshooting

### Database Connection Issues

**Problem**: Cannot connect to PostgreSQL

**Solutions**:
1. Verify PostgreSQL is running:
   ```bash
   # Windows
   pg_ctl status
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Check credentials in .env file
3. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

4. Check PostgreSQL logs:
   ```bash
   # Location varies by OS
   # Windows: C:\Program Files\PostgreSQL\15\data\log
   # Linux: /var/log/postgresql
   ```

### Backend Server Issues

**Problem**: Server won't start

**Solutions**:
1. Check if port 5000 is already in use:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Linux/Mac
   lsof -i :5000
   ```

2. Verify all dependencies installed:
   ```bash
   npm install
   ```

3. Check for syntax errors:
   ```bash
   npm run lint
   ```

4. Review logs in `backend/logs/app.log`

### Frontend Issues

**Problem**: Frontend won't start

**Solutions**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check if port 3000 is in use:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Linux/Mac
   lsof -i :3000
   ```

### Email Issues

**Problem**: Emails not sending

**Solutions**:
1. Verify Gmail app password is correct
2. Check if 2-Step Verification is enabled
3. Try different SMTP settings:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_SECURE=true
   ```

4. Check email service logs in backend logs

### Authentication Issues

**Problem**: Cannot login after registration

**Solutions**:
1. Verify email is verified:
   ```sql
   SELECT email, is_email_verified FROM users WHERE email = 'test@example.com';
   ```

2. Manually verify email:
   ```sql
   UPDATE users SET is_email_verified = TRUE WHERE email = 'test@example.com';
   ```

3. Check JWT_SECRET is set in .env
4. Clear browser localStorage and try again

## Development Workflow

### Running Tests

**Backend Tests:**
```bash
cd backend
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

### Database Migrations

When schema changes:

```bash
# Create migration file
cd database/migrations
touch 001_add_new_column.sql

# Run migration
psql -U postgres -d traveloop -f 001_add_new_column.sql
```

### Code Linting

**Backend:**
```bash
cd backend
npm run lint
```

**Frontend:**
```bash
cd frontend
npm run lint
```

### Building for Production

**Backend:**
```bash
cd backend
NODE_ENV=production npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

Build output in `frontend/build/`

## Production Deployment

### Environment Setup

1. Set NODE_ENV=production
2. Use strong JWT secrets (32+ characters)
3. Configure production database
4. Set up SSL/TLS certificates
5. Configure reverse proxy (nginx)
6. Set up process manager (PM2)

### Database Backup

```bash
# Create backup
pg_dump -U postgres -d traveloop -F c -f backup_$(date +%Y%m%d).dump

# Restore backup
pg_restore -U postgres -d traveloop backup_20240115.dump
```

### Monitoring

1. Set up application monitoring (PM2, New Relic)
2. Configure error tracking (Sentry)
3. Set up uptime monitoring
4. Configure log aggregation
5. Set up database monitoring

## Additional Resources

### Documentation
- [Project Plan](docs/PROJECT_PLAN.md)
- [Database Design](docs/DATABASE_DESIGN.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [AI Training Prompt](docs/AI_TRAINING_PROMPT.md)

### External Resources
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### Community
- GitHub Issues: Report bugs and request features
- Discussions: Ask questions and share ideas
- Contributing: See CONTRIBUTING.md

## Support

For help and support:
- Email: support@traveloop.com
- Documentation: https://docs.traveloop.com
- GitHub Issues: https://github.com/yourusername/traveloop/issues

## Next Steps

After successful installation:

1. **Explore the Application**
   - Create a test trip
   - Add destinations
   - Schedule activities
   - Track budget
   - Create packing list

2. **Review Documentation**
   - Read API documentation
   - Understand database schema
   - Review code structure

3. **Start Development**
   - Pick a feature to implement
   - Write tests first
   - Follow coding standards
   - Submit pull request

4. **Customize**
   - Update branding
   - Modify color scheme
   - Add custom features
   - Integrate third-party services

Happy coding! 🚀
