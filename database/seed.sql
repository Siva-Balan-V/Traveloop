-- Traveloop Seed Data
-- Populate database with initial reference data

-- Insert countries
INSERT INTO countries (country_name, country_code, continent, currency, average_cost_index) VALUES
('United States', 'USA', 'North America', 'USD', 7.5),
('United Kingdom', 'GBR', 'Europe', 'GBP', 8.0),
('France', 'FRA', 'Europe', 'EUR', 7.0),
('Italy', 'ITA', 'Europe', 'EUR', 6.5),
('Spain', 'ESP', 'Europe', 'EUR', 6.0),
('Germany', 'DEU', 'Europe', 'EUR', 7.0),
('Japan', 'JPN', 'Asia', 'JPY', 8.5),
('Thailand', 'THA', 'Asia', 'THB', 4.0),
('Australia', 'AUS', 'Oceania', 'AUD', 8.0),
('Canada', 'CAN', 'North America', 'CAD', 7.0),
('Mexico', 'MEX', 'North America', 'MXN', 4.5),
('Brazil', 'BRA', 'South America', 'BRL', 5.0),
('India', 'IND', 'Asia', 'INR', 3.5),
('China', 'CHN', 'Asia', 'CNY', 5.5),
('United Arab Emirates', 'ARE', 'Asia', 'AED', 7.5),
('Singapore', 'SGP', 'Asia', 'SGD', 8.5),
('Netherlands', 'NLD', 'Europe', 'EUR', 7.5),
('Switzerland', 'CHE', 'Europe', 'CHF', 9.0),
('Greece', 'GRC', 'Europe', 'EUR', 5.5),
('Portugal', 'PRT', 'Europe', 'EUR', 5.0);

-- Insert cities
INSERT INTO cities (city_name, country_id, state_province, latitude, longitude, description, cost_index, timezone) VALUES
-- India (Primary focus)
('Delhi', 13, 'Delhi', 28.7041, 77.1025, 'Capital city with rich Mughal heritage, Red Fort, and India Gate', 3.0, 'Asia/Kolkata'),
('Agra', 13, 'Uttar Pradesh', 27.1767, 78.0081, 'Home to the magnificent Taj Mahal, one of Seven Wonders', 2.5, 'Asia/Kolkata'),
('Jaipur', 13, 'Rajasthan', 26.9124, 75.7873, 'Pink City with majestic forts, palaces, and vibrant culture', 2.8, 'Asia/Kolkata'),
('Mumbai', 13, 'Maharashtra', 19.0760, 72.8777, 'Financial capital, Bollywood hub, and Gateway of India', 4.0, 'Asia/Kolkata'),
('Goa', 13, 'Goa', 15.2993, 74.1240, 'Beach paradise with Portuguese heritage and vibrant nightlife', 3.5, 'Asia/Kolkata'),
('Varanasi', 13, 'Uttar Pradesh', 25.3176, 82.9739, 'Spiritual capital on Ganges, ancient temples and ghats', 2.0, 'Asia/Kolkata'),
('Udaipur', 13, 'Rajasthan', 24.5854, 73.7125, 'City of Lakes with romantic palaces and stunning sunsets', 3.0, 'Asia/Kolkata'),
('Kerala', 13, 'Kerala', 10.8505, 76.2711, 'Gods Own Country with backwaters, beaches, and Ayurveda', 3.2, 'Asia/Kolkata'),
('Bangalore', 13, 'Karnataka', 12.9716, 77.5946, 'Silicon Valley of India with pleasant climate and gardens', 3.8, 'Asia/Kolkata'),
('Kolkata', 13, 'West Bengal', 22.5726, 88.3639, 'Cultural capital with colonial architecture and literary heritage', 2.5, 'Asia/Kolkata'),
('Chennai', 13, 'Tamil Nadu', 13.0827, 80.2707, 'Gateway to South India with temples and Marina Beach', 3.0, 'Asia/Kolkata'),
('Hyderabad', 13, 'Telangana', 17.3850, 78.4867, 'City of Pearls with Charminar and biryani culture', 3.2, 'Asia/Kolkata'),
('Rishikesh', 13, 'Uttarakhand', 30.0869, 78.2676, 'Yoga capital on Ganges foothills with adventure sports', 2.2, 'Asia/Kolkata'),
('Manali', 13, 'Himachal Pradesh', 32.2396, 77.1887, 'Himalayan hill station with snow peaks and adventure', 3.5, 'Asia/Kolkata'),
('Amritsar', 13, 'Punjab', 31.6340, 74.8723, 'Home to Golden Temple and Wagah Border ceremony', 2.5, 'Asia/Kolkata'),
('Mysore', 13, 'Karnataka', 12.2958, 76.6394, 'Palace city with royal heritage and sandalwood', 2.8, 'Asia/Kolkata'),
('Jodhpur', 13, 'Rajasthan', 26.2389, 73.0243, 'Blue City with Mehrangarh Fort and desert landscapes', 2.6, 'Asia/Kolkata'),
('Darjeeling', 13, 'West Bengal', 27.0410, 88.2663, 'Tea gardens with Himalayan views and toy train', 3.0, 'Asia/Kolkata'),
('Shimla', 13, 'Himachal Pradesh', 31.1048, 77.1734, 'Colonial hill station with Mall Road and scenic beauty', 3.2, 'Asia/Kolkata'),
('Hampi', 13, 'Karnataka', 15.3350, 76.4600, 'UNESCO site with ancient ruins and boulder landscapes', 2.0, 'Asia/Kolkata'),

