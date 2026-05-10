# Traveloop - Personalized Travel Planning Platform

![Traveloop Banner](https://via.placeholder.com/1200x300/667eea/ffffff?text=Traveloop+-+Plan+Your+Perfect+Journey)

## 🌍 Overview

Traveloop is a comprehensive, full-stack travel planning application that empowers users to create personalized multi-city itineraries, manage budgets, and share travel plans. Built with modern web technologies and a focus on scalability, security, and user experience.

## ✨ Key Features

### Core Functionality
- **User Authentication**: Secure registration, login, email verification, and password reset
- **Trip Management**: Create, update, delete, and organize multi-city trips
- **Itinerary Builder**: Add destinations, activities, and schedules with drag-and-drop
- **Budget Tracking**: Automatic cost calculation with visual breakdowns
- **City & Activity Search**: Discover destinations and experiences
- **Trip Notes**: Journal entries and reminders for each trip
- **Packing Checklist**: Organize items by category with completion tracking
- **Public Sharing**: Generate shareable links for trip itineraries
- **User Profile**: Manage preferences, settings, and saved destinations

### Technical Highlights
- **Zero Third-Party API Dependencies**: Self-contained data and logic
- **Custom Validators**: No external validation libraries
- **PostgreSQL Database**: Robust relational data model with triggers and views
- **JWT Authentication**: Secure token-based authentication
- **Email Notifications**: Security alerts and trip reminders
- **Rate Limiting**: Protection against abuse
- **Comprehensive Logging**: Winston-based logging system
- **Transaction Support**: ACID-compliant database operations

## 🏗️ Architecture

### Technology Stack

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15+
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer
- **Logging**: Winston
- **Testing**: Jest

#### Frontend
- **Framework**: React 18+
- **Routing**: React Router v6
- **State Management**: Context API + useReducer
- **Styling**: CSS Modules + CSS Variables
- **HTTP Client**: Fetch API
- **Charts**: Custom SVG-based visualizations

### Project Structure

```
traveloop/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and app configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, rate limiting, error handling
│   │   ├── models/          # Data access layer
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── validators/      # Input validation
│   │   └── server.js        # Application entry point
│   ├── tests/               # Test suites
│   ├── logs/                # Application logs
│   ├── .env.example         # Environment template
│   └── package.json
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level components
│   │   ├── contexts/        # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API communication
│   │   ├── utils/           # Helper functions
│   │   ├── styles/          # Global styles
│   │   └── App.js           # Root component
│   └── package.json
├── database/
│   ├── schema.sql           # Database schema
│   └── seed.sql             # Initial data
└── docs/
    ├── PROJECT_PLAN.md      # Comprehensive planning document
    ├── DATABASE_DESIGN.md   # Database documentation
    └── API_DOCUMENTATION.md # API reference
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 15+
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/traveloop.git
cd traveloop
```

#### 2. Database Setup

```bash
# Create database
createdb traveloop

# Run schema
psql -U postgres -d traveloop -f database/schema.sql

# Seed initial data
psql -U postgres -d traveloop -f database/seed.sql
```

#### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Update database credentials, JWT secrets, email settings

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

#### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with backend URL

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

### Environment Configuration

#### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=traveloop
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

#### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
POST   /api/auth/logout            - User logout
GET    /api/auth/verify-email      - Verify email address
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password
```

### Trip Endpoints

```
GET    /api/trips                  - List user trips
POST   /api/trips                  - Create new trip
GET    /api/trips/:id              - Get trip details
PUT    /api/trips/:id              - Update trip
DELETE /api/trips/:id              - Delete trip
GET    /api/trips/:id/budget       - Get budget breakdown
POST   /api/trips/:id/share        - Generate share link
GET    /api/trips/shared/:token    - View shared trip
```

### Itinerary Endpoints

```
GET    /api/trips/:id/stops        - List trip stops
POST   /api/trips/:id/stops        - Add stop
PUT    /api/stops/:id              - Update stop
DELETE /api/stops/:id              - Delete stop
POST   /api/stops/:id/activities   - Add activity
DELETE /api/stop-activities/:id    - Remove activity
```

### Search Endpoints

```
GET    /api/cities?q=              - Search cities
GET    /api/activities?city=       - Search activities
```

For complete API documentation, see [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

## 🗄️ Database Design

### Core Tables

- **users**: User accounts and authentication
- **trips**: Travel plans
- **trip_stops**: Destinations within trips
- **activities**: Available activities
- **stop_activities**: Activities scheduled for stops
- **cities**: City reference data
- **countries**: Country reference data
- **trip_notes**: Trip journal entries
- **packing_items**: Packing checklists
- **user_sessions**: Active user sessions
- **security_logs**: Security event tracking

### Key Features

- **Foreign Key Constraints**: Maintain referential integrity
- **Check Constraints**: Validate data at database level
- **Triggers**: Auto-update timestamps and budgets
- **Views**: Optimized queries for common operations
- **Indexes**: Performance optimization for searches and joins

For detailed schema, see [DATABASE_DESIGN.md](docs/DATABASE_DESIGN.md)

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Tokens**: Secure authentication with expiration
- **Email Verification**: Confirm user email addresses
- **Rate Limiting**: Prevent brute force attacks
- **Input Validation**: Custom validators for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **Security Logging**: Track suspicious activities
- **Email Alerts**: Notify users of failed login attempts

## 📊 Performance Optimization

- **Database Connection Pooling**: Efficient resource usage
- **Query Optimization**: Indexed columns and optimized joins
- **Pagination**: Limit data transfer
- **Response Compression**: gzip compression
- **Code Splitting**: Lazy loading of routes
- **Memoization**: Cache expensive calculations

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Consistent Color Scheme**: Brand colors throughout
- **Intuitive Navigation**: Clear menu structure
- **Loading States**: User feedback during operations
- **Error Messages**: Clear, actionable error messages
- **Form Validation**: Real-time validation feedback
- **Accessibility**: WCAG compliance

## 📈 Scalability

### Current Architecture
- Monolithic application with clear separation of concerns
- PostgreSQL with connection pooling
- Stateless API design

### Future Enhancements
- Microservices architecture
- Redis caching layer
- CDN for static assets
- Horizontal scaling with load balancers
- Database read replicas
- Message queue for async operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Use semantic versioning

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead**: [Your Name]
- **Backend Developer**: [Your Name]
- **Frontend Developer**: [Your Name]
- **Database Designer**: [Your Name]

## 🙏 Acknowledgments

- PostgreSQL community for excellent documentation
- React team for the amazing framework
- Node.js community for robust ecosystem
- All open-source contributors

## 📞 Support

For support, email support@traveloop.com or join our Slack channel.

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ User authentication
- ✅ Trip CRUD operations
- ✅ Itinerary builder
- ✅ Budget tracking
- ✅ Public sharing

### Phase 2 (Q2 2024)
- [ ] Mobile application (React Native)
- [ ] Collaborative trip planning
- [ ] Weather integration
- [ ] Currency conversion
- [ ] Multi-language support

### Phase 3 (Q3 2024)
- [ ] AI-powered recommendations
- [ ] Integration with booking platforms
- [ ] Social features (follow, like, comment)
- [ ] Advanced analytics dashboard
- [ ] Offline mode

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x500/667eea/ffffff?text=Dashboard)

### Itinerary Builder
![Itinerary](https://via.placeholder.com/800x500/667eea/ffffff?text=Itinerary+Builder)

### Budget Breakdown
![Budget](https://via.placeholder.com/800x500/667eea/ffffff?text=Budget+Breakdown)

---

**Built with ❤️ by the Traveloop Team**

*Making travel planning as exciting as the journey itself*
