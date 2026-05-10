# Traveloop - Quick Start Guide

Get Traveloop up and running in 10 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Git

## Quick Setup

### 1. Clone and Install (2 minutes)

```bash
# Clone repository
git clone https://github.com/yourusername/traveloop.git
cd traveloop

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup (3 minutes)

```bash
# Create database
createdb traveloop

# Run schema and seed data
cd ../database
psql -U postgres -d traveloop -f schema.sql
psql -U postgres -d traveloop -f seed.sql
```

### 3. Configure Environment (2 minutes)

**Backend (.env):**
```bash
cd ../backend
cp .env.example .env
```

Edit `backend/.env` with minimum required settings:
```env
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secret_key_min_32_characters_long
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

**Frontend (.env):**
```bash
cd ../frontend
cp .env.example .env
```

Content should be:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start Servers (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 5. Test Application (2 minutes)

1. Open http://localhost:3000
2. Click "Sign Up"
3. Register with your email
4. Check email for verification link
5. Login and create your first trip!

## Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_ctl status

# Verify database exists
psql -U postgres -l | grep traveloop
```

### Port Already in Use
```bash
# Backend (port 5000)
# Change PORT in backend/.env

# Frontend (port 3000)
# Will prompt to use different port
```

### Email Not Sending
- Use Gmail with App Password
- Enable 2-Step Verification in Google Account
- Generate App Password in Security settings

## Default Data

After seeding, you'll have:
- 20 countries
- 33 cities worldwide
- 9 activity categories
- 50+ activities

## Next Steps

1. **Explore Features**
   - Create a trip
   - Add destinations
   - Schedule activities
   - Track budget
   - Create packing list

2. **Read Documentation**
   - [Full Setup Guide](docs/SETUP_GUIDE.md)
   - [Project Plan](docs/PROJECT_PLAN.md)
   - [Database Design](docs/DATABASE_DESIGN.md)

3. **Start Developing**
   - Review code structure
   - Run tests: `npm test`
   - Check logs: `backend/logs/`

## Quick Commands

```bash
# Backend
npm run dev          # Start with hot reload
npm test            # Run tests
npm run lint        # Check code quality

# Frontend
npm start           # Start development server
npm test            # Run tests
npm run build       # Build for production

# Database
psql -U postgres -d traveloop              # Connect to database
psql -U postgres -d traveloop -c "\dt"     # List tables
```

## Support

- 📖 [Full Documentation](docs/)
- 🐛 [Report Issues](https://github.com/yourusername/traveloop/issues)
- 💬 [Discussions](https://github.com/yourusername/traveloop/discussions)

---

**Ready to travel? Start planning with Traveloop! 🌍✈️**