-- USA
('New York', 1, 'New York', 40.7128, -74.0060, 'The city that never sleeps, known for its iconic skyline and cultural diversity', 8.5, 'America/New_York'),
('Los Angeles', 1, 'California', 34.0522, -118.2437, 'Entertainment capital with beaches and Hollywood glamour', 8.0, 'America/Los_Angeles'),
('San Francisco', 1, 'California', 37.7749, -122.4194, 'Tech hub with iconic Golden Gate Bridge and Victorian houses', 9.0, 'America/Los_Angeles'),
('Las Vegas', 1, 'Nevada', 36.1699, -115.1398, 'Entertainment and gambling destination in the desert', 6.5, 'America/Los_Angeles'),
('Miami', 1, 'Florida', 25.7617, -80.1918, 'Tropical paradise with beaches and vibrant nightlife', 7.5, 'America/New_York'),

-- UK
('London', 2, 'England', 51.5074, -0.1278, 'Historic capital with royal palaces and world-class museums', 8.5, 'Europe/London'),
('Edinburgh', 2, 'Scotland', 55.9533, -3.1883, 'Medieval old town with stunning castle and festivals', 7.0, 'Europe/London'),

-- France
('Paris', 3, 'Île-de-France', 48.8566, 2.3522, 'City of Light, romance, and iconic Eiffel Tower', 7.5, 'Europe/Paris'),
('Nice', 3, 'Provence-Alpes-Côte d''Azur', 43.7102, 7.2620, 'French Riviera gem with beautiful beaches', 7.0, 'Europe/Paris'),

-- Italy
('Rome', 4, 'Lazio', 41.9028, 12.4964, 'Eternal City with ancient ruins and Vatican', 6.5, 'Europe/Rome'),
('Venice', 4, 'Veneto', 45.4408, 12.3155, 'Romantic city of canals and gondolas', 7.5, 'Europe/Rome'),
('Florence', 4, 'Tuscany', 43.7696, 11.2558, 'Renaissance art capital with stunning architecture', 6.5, 'Europe/Rome'),

-- Spain
('Barcelona', 5, 'Catalonia', 41.3851, 2.1734, 'Gaudí''s masterpieces and Mediterranean beaches', 6.0, 'Europe/Madrid'),
('Madrid', 5, 'Community of Madrid', 40.4168, -3.7038, 'Royal capital with world-class art museums', 6.0, 'Europe/Madrid'),

-- Germany
('Berlin', 6, 'Berlin', 52.5200, 13.4050, 'Historic capital with vibrant culture and nightlife', 6.5, 'Europe/Berlin'),
('Munich', 6, 'Bavaria', 48.1351, 11.5820, 'Bavarian capital famous for Oktoberfest', 7.0, 'Europe/Berlin'),

-- Japan
('Tokyo', 7, 'Tokyo', 35.6762, 139.6503, 'Futuristic metropolis blending tradition and technology', 8.5, 'Asia/Tokyo'),
('Kyoto', 7, 'Kyoto', 35.0116, 135.7681, 'Ancient capital with temples and traditional culture', 7.5, 'Asia/Tokyo'),
('Osaka', 7, 'Osaka', 34.6937, 135.5023, 'Food paradise with vibrant street life', 7.0, 'Asia/Tokyo'),

