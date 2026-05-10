# 🪟 Traveloop - Windows Quick Start

## ⚡ Super Quick Setup (5 Steps)

### Prerequisites to Install First:

1. **PostgreSQL 15+** 
   - Download: https://www.postgresql.org/download/windows/
   - Install with default settings
   - Remember the password you set!

2. **Node.js 18+**
   - Download: https://nodejs.org/
   - Install LTS version

3. **Git** (if not installed)
   - Download: https://git-scm.com/download/win

---

## 🚀 Setup Steps

### Step 1: Install PostgreSQL

1. Download and run PostgreSQL installer
2. Set a password (e.g., `postgres123`)
3. Use default port `5432`
4. Complete installation

**Add PostgreSQL to PATH:**
- Press `Win + X` → System → Advanced → Environment Variables
- Edit "Path" → Add: `C:\Program Files\PostgreSQL\15\bin`
- Click OK and restart Command Prompt

### Step 2: Run Setup Script

Open Command Prompt in the project folder:

```cmd
cd D:\ODOO\claude\traveloop
setup.bat
```

This will:
- ✅ Check PostgreSQL and Node.js
- ✅ Create database
- ✅ Run schema and seed data
- ✅ Install dependencies
- ✅ Create .env files

### Step 3: Configure Environment

Edit `backend\.env`:

```env
DB_PASSWORD=your_postgres_password
JWT_SECRET=any_random_32_character_string_here_abc123
JWT_REFRESH_SECRET=another_random_32_character_string_xyz789
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

**Gmail App Password:**
1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Create App Password for "Mail"
4. Copy the 16-character password

### Step 4: Start Servers

**Option A: Start Both (Recommended)**
```cmd
start-all.bat
```

**Option B: Start Separately**

Terminal 1:
```cmd
start-backend.bat
```

Terminal 2:
```cmd
start-frontend.bat
```

### Step 5: Open Application

Browser will open automatically at:
```
http://localhost:3000
```

---

## 🎯 Quick Test

1. Click "Sign Up"
2. Register with your email
3. Check email for verification
4. Login
5. Create a trip!

---

## ❌ Troubleshooting

### PostgreSQL Not Found

**Error:** `'psql' is not recognized`

**Fix:**
1. Add to PATH: `C:\Program Files\PostgreSQL\15\bin`
2. Restart Command Prompt
3. Test: `psql --version`

### Database Connection Failed

**Error:** `password authentication failed`

**Fix:**
1. Check password in `backend\.env`
2. Match with PostgreSQL password

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Fix:**
Change port in `backend\.env`:
```env
PORT=5001
```

Update `frontend\.env`:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

---

## 📁 Project Structure

```
traveloop/
├── setup.bat              # Run this first
├── start-all.bat          # Start both servers
├── start-backend.bat      # Start backend only
├── start-frontend.bat     # Start frontend only
├── backend/               # Node.js API
├── frontend/              # React app
├── database/              # SQL files
└── docs/                  # Documentation
```

---

## 📚 Documentation

- **Complete Setup**: `WINDOWS_SETUP.md`
- **Quick Start**: `QUICKSTART.md`
- **Project Info**: `README.md`
- **Database**: `docs/DATABASE_DESIGN.md`
- **All Docs**: `docs/INDEX.md`

---

## 🆘 Need Help?

1. Check `WINDOWS_SETUP.md` for detailed instructions
2. Check `docs/SETUP_GUIDE.md` for troubleshooting
3. Review error messages in terminal

---

## ✅ Checklist

- [ ] PostgreSQL installed and in PATH
- [ ] Node.js installed
- [ ] Ran `setup.bat`
- [ ] Configured `backend\.env`
- [ ] Started servers with `start-all.bat`
- [ ] Opened http://localhost:3000
- [ ] Registered and logged in

---

## 🎉 Success!

If you see the Traveloop homepage, you're all set!

**Next Steps:**
- Create your first trip
- Add destinations
- Schedule activities
- Track your budget

---

**Happy Traveling! 🌍✈️**
