-- Traveloop Database Schema
-- PostgreSQL 15+
-- Created: 2024

-- Drop existing tables (for clean setup)
DROP TABLE IF EXISTS stop_activities CASCADE;
DROP TABLE IF EXISTS packing_items CASCADE;
DROP TABLE IF EXISTS trip_notes CASCADE;
DROP TABLE IF EXISTS saved_destinations CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS trip_stops CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS activity_categories CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS countries CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS security_logs CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    country VARCHAR(100),
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

-- Create user_sessions table
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

-- Create security_logs table
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

-- Create trips table
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
    total_budget DECIMAL(10, 2) DEFAULT 0,
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

-- Create countries table
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

-- Create cities table
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

-- Create activity_categories table
CREATE TABLE activity_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_categories_name ON activity_categories(category_name);

-- Create activities table
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

-- Create trip_stops table
CREATE TABLE trip_stops (
    stop_id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    city_id INTEGER NOT NULL REFERENCES cities(city_id),
    stop_order INTEGER NOT NULL,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    accommodation_name VARCHAR(200),
    accommodation_cost DECIMAL(10, 2) DEFAULT 0,
    transportation_cost DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_stop_dates CHECK (departure_date >= arrival_date),
    CONSTRAINT unique_trip_order UNIQUE(trip_id, stop_order)
);

CREATE INDEX idx_stops_trip ON trip_stops(trip_id, stop_order);
CREATE INDEX idx_stops_city ON trip_stops(city_id);
CREATE INDEX idx_stops_dates ON trip_stops(arrival_date, departure_date);

-- Create stop_activities table
CREATE TABLE stop_activities (
    stop_activity_id SERIAL PRIMARY KEY,
    stop_id INTEGER NOT NULL REFERENCES trip_stops(stop_id) ON DELETE CASCADE,
    activity_id INTEGER NOT NULL REFERENCES activities(activity_id),
    scheduled_date DATE,
    scheduled_time TIME,
    actual_cost DECIMAL(10, 2) DEFAULT 0,
    duration_minutes INTEGER,
    notes TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stop_activities_stop ON stop_activities(stop_id);
CREATE INDEX idx_stop_activities_activity ON stop_activities(activity_id);
CREATE INDEX idx_stop_activities_date ON stop_activities(scheduled_date);

-- Create trip_notes table
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

-- Create packing_items table
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

-- Create user_preferences table
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

-- Create saved_destinations table
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

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_stops_updated_at
    BEFORE UPDATE ON trip_stops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_notes_updated_at
    BEFORE UPDATE ON trip_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packing_items_updated_at
    BEFORE UPDATE ON packing_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate trip budget
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
        WHERE ts.trip_id = COALESCE(NEW.trip_id, OLD.trip_id)
    )
    WHERE trip_id = COALESCE(NEW.trip_id, OLD.trip_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trip_budget_on_stop
    AFTER INSERT OR UPDATE OR DELETE ON trip_stops
    FOR EACH ROW
    EXECUTE FUNCTION calculate_trip_budget();

CREATE TRIGGER update_trip_budget_on_activity
    AFTER INSERT OR UPDATE OR DELETE ON stop_activities
    FOR EACH ROW
    EXECUTE FUNCTION calculate_trip_budget();

-- Create function to increment city popularity
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

-- Create views
CREATE VIEW trip_summary AS
SELECT 
    t.trip_id,
    t.user_id,
    t.trip_name,
    t.start_date,
    t.end_date,
    t.total_budget,
    t.currency,
    t.is_public,
    t.created_at,
    COUNT(DISTINCT ts.stop_id) as stop_count,
    COUNT(DISTINCT sa.activity_id) as activity_count,
    ARRAY_AGG(c.city_name ORDER BY ts.stop_order) FILTER (WHERE c.city_name IS NOT NULL) as cities
FROM trips t
LEFT JOIN trip_stops ts ON t.trip_id = ts.trip_id
LEFT JOIN cities c ON ts.city_id = c.city_id
LEFT JOIN stop_activities sa ON ts.stop_id = sa.stop_id
GROUP BY t.trip_id;

CREATE VIEW popular_destinations AS
SELECT 
    c.city_id,
    c.city_name,
    co.country_name,
    c.popularity_score,
    COUNT(DISTINCT ts.trip_id) as trip_count,
    c.cost_index
FROM cities c
JOIN countries co ON c.country_id = co.country_id
LEFT JOIN trip_stops ts ON c.city_id = ts.city_id
GROUP BY c.city_id, c.city_name, co.country_name, c.popularity_score, c.cost_index
ORDER BY c.popularity_score DESC, trip_count DESC;

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO traveloop_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO traveloop_user;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Traveloop database schema created successfully!';
END $$;