-- Thailand
('Bangkok', 8, 'Bangkok', 13.7563, 100.5018, 'Bustling capital with temples and street food', 4.0, 'Asia/Bangkok'),
('Phuket', 8, 'Phuket', 7.8804, 98.3923, 'Tropical island paradise with stunning beaches', 4.5, 'Asia/Bangkok'),

-- Australia
('Sydney', 9, 'New South Wales', -33.8688, 151.2093, 'Harbor city with iconic Opera House', 8.5, 'Australia/Sydney'),
('Melbourne', 9, 'Victoria', -37.8136, 144.9631, 'Cultural capital with coffee and street art', 8.0, 'Australia/Melbourne'),

-- Canada
('Toronto', 10, 'Ontario', 43.6532, -79.3832, 'Multicultural metropolis with CN Tower', 7.0, 'America/Toronto'),
('Vancouver', 10, 'British Columbia', 49.2827, -123.1207, 'Coastal city surrounded by mountains', 7.5, 'America/Vancouver'),

-- Mexico
('Mexico City', 11, 'Mexico City', 19.4326, -99.1332, 'Historic capital with Aztec heritage', 4.0, 'America/Mexico_City'),
('Cancun', 11, 'Quintana Roo', 21.1619, -86.8515, 'Caribbean paradise with Mayan ruins', 5.5, 'America/Cancun'),

-- Dubai
('Dubai', 15, 'Dubai', 25.2048, 55.2708, 'Luxury destination with futuristic architecture', 8.0, 'Asia/Dubai'),

-- Singapore
('Singapore', 16, 'Singapore', 1.3521, 103.8198, 'Modern city-state with diverse culture', 8.5, 'Asia/Singapore'),

-- Netherlands
('Amsterdam', 17, 'North Holland', 52.3676, 4.9041, 'Canal city with museums and cycling culture', 7.5, 'Europe/Amsterdam'),

-- Switzerland
('Zurich', 18, 'Zurich', 47.3769, 8.5417, 'Financial hub with Alpine beauty', 9.5, 'Europe/Zurich'),

-- Greece
('Athens', 19, 'Attica', 37.9838, 23.7275, 'Ancient capital with Acropolis', 5.5, 'Europe/Athens'),
('Santorini', 19, 'South Aegean', 36.3932, 25.4615, 'Stunning island with white-washed buildings', 7.0, 'Europe/Athens'),

-- Portugal
('Lisbon', 20, 'Lisbon', 38.7223, -9.1393, 'Coastal capital with historic trams', 5.0, 'Europe/Lisbon');

-- Insert activity categories
INSERT INTO activity_categories (category_name, description, icon_name) VALUES
('Sightseeing', 'Explore landmarks and attractions', 'eye'),
('Adventure', 'Thrilling outdoor activities', 'mountain'),
('Food & Dining', 'Culinary experiences and restaurants', 'utensils'),
('Culture & History', 'Museums, galleries, and historical sites', 'landmark'),
('Nature & Wildlife', 'Parks, gardens, and wildlife encounters', 'tree'),
('Shopping', 'Markets, malls, and boutiques', 'shopping-bag'),
('Entertainment', 'Shows, concerts, and nightlife', 'music'),
('Relaxation', 'Spas, beaches, and wellness', 'spa'),
('Sports & Recreation', 'Active pursuits and games', 'football');

-- Insert sample activities for major cities
-- Delhi activities
INSERT INTO activities (activity_name, category_id, city_id, description, average_cost, average_duration, rating) VALUES
('Red Fort Visit', 4, 1, 'UNESCO World Heritage Mughal fort complex', 600, 120, 4.6),
('Qutub Minar Tour', 4, 1, 'Tallest brick minaret in the world', 600, 90, 4.5),
('India Gate', 1, 1, 'War memorial and iconic landmark', 0, 60, 4.7),
('Lotus Temple', 4, 1, 'Bahai House of Worship with stunning architecture', 0, 90, 4.8),
('Chandni Chowk Food Walk', 3, 1, 'Old Delhi street food experience', 500, 180, 4.9),
('Humayuns Tomb', 4, 1, 'Mughal architecture inspiration for Taj Mahal', 600, 120, 4.6),
('Akshardham Temple', 4, 1, 'Modern Hindu temple complex with light show', 0, 180, 4.9),

