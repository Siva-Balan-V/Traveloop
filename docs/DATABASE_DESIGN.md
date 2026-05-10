# Traveloop - Database Design Document

## Overview
This document provides a comprehensive database design for the Traveloop travel planning platform using PostgreSQL. The design emphasizes data integrity, performance, and scalability.

## Database Schema

### 1. users
Stores user account information and authentication data.

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_photo_url VARCHAR(500),
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    language_preference VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;
```

**Columns:**
- `user_id`: Primary key, auto-incrementing
- `email`: Unique email address with format validation
- `password_hash`: Bcrypt hashed password
- `first_name`, `last_name`: User's full name
- `profile_photo_url`: Optional profile picture URL
- `is_email_verified`: Email verification status
- `email_verification_token`: Token for email verification
- `password_reset_token`: Token for password reset
- `password_reset_expires`: Expiration time for reset token
- `language_preference`: User's preferred language
- `created_at`, `updated_at`: Audit timestamps
- `last_login_at`: Last successful login
- `is_active`: Soft delete flag

### 2. user_sessions
Tracks active user sessions for security and session management.

```sql
CREATE TABLE user_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info VARCHAR(500),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_sessions_active ON user_sessions(is_active, expires_at);
```

### 3. security_logs
Logs security-related events for monitoring and auditing.

```sql
CREATE TABLE security_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    event_description TEXT,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_security_logs_user ON security_logs(user_id);
CREATE INDEX idx_security_logs_type ON security_logs(event_type);
CREATE INDEX idx_security_logs_created ON security_logs(created_at DESC);
```

**Event Types:**
- LOGIN_SUCCESS
- LOGIN_FAILED
- LOGOUT
- PASSWORD_RESET_REQUEST
- PASSWORD_RESET_SUCCESS
- EMAIL_VERIFICATION
- ACCOUNT_DELETED
- SUSPICIOUS_ACTIVITY

### 4. trips
Central table for travel plans.

```sql
CREATE TABLE trips (
    trip_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    trip_name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cover_photo_url VARCHAR(500),
    is_public BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(100) UNIQUE,
    total_budget DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    CONSTRAINT valid_budget CHECK (total_budget >= 0)
);

