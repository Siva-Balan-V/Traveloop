# Traveloop - Windows Installation Guide

## 🪟 Complete Setup for Windows

This guide will help you install all prerequisites and set up Traveloop on Windows.

---

## Step 1: Install PostgreSQL on Windows

### Option A: PostgreSQL Installer (Recommended)

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Choose PostgreSQL 15 or 16 (latest stable version)
   - Download the Windows x86-64 installer

2. **Run the Installer**
   - Double-click the downloaded `.exe` file
   - Click "Next" through the welcome screen
   
3. **Installation Directory**
   - Default: `C:\Program Files\PostgreSQL\15`
   - Click "Next"

4. **Select Components**
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4 (GUI tool)
   - ✅ Stack Builder (optional)
   - ✅ Command Line Tools
   - Click "Next"

5. **Data Directory**
   - Default: `C:\Program Files\PostgreSQL\15\data`
   - Click "Next"

6. **Set Password**
   - Enter a password for the `postgres` superuser
   - **IMPORTANT**: Remember this password!
   - Example: `postgres123` (use a strong password in production)
   - Click "Next"

7. **Port**
   - Default: `5432`
   - Click "Next"

8. **Locale**
   - Default: `[Default locale]`
   - Click "Next"

9. **Complete Installation**
   - Click "Next" to start installation
   - Wait for installation to complete
   - Uncheck "Stack Builder" (optional)
   - Click "Finish"

### Option B: PostgreSQL Portable (Alternative)

If you prefer a portable version:
1. Download from: https://www.enterprisedb.com/download-postgresql-binaries
2. Extract to a folder (e.g., `C:\PostgreSQL`)
3. Run `initdb` to initialize database
4. Start server with `pg_ctl start`

---

## Step 2: Verify PostgreSQL Installation

1. **Open Command Prompt**
   - Press `Win + R`
   - Type `cmd` and press Enter

2. **Add PostgreSQL to PATH** (if not already added)
   ```cmd
   set PATH=%PATH%;C:\Program Files\PostgreSQL\15\bin
   ```

3. **Verify Installation**
   ```cmd
   psql --version
   ```
   
   Expected output:
   ```
   psql (PostgreSQL) 15.x
   ```

4. **Test Connection**
   ```cmd
   psql -U postgres
   ```
   
   - Enter the password you set during installation
   - You should see the PostgreSQL prompt: `postgres=#`
   - Type `\q` to exit

---

## Step 3: Install Node.js

1. **Download Node.js**
   - Visit: https://nodejs.org/
   - Download the LTS version (18.x or higher)
   - Choose Windows Installer (.msi) 64-bit

2. **Run the Installer**
   - Double-click the downloaded `.msi` file
   - Accept the license agreement
   - Choose installation directory (default is fine)
   - ✅ Check "Automatically install necessary tools"
   - Click "Next" and "Install"
   - Wait for installation to complete

3. **Verify Installation**
   ```cmd
   node --version
   npm --version
   ```
   
   Expected output:
   ```
   v18.x.x
   9.x.x
   ```

---

## Step 4: Install Git (if not installed)

1. **Download Git**
   - Visit: https://git-scm.com/download/win
   - Download the 64-bit installer

2. **Run the Installer**
   - Use default settings
   - Click "Next" through all options
   - Click "Install"

3. **Verify Installation**
   ```cmd
   git --version
   ```

---

## Step 5: Set Up Traveloop Database

### Create Database

1. **Open Command Prompt**
   ```cmd
   cd D:\ODOO\claude\traveloop
   ```

2. **Connect to PostgreSQL**
   ```cmd
   psql -U postgres
   ```
   
   Enter your postgres password when prompted.

3. **Create Database**
   ```sql
   CREATE DATABASE traveloop;
   \q
   ```

### Run Schema

```cmd
cd database
psql -U postgres -d traveloop -f schema.sql
```

Enter password when prompted.

Expected output:
```
CREATE TABLE
CREATE TABLE
...
(Multiple CREATE TABLE statements)
```

### Run Seed Data

```cmd
psql -U postgres -d traveloop -f seed.sql
```

Expected output:
```
INSERT 0 20
INSERT 0 33
...
```

### Verify Database Setup

```cmd
psql -U postgres -d traveloop -c "\dt"
```

You should see a list of 14 tables:
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

---

## Step 6: Configure Backend

1. **Navigate to Backend**
   ```cmd
   cd D:\ODOO\claude\traveloop\backend
   ```

2. **Install Dependencies**
   ```cmd
   npm install
   ```
   
   This will take a few minutes.

3. **Create Environment File**
   ```cmd
   copy .env.example .env
   ```