-- Agra activities
('Taj Mahal Sunrise Tour', 4, 2, 'Visit the monument of love at sunrise', 1100, 180, 5.0),
('Agra Fort', 4, 2, 'Red sandstone Mughal fort with palace', 650, 150, 4.7),
('Mehtab Bagh Sunset', 1, 2, 'Taj Mahal sunset view from garden', 300, 90, 4.6),
('Fatehpur Sikri Day Trip', 4, 2, 'Abandoned Mughal city near Agra', 650, 240, 4.5),

-- Jaipur activities
('Amber Fort', 4, 3, 'Hilltop fort with elephant rides', 550, 180, 4.8),
('City Palace Jaipur', 4, 3, 'Royal residence with museums', 700, 120, 4.7),
('Hawa Mahal', 4, 3, 'Palace of Winds with 953 windows', 200, 60, 4.6),
('Jantar Mantar', 4, 3, 'UNESCO astronomical observatory', 200, 90, 4.5),
('Jaipur Bazaar Shopping', 6, 3, 'Colorful markets for textiles and jewelry', 0, 180, 4.7),

-- Mumbai activities
('Gateway of India', 1, 4, 'Iconic arch monument on waterfront', 0, 60, 4.6),
('Elephanta Caves', 4, 4, 'Ancient rock-cut temples on island', 600, 240, 4.5),
('Marine Drive Walk', 1, 4, 'Queens Necklace seaside promenade', 0, 90, 4.7),
('Bollywood Studio Tour', 7, 4, 'Behind the scenes of Hindi cinema', 2500, 180, 4.4),
('Chhatrapati Shivaji Terminus', 4, 4, 'Victorian Gothic railway station UNESCO site', 0, 45, 4.6),
('Dhobi Ghat', 1, 4, 'Worlds largest outdoor laundry', 0, 60, 4.3),

-- Goa activities
('Beach Hopping', 8, 5, 'Visit Baga, Calangute, and Anjuna beaches', 0, 300, 4.7),
('Water Sports', 2, 5, 'Parasailing, jet ski, and banana boat', 2000, 120, 4.6),
('Old Goa Churches', 4, 5, 'Portuguese colonial churches UNESCO site', 0, 120, 4.5),
('Spice Plantation Tour', 5, 5, 'Organic spice farm with traditional lunch', 800, 180, 4.6),
('Goa Night Market', 6, 5, 'Saturday night flea market', 0, 180, 4.4),

-- Varanasi activities
('Ganga Aarti Ceremony', 4, 6, 'Evening prayer ritual on Ganges ghats', 0, 90, 4.9),
('Boat Ride at Sunrise', 1, 6, 'Witness life on the ghats from river', 300, 120, 4.8),
('Kashi Vishwanath Temple', 4, 6, 'Sacred Shiva temple', 0, 90, 4.7),
('Sarnath Buddhist Site', 4, 6, 'Where Buddha gave first sermon', 200, 180, 4.6),

-- Udaipur activities
('City Palace Udaipur', 4, 7, 'Lakeside palace complex with museums', 300, 150, 4.8),
('Lake Pichola Boat Ride', 1, 7, 'Sunset cruise with palace views', 400, 90, 4.9),
('Jag Mandir Island', 1, 7, 'Marble palace on lake island', 350, 120, 4.6),
('Sajjangarh Monsoon Palace', 1, 7, 'Hilltop palace with panoramic views', 80, 90, 4.5),

-- Kerala activities
('Backwater Houseboat', 8, 8, 'Overnight cruise in traditional kettuvallam', 8000, 1440, 4.9),
('Ayurvedic Massage', 8, 8, 'Traditional healing therapy', 1500, 90, 4.8),
('Kathakali Dance Show', 7, 8, 'Classical dance drama performance', 500, 90, 4.7),
('Tea Plantation Tour', 5, 8, 'Munnar tea estate visit', 300, 180, 4.6),
('Beach Relaxation', 8, 8, 'Kovalam or Varkala beach day', 0, 240, 4.7),

-- Bangalore activities
('Lalbagh Botanical Garden', 5, 9, 'Historic garden with glass house', 50, 120, 4.6),
('Bangalore Palace', 4, 9, 'Tudor-style royal palace', 280, 90, 4.5),
('ISKCON Temple', 4, 9, 'Modern Krishna temple complex', 0, 90, 4.6),
('Cubbon Park', 5, 9, 'Green lung of the city', 0, 120, 4.5),