CREATE INDEX idx_trips_user ON trips(user_id, created_at DESC);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX idx_trips_public ON trips(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_trips_share_token ON trips(share_token) WHERE share_token IS NOT NULL;
```

**Columns:**
- `trip_id`: Primary key
- `user_id`: Foreign key to users
- `trip_name`: Name of the trip
- `description`: Optional trip description
- `start_date`, `end_date`: Trip duration
- `cover_photo_url`: Optional cover image
- `is_public`: Public sharing flag
- `share_token`: Unique token for public sharing
- `total_budget`: Estimated total budget
- `currency`: Currency code (ISO 4217)

### 5. countries
Reference table for countries.

```sql
CREATE TABLE countries (
    country_id SERIAL PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL UNIQUE,
    country_code VARCHAR(3) NOT NULL UNIQUE,
    continent VARCHAR(50),
    currency VARCHAR(3),
    average_cost_index DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_countries_name ON countries(country_name);
CREATE INDEX idx_countries_code ON countries(country_code);
```

### 6. cities
Reference table for cities/destinations.

```sql
CREATE TABLE cities (
    city_id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    country_id INTEGER NOT NULL REFERENCES countries(country_id),
    state_province VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    image_url VARCHAR(500),
    cost_index DECIMAL(5, 2),
    popularity_score INTEGER DEFAULT 0,
    timezone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_city_country UNIQUE(city_name, country_id)
);

CREATE INDEX idx_cities_name ON cities(city_name);
CREATE INDEX idx_cities_country ON cities(country_id);
CREATE INDEX idx_cities_popularity ON cities(popularity_score DESC);
CREATE INDEX idx_cities_search ON cities USING gin(to_tsvector('english', city_name || ' ' || COALESCE(description, '')));
```

**Columns:**
- `city_id`: Primary key
- `city_name`: Name of the city
- `country_id`: Foreign key to countries
- `state_province`: State or province name
- `latitude`, `longitude`: Geographic coordinates
- `description`: City description
- `image_url`: City image
- `cost_index`: Relative cost (1-10 scale)
- `popularity_score`: Popularity metric
- `timezone`: IANA timezone identifier

### 7. trip_stops
Represents destinations within a trip.

```sql
CREATE TABLE trip_stops (
    stop_id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    city_id INTEGER NOT NULL REFERENCES cities(city_id),
    stop_order INTEGER NOT NULL,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    accommodation_name VARCHAR(200),
    accommodation_cost DECIMAL(10, 2),
    transportation_cost DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_stop_dates CHECK (departure_date >= arrival_date),
    CONSTRAINT unique_trip_order UNIQUE(trip_id, stop_order)
);

CREATE INDEX idx_stops_trip ON trip_stops(trip_id, stop_order);
CREATE INDEX idx_stops_city ON trip_stops(city_id);
CREATE INDEX idx_stops_dates ON trip_stops(arrival_date, departure_date);
```

**Columns:**
- `stop_id`: Primary key
- `trip_id`: Foreign key to trips
- `city_id`: Foreign key to cities
- `stop_order`: Sequence order in trip
- `arrival_date`, `departure_date`: Stay duration
- `accommodation_name`: Hotel/lodging name
- `accommodation_cost`: Lodging cost
- `transportation_cost`: Travel cost to this stop
- `notes`: Additional notes

### 8. activity_categories
Categories for activities.

```sql
CREATE TABLE activity_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_categories_name ON activity_categories(category_name);
```

**Common Categories:**
- Sightseeing
- Adventure
- Food & Dining
- Culture & History
- Nature & Wildlife
- Shopping
- Entertainment
- Relaxation
- Sports & Recreation

### 9. activities
Master table of available activities.

```sql
CREATE TABLE activities (
    activity_id SERIAL PRIMARY KEY,
    activity_name VARCHAR(200) NOT NULL,
    category_id INTEGER REFERENCES activity_categories(category_id),
    city_id INTEGER REFERENCES cities(city_id),
    description TEXT,
    average_cost DECIMAL(10, 2),
    average_duration INTEGER,
    image_url VARCHAR(500),
    address TEXT,
    website_url VARCHAR(500),
    rating DECIMAL(3, 2),
    popularity_score INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5),
    CONSTRAINT valid_duration CHECK (average_duration > 0)
);

CREATE INDEX idx_activities_city ON activities(city_id);
CREATE INDEX idx_activities_category ON activities(category_id);
CREATE INDEX idx_activities_popularity ON activities(popularity_score DESC);
CREATE INDEX idx_activities_search ON activities USING gin(to_tsvector('english', activity_name || ' ' || COALESCE(description, '')));
```

**Columns:**
- `activity_id`: Primary key
- `activity_name`: Name of the activity
- `category_id`: Foreign key to activity_categories
- `city_id`: Foreign key to cities
- `description`: Activity description
- `average_cost`: Typical cost
- `average_duration`: Duration in minutes
- `image_url`: Activity image
- `address`: Physical address
- `website_url`: Official website
- `rating`: Average rating (0-5)
- `popularity_score`: Popularity metric

### 10. stop_activities
Junction table linking stops to activities.

```sql
CREATE TABLE stop_activities (
    stop_activity_id SERIAL PRIMARY KEY,
    stop_id INTEGER NOT NULL REFERENCES trip_stops(stop_id) ON DELETE CASCADE,
    activity_id INTEGER NOT NULL REFERENCES activities(activity_id),
    scheduled_date DATE,
    scheduled_time TIME,
    actual_cost DECIMAL(10, 2),
    duration_minutes INTEGER,
    notes TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_stop_activity UNIQUE(stop_id, activity_id, scheduled_date, scheduled_time)
);

CREATE INDEX idx_stop_activities_stop ON stop_activities(stop_id);
CREATE INDEX idx_stop_activities_activity ON stop_activities(activity_id);
CREATE INDEX idx_stop_activities_date ON stop_activities(scheduled_date);
```

### 11. trip_notes
Notes and reminders for trips.

```sql
CREATE TABLE trip_notes (
    note_id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    stop_id INTEGER REFERENCES trip_stops(stop_id) ON DELETE CASCADE,
    note_title VARCHAR(200),
    note_content TEXT NOT NULL,
    note_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trip_notes_trip ON trip_notes(trip_id, created_at DESC);
CREATE INDEX idx_trip_notes_stop ON trip_notes(stop_id);
CREATE INDEX idx_trip_notes_date ON trip_notes(note_date);
```

**Columns:**
- `note_id`: Primary key
- `trip_id`: Foreign key to trips
- `stop_id`: Optional foreign key to specific stop
- `note_title`: Optional note title
- `note_content`: Note text
- `note_date`: Date associated with note

### 12. packing_items
Packing checklist for trips.

```sql
CREATE TABLE packing_items (
    item_id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    item_name VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    quantity INTEGER DEFAULT 1,
    is_packed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_quantity CHECK (quantity > 0)
);

CREATE INDEX idx_packing_items_trip ON packing_items(trip_id);
CREATE INDEX idx_packing_items_category ON packing_items(category);
```

**Common Categories:**
- Clothing
- Documents
- Electronics
- Toiletries
- Medications
- Accessories
- Entertainment
- Miscellaneous

### 13. user_preferences
Stores user preferences and settings.

```sql
CREATE TABLE user_preferences (
    preference_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    default_currency VARCHAR(3) DEFAULT 'USD',
    date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
    time_format VARCHAR(10) DEFAULT '12h',
    theme VARCHAR(20) DEFAULT 'light',
    email_notifications BOOLEAN DEFAULT TRUE,
    trip_reminders BOOLEAN DEFAULT TRUE,
    public_profile BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_preference UNIQUE(user_id)
);

CREATE INDEX idx_user_preferences_user ON user_preferences(user_id);
```

### 14. saved_destinations
User's saved/favorite destinations.

```sql
CREATE TABLE saved_destinations (
    saved_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    city_id INTEGER NOT NULL REFERENCES cities(city_id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_saved_destination UNIQUE(user_id, city_id)
);

CREATE INDEX idx_saved_destinations_user ON saved_destinations(user_id);
CREATE INDEX idx_saved_destinations_city ON saved_destinations(city_id);
```

## Database Relationships

### One-to-Many Relationships
1. **users → trips**: One user can have multiple trips
2. **users → user_sessions**: One user can have multiple active sessions
3. **users → security_logs**: One user can have multiple security events
4. **trips → trip_stops**: One trip can have multiple stops
5. **trips → trip_notes**: One trip can have multiple notes
6. **trips → packing_items**: One trip can have multiple packing items
7. **countries → cities**: One country can have multiple cities
8. **cities → trip_stops**: One city can be visited in multiple trips
9. **cities → activities**: One city can have multiple activities
10. **trip_stops → stop_activities**: One stop can have multiple activities
11. **activity_categories → activities**: One category can have multiple activities

### Many-to-Many Relationships
1. **trip_stops ↔ activities** (through stop_activities)
   - A stop can have multiple activities
   - An activity can be part of multiple stops

## Indexes Strategy

### Primary Indexes
- All primary keys have automatic indexes
- Foreign keys have explicit indexes for join performance

### Search Indexes
- Full-text search on cities (name + description)
- Full-text search on activities (name + description)
- Email lookup on users table

### Performance Indexes
- Composite index on (user_id, created_at) for trip listing
- Composite index on (trip_id, stop_order) for itinerary display
- Partial indexes on active/public records

### Query Optimization
```sql
-- Example: Get user's trips with stop count
EXPLAIN ANALYZE
SELECT 
    t.trip_id,
    t.trip_name,
    t.start_date,
    t.end_date,
    COUNT(ts.stop_id) as stop_count
FROM trips t
LEFT JOIN trip_stops ts ON t.trip_id = ts.trip_id
WHERE t.user_id = $1
GROUP BY t.trip_id
ORDER BY t.created_at DESC
LIMIT 20;
```

## Data Integrity Constraints

### Foreign Key Constraints
- **CASCADE**: Delete related records (sessions, stops, activities)
- **SET NULL**: Preserve logs when user is deleted
- **RESTRICT**: Prevent deletion if dependencies exist

### Check Constraints
- Date validation (end_date >= start_date)
- Budget validation (total_budget >= 0)
- Rating validation (0 <= rating <= 5)
- Email format validation

### Unique Constraints
- Email uniqueness
- Trip share token uniqueness
- City-country combination uniqueness
- Stop order within trip uniqueness

## Triggers and Functions

### 1. Update Timestamp Trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 2. Calculate Trip Budget Trigger
```sql
CREATE OR REPLACE FUNCTION calculate_trip_budget()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE trips
    SET total_budget = (
        SELECT COALESCE(SUM(
            COALESCE(ts.accommodation_cost, 0) + 
            COALESCE(ts.transportation_cost, 0) +
            (SELECT COALESCE(SUM(sa.actual_cost), 0)
             FROM stop_activities sa
             WHERE sa.stop_id = ts.stop_id)
        ), 0)
        FROM trip_stops ts
        WHERE ts.trip_id = NEW.trip_id
    )
    WHERE trip_id = NEW.trip_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trip_budget_on_stop
    AFTER INSERT OR UPDATE OR DELETE ON trip_stops
    FOR EACH ROW
    EXECUTE FUNCTION calculate_trip_budget();
```

### 3. Increment Popularity Score
```sql
CREATE OR REPLACE FUNCTION increment_city_popularity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE cities
    SET popularity_score = popularity_score + 1
    WHERE city_id = NEW.city_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_city_popularity_trigger
    AFTER INSERT ON trip_stops
    FOR EACH ROW
    EXECUTE FUNCTION increment_city_popularity();
```

## Views

### 1. Trip Summary View
```sql
CREATE VIEW trip_summary AS
SELECT 
    t.trip_id,
    t.user_id,
    t.trip_name,
    t.start_date,
    t.end_date,
    t.total_budget,
    t.is_public,
    COUNT(DISTINCT ts.stop_id) as stop_count,
    COUNT(DISTINCT sa.activity_id) as activity_count,
    ARRAY_AGG(DISTINCT c.city_name ORDER BY ts.stop_order) as cities
FROM trips t
LEFT JOIN trip_stops ts ON t.trip_id = ts.trip_id
LEFT JOIN cities c ON ts.city_id = c.city_id
LEFT JOIN stop_activities sa ON ts.stop_id = sa.stop_id
GROUP BY t.trip_id;
```

### 2. Popular Destinations View
```sql
CREATE VIEW popular_destinations AS
SELECT 
    c.city_id,
    c.city_name,
    co.country_name,
    c.popularity_score,
    COUNT(DISTINCT ts.trip_id) as trip_count,
    AVG(c.cost_index) as avg_cost
FROM cities c
JOIN countries co ON c.country_id = co.country_id
LEFT JOIN trip_stops ts ON c.city_id = ts.city_id
GROUP BY c.city_id, c.city_name, co.country_name, c.popularity_score
ORDER BY c.popularity_score DESC, trip_count DESC;
```

## Backup and Maintenance

### Backup Strategy
```bash
# Daily full backup
pg_dump -U postgres -d traveloop -F c -f backup_$(date +%Y%m%d).dump

# Weekly backup with compression
pg_dump -U postgres -d traveloop -F c -Z 9 -f weekly_backup_$(date +%Y%m%d).dump
```

### Maintenance Tasks
```sql
-- Vacuum and analyze
VACUUM ANALYZE;

-- Reindex
REINDEX DATABASE traveloop;

-- Update statistics
ANALYZE;

-- Clean old sessions
DELETE FROM user_sessions 
WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '30 days';

-- Clean old security logs
DELETE FROM security_logs 
WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '90 days';
```

## Performance Monitoring

### Query Performance
```sql
-- Enable query logging
ALTER DATABASE traveloop SET log_statement = 'all';
ALTER DATABASE traveloop SET log_duration = on;
ALTER DATABASE traveloop SET log_min_duration_statement = 100;

-- Check slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Index Usage
```sql
-- Check unused indexes
SELECT schemaname, tablename, indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- Check index size
SELECT indexname, pg_size_pretty(pg_relation_size(indexname::regclass))
FROM pg_indexes
WHERE schemaname = 'public';
```

## Scalability Considerations

### Partitioning Strategy
For large datasets, consider partitioning:
- **trips**: Partition by created_at (yearly)
- **security_logs**: Partition by created_at (monthly)
- **user_sessions**: Partition by created_at (monthly)

### Read Replicas
- Configure streaming replication for read-heavy operations
- Route read queries to replicas
- Keep write operations on primary

### Connection Pooling
```javascript
// Example pool configuration
const pool = new Pool({
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});
```

## Security Measures

### Row-Level Security
```sql
-- Enable RLS on trips table
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own trips
CREATE POLICY user_trips_policy ON trips
    FOR ALL
    USING (user_id = current_setting('app.user_id')::INTEGER);

-- Policy: Public trips are visible to all
CREATE POLICY public_trips_policy ON trips
    FOR SELECT
    USING (is_public = TRUE);
```

### Encryption
- Use SSL/TLS for database connections
- Encrypt sensitive data at rest
- Hash passwords with bcrypt

### Audit Logging
- Log all DDL changes
- Track data modifications
- Monitor access patterns

## Conclusion

This database design provides a robust foundation for the Traveloop platform, emphasizing:
- **Data Integrity**: Comprehensive constraints and foreign keys
- **Performance**: Strategic indexing and query optimization
- **Scalability**: Partitioning and replication strategies
- **Security**: Row-level security and encryption
- **Maintainability**: Clear structure and documentation

The schema supports all required features while maintaining flexibility for future enhancements.