4. **Edit .env File**
   
   Open `.env` in Notepad or VS Code:
   ```cmd
   notepad .env
   ```
   
   Update these values:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=traveloop
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password_here
   
   # JWT Configuration (generate random strings)
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_change_this
   JWT_REFRESH_SECRET=your_refresh_token_secret_min_32_characters_change_this
   
   # Email Configuration (Gmail example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password
   EMAIL_FROM=Traveloop <noreply@traveloop.com>
   
   # URLs
   FRONTEND_URL=http://localhost:3000
   BACKEND_URL=http://localhost:5000
   ```
   
   Save and close.

### Gmail App Password Setup (for Email Notifications)

1. Go to Google Account: https://myaccount.google.com/
2. Security → 2-Step Verification (enable if not enabled)
3. Security → App passwords
4. Select app: Mail
5. Select device: Windows Computer
6. Click "Generate"
7. Copy the 16-character password
8. Paste into `.env` as `EMAIL_PASSWORD`

---

## Step 7: Configure Frontend

1. **Navigate to Frontend**
   ```cmd
   cd D:\ODOO\claude\traveloop\frontend
   ```

2. **Install Dependencies**
   ```cmd
   npm install
   ```

3. **Create Environment File**
   ```cmd
   copy .env.example .env
   ```

4. **Edit .env File**
   ```cmd
   notepad .env
   ```
   
   Content:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
   
   Save and close.

---

## Step 8: Start the Application

### Terminal 1 - Start Backend

```cmd
cd D:\ODOO\claude\traveloop\backend
npm run dev
```

Expected output:
```
[timestamp] [info]: Traveloop server running on port 5000
[timestamp] [info]: Environment: development
[timestamp] [info]: Database connection established
```

**Keep this terminal open!**

### Terminal 2 - Start Frontend

Open a **new** Command Prompt:

```cmd
cd D:\ODOO\claude\traveloop\frontend
npm start
```

Expected output:
```
Compiled successfully!

You can now view traveloop-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

Browser should automatically open to http://localhost:3000

**Keep this terminal open!**

---

## Step 9: Test the Application

1. **Open Browser**
   - Navigate to: http://localhost:3000
   - You should see the Traveloop landing page

2. **Register a New User**
   - Click "Sign Up" or "Register"
   - Fill in the form:
     - First Name: Test
     - Last Name: User
     - Email: test@example.com
     - Password: Test123!@#
   - Click "Register"

3. **Check Email**
   - Check your email for verification link
   - Click the verification link

4. **Login**
   - Go back to http://localhost:3000/login
   - Enter your credentials
   - Click "Login"

5. **Create a Trip**
   - Click "Create New Trip"
   - Fill in trip details
   - Click "Create"

**Congratulations! Traveloop is running!** 🎉

---

## Troubleshooting

### PostgreSQL Issues

**Problem**: `psql: command not found`

**Solution**: Add PostgreSQL to PATH permanently
1. Press `Win + X` → System
2. Advanced system settings → Environment Variables
3. Under "System variables", find "Path"
4. Click "Edit" → "New"
5. Add: `C:\Program Files\PostgreSQL\15\bin`
6. Click "OK" on all dialogs
7. **Restart Command Prompt**

---

**Problem**: `psql: FATAL: password authentication failed`

**Solution**: 
1. Check password in `.env` matches PostgreSQL password
2. Try resetting PostgreSQL password:
   ```cmd
   psql -U postgres
   ALTER USER postgres PASSWORD 'newpassword';
   ```

---

**Problem**: `could not connect to server`

**Solution**: Start PostgreSQL service
1. Press `Win + R`
2. Type `services.msc`
3. Find "postgresql-x64-15"
4. Right-click → Start

---

### Backend Issues

**Problem**: `Error: connect ECONNREFUSED`

**Solution**: 
1. Verify PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists:
   ```cmd
   psql -U postgres -l
   ```

---

**Problem**: Port 5000 already in use

**Solution**: Change port in `backend/.env`
```env
PORT=5001
```

Also update frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

---

### Frontend Issues

**Problem**: `npm install` fails

**Solution**:
1. Clear npm cache:
   ```cmd
   npm cache clean --force
   ```
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again

---

**Problem**: Port 3000 already in use

**Solution**: 
- When prompted, press `Y` to use a different port
- Or kill the process using port 3000:
  ```cmd
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

---

### Email Issues

**Problem**: Emails not sending

**Solution**:
1. Verify Gmail App Password is correct
2. Check 2-Step Verification is enabled
3. Try different SMTP settings:
   ```env
   EMAIL_PORT=465
   EMAIL_SECURE=true
   ```

---

## Quick Commands Reference

### PostgreSQL Commands

```cmd
# Connect to PostgreSQL
psql -U postgres

# Connect to specific database
psql -U postgres -d traveloop

# List databases
psql -U postgres -l

# List tables in current database
psql -U postgres -d traveloop -c "\dt"

# Run SQL file
psql -U postgres -d traveloop -f filename.sql

# Exit psql
\q
```

### Backend Commands

```cmd
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test
```

### Frontend Commands

```cmd
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## Alternative: Using Docker (Optional)

If you prefer Docker:

1. **Install Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop

2. **Create docker-compose.yml** (in project root)
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: traveloop
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgres
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

3. **Start PostgreSQL**
   ```cmd
   docker-compose up -d
   ```

4. **Run schema and seed**
   ```cmd
   docker exec -i traveloop_postgres_1 psql -U postgres -d traveloop < database/schema.sql
   docker exec -i traveloop_postgres_1 psql -U postgres -d traveloop < database/seed.sql
   ```

---

## Next Steps

1. ✅ PostgreSQL installed and running
2. ✅ Database created and seeded
3. ✅ Backend configured and running
4. ✅ Frontend configured and running
5. ✅ Application tested

**Now you can:**
- Explore the application
- Create trips and itineraries
- Test all features
- Review the code
- Start developing new features

---

## Support

- **Documentation**: Check `/docs` folder
- **Quick Start**: See `QUICKSTART.md`
- **Detailed Setup**: See `docs/SETUP_GUIDE.md`
- **Database Info**: See `docs/DATABASE_DESIGN.md`

---

**Happy Coding! 🚀**