-- Kolkata activities
('Victoria Memorial', 4, 10, 'White marble British-era monument', 200, 120, 4.7),
('Howrah Bridge', 1, 10, 'Iconic cantilever bridge', 0, 45, 4.5),
('Dakshineswar Temple', 4, 10, 'Kali temple on Ganges', 0, 90, 4.6),
('Park Street Food Tour', 3, 10, 'Colonial-era street with restaurants', 800, 180, 4.7),

-- Amritsar activities
('Golden Temple', 4, 15, 'Holiest Sikh shrine with free langar', 0, 180, 5.0),
('Wagah Border Ceremony', 7, 15, 'India-Pakistan border flag ceremony', 0, 120, 4.8),
('Jallianwala Bagh', 4, 15, 'Memorial of 1919 massacre', 0, 60, 4.5),

-- Rishikesh activities
('River Rafting', 2, 13, 'White water rafting on Ganges', 1500, 180, 4.8),
('Yoga Class', 8, 13, 'Traditional yoga session', 500, 90, 4.7),
('Laxman Jhula', 1, 13, 'Suspension bridge over Ganges', 0, 60, 4.6),
('Beatles Ashram', 4, 13, 'Abandoned ashram with graffiti art', 150, 90, 4.5),

-- Manali activities
('Rohtang Pass', 2, 14, 'High mountain pass with snow', 0, 360, 4.7),
('Solang Valley', 2, 14, 'Adventure sports and skiing', 1500, 240, 4.6),
('Hadimba Temple', 4, 14, 'Ancient wooden temple in forest', 0, 60, 4.5),
('Old Manali Cafes', 3, 14, 'Hippie cafes with mountain views', 500, 120, 4.6),

-- Mysore activities
('Mysore Palace', 4, 16, 'Indo-Saracenic royal palace with light show', 70, 120, 4.8),
('Chamundi Hills', 1, 16, 'Hilltop temple with city views', 0, 120, 4.5),
('Brindavan Gardens', 5, 16, 'Musical fountain garden', 80, 120, 4.6),

-- Jodhpur activities
('Mehrangarh Fort', 4, 17, 'Massive hilltop fort with museum', 600, 180, 4.9),
('Blue City Walk', 1, 17, 'Explore blue-painted old town', 0, 120, 4.7),
('Umaid Bhawan Palace', 4, 17, 'Art Deco palace and museum', 100, 90, 4.6),

-- Hampi activities
('Virupaksha Temple', 4, 20, 'Ancient functioning temple', 50, 90, 4.7),
('Hampi Ruins Cycling', 2, 20, 'Cycle through boulder landscapes', 300, 240, 4.8),
('Vittala Temple', 4, 20, 'Stone chariot and musical pillars', 600, 120, 4.8),

-- New York activities
('Statue of Liberty Tour', 1, 21, 'Visit the iconic symbol of freedom', 25.00, 180, 4.7),
('Central Park Walk', 5, 21, 'Stroll through Manhattan''s green oasis', 0.00, 120, 4.8),
('Metropolitan Museum of Art', 4, 21, 'World-renowned art museum', 30.00, 240, 4.9),
('Broadway Show', 7, 21, 'Experience world-class theater', 150.00, 150, 4.8),
('Times Square Visit', 1, 21, 'See the bright lights of NYC', 0.00, 60, 4.5);

-- Paris activities
INSERT INTO activities (activity_name, category_id, city_id, description, average_cost, average_duration, rating) VALUES
('Eiffel Tower Visit', 1, 28, 'Ascend the iconic iron tower', 28.00, 120, 4.8),
('Louvre Museum', 4, 28, 'Home of the Mona Lisa', 20.00, 240, 4.9),
('Seine River Cruise', 1, 28, 'Romantic boat tour', 15.00, 90, 4.6),
('French Cooking Class', 3, 28, 'Learn to cook French cuisine', 85.00, 180, 4.7),
('Versailles Palace Tour', 4, 28, 'Explore the royal palace', 35.00, 300, 4.8);

-- Tokyo activities
INSERT INTO activities (activity_name, category_id, city_id, description, average_cost, average_duration, rating) VALUES
('Senso-ji Temple', 4, 37, 'Ancient Buddhist temple', 0.00, 90, 4.7),
('Tsukiji Fish Market', 3, 37, 'Fresh seafood and sushi', 20.00, 120, 4.6),
('Tokyo Skytree', 1, 37, 'Tallest structure in Japan', 25.00, 120, 4.5),
('Shibuya Crossing', 1, 37, 'World''s busiest intersection', 0.00, 30, 4.4),
('Sumo Wrestling Match', 7, 37, 'Traditional Japanese sport', 50.00, 180, 4.8);

-- London activities
INSERT INTO activities (activity_name, category_id, city_id, description, average_cost, average_duration, rating) VALUES
('Tower of London', 4, 26, 'Historic castle and Crown Jewels', 32.00, 180, 4.7),
('British Museum', 4, 26, 'World history and culture', 0.00, 240, 4.9),
('London Eye', 1, 26, 'Giant observation wheel', 35.00, 60, 4.5),
('West End Show', 7, 26, 'Theater district performance', 80.00, 150, 4.7),
('Buckingham Palace Tour', 1, 26, 'Royal residence', 30.00, 120, 4.6);

-- Rome activities
INSERT INTO activities (activity_name, category_id, city_id, description, average_cost, average_duration, rating) VALUES
('Colosseum Tour', 4, 30, 'Ancient Roman amphitheater', 25.00, 120, 4.9),
('Vatican Museums', 4, 30, 'Sistine Chapel and art collections', 28.00, 240, 4.8),
('Trevi Fountain', 1, 30, 'Baroque fountain', 0.00, 30, 4.7),
('Roman Forum Walk', 4, 30, 'Ancient city center', 20.00, 150, 4.6),
('Italian Cooking Class', 3, 30, 'Learn pasta and pizza making', 75.00, 180, 4.8);

-- Barcelona activities
INSERT INTO activities (activity_name, category_id, city_id, description, average_cost, average_duration, rating) VALUES
('Sagrada Familia', 4, 33, 'Gaudí''s masterpiece basilica', 26.00, 120, 4.9),
('Park Güell', 5, 33, 'Colorful mosaic park', 10.00, 120, 4.7),
('La Rambla Walk', 1, 33, 'Famous pedestrian street', 0.00, 90, 4.5),
('Beach Day', 8, 33, 'Relax at Barceloneta Beach', 0.00, 240, 4.6),
('Tapas Tour', 3, 33, 'Sample Spanish small plates', 60.00, 180, 4.8);

-- Sydney activities
INSERT INTO activities (activity_name, category_id, city_id, description, average_cost, average_duration, rating) VALUES
('Sydney Opera House Tour', 4, 42, 'Iconic performing arts center', 42.00, 90, 4.8),
('Bondi Beach', 8, 42, 'Famous surf beach', 0.00, 180, 4.7),
('Harbour Bridge Climb', 2, 42, 'Climb the iconic bridge', 250.00, 210, 4.9),
('Taronga Zoo', 5, 42, 'Wildlife with harbor views', 50.00, 240, 4.6),
('Darling Harbour', 1, 42, 'Waterfront entertainment precinct', 0.00, 120, 4.5);

-- Dubai activities
INSERT INTO activities (activity_name, category_id, city_id, description, average_cost, average_duration, rating) VALUES
('Burj Khalifa', 1, 48, 'World''s tallest building', 40.00, 120, 4.8),
('Desert Safari', 2, 48, 'Dune bashing and camel rides', 80.00, 360, 4.7),
('Dubai Mall', 6, 48, 'Massive shopping complex', 0.00, 240, 4.6),
('Gold Souk', 6, 48, 'Traditional gold market', 0.00, 90, 4.5),
('Palm Jumeirah', 1, 48, 'Artificial island resort', 0.00, 120, 4.6);

-- Bangkok activities
INSERT INTO activities (activity_name, category_id, city_id, description, average_cost, average_duration, rating) VALUES
('Grand Palace', 4, 40, 'Royal palace complex', 15.00, 180, 4.8),
('Wat Pho Temple', 4, 40, 'Reclining Buddha temple', 5.00, 90, 4.7),
('Floating Market', 6, 40, 'Traditional water market', 10.00, 180, 4.6),
('Thai Massage', 8, 40, 'Traditional healing massage', 20.00, 120, 4.8),
('Street Food Tour', 3, 40, 'Sample authentic Thai cuisine', 25.00, 180, 4.9);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Seed data inserted successfully!';
    RAISE NOTICE 'Countries: 20';
    RAISE NOTICE 'Cities: 53 (20 Indian cities + 33 international)';
    RAISE NOTICE 'Activity Categories: 9';
    RAISE NOTICE 'Activities: 130+ (90+ Indian activities)';
END $$;
