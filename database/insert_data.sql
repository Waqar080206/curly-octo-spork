

USE restaurant_db;


CREATE TEMPORARY TABLE temp_restaurants (
    name VARCHAR(255),
    category VARCHAR(500),
    pricing_for_2 INT,
    locality VARCHAR(255),
    dining_rating DECIMAL(3,2),
    dining_review_count INT,
    delivery_rating DECIMAL(3,2),
    delivery_rating_count INT,
    website VARCHAR(500),
    address TEXT,
    phone_no VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    known_for TEXT,
    ambience_features TEXT
);


INSERT INTO temp_restaurants VALUES
('Rustom\'s', 'Parsi, Street Food, North Indian, Desserts, Beverages', 2100, 'ITO, New Delhi', 4.9, 1885, 4.4, 1844, 'https://www.zomato.com/ncr/rustoms-ito-new-delhi', 'Delhi Parsi Anjuman, LNJP Colony, Bahadur Shah Zafar Road', '919991234567', 28.638167, 77.240472, 'Parsi Cuisine, Traditional Dishes', 'Heritage, Authentic'),
('Cafe Lota', 'Cafe, South Indian, North Indian, Beverages', 1200, 'Pragati Maidan, New Delhi', 4.9, 3748, 3.9, 37, 'https://www.zomato.com/ncr/cafe-lota-pragati-maidan-new-delhi', 'National Crafts Museum, Gate 2, Bhairon Marg', '917839123456', 28.613429, 77.242471, 'Pondicherry Fish Curry, Coconut Rabdi', 'Artistic Decor, Natural Ambience'),
('Dum-Pukht - ITC Maurya', 'Mughlai, North Indian, Desserts', 5000, 'ITC Maurya, Chanakyapuri, New Delhi', 4.9, 1371, NULL, 0, 'https://www.zomato.com/ncr/dum-pukht-itc-maurya-chanakyapuri-new-delhi', 'ITC Maurya, Chanakyapuri, New Delhi', '911146123456', 28.5982003, 77.17366073, 'Royal Mughlai Cuisine', 'Luxury, Heritage'),
('Burma Burma', 'Asian, Burmese, Bubble Tea, Desserts, Salad', 1600, 'Cyber Hub, DLF Cyber City, Gurgaon', 4.9, 2636, 4.4, 1238, 'https://www.zomato.com/ncr/burma-burma-dlf-cyber-city', 'Shop 6, Ground Floor, Building 8, Tower C', '911244123456', 28.49446439, 77.08853245, 'Coconut Milk Dessert, Samosa Curry', 'Authentic, Cozy'),
('The Big Chill', 'Continental, American, Italian', 1500, 'Khan Market, New Delhi', 4.9, 6487, NULL, 0, 'https://www.zomato.com/ncr/the-big-chill-khan-market-new-delhi', '68-A, Khan Market, New Delhi', '911142123456', 28.60035007, 77.22749334, 'Irish Cream Tiramisu, Mississippi Mudpie', 'Retro Ambience, Happy Place');

-- Populate Localities table
INSERT INTO Localities (locality_name, city, area_type)
SELECT DISTINCT 
    TRIM(SUBSTRING_INDEX(locality, ',', 1)) as locality_name,
    TRIM(SUBSTRING_INDEX(locality, ',', -1)) as city,
    CASE 
        WHEN locality LIKE '%Market%' OR locality LIKE '%Hub%' THEN 'Commercial'
        WHEN locality LIKE '%Colony%' OR locality LIKE '%Nagar%' THEN 'Residential'
        WHEN locality LIKE '%Central%' OR locality LIKE '%CP%' THEN 'Central'
        ELSE 'Suburban'
    END as area_type
FROM temp_restaurants
WHERE locality IS NOT NULL;

-- Populate Cuisines table
INSERT INTO Cuisines (cuisine_name)
SELECT DISTINCT TRIM(cuisine) as cuisine_name
FROM (
    SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(category, ',', numbers.n), ',', -1)) as cuisine
    FROM temp_restaurants
    CROSS JOIN (
        SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8
    ) numbers
    WHERE CHAR_LENGTH(category) - CHAR_LENGTH(REPLACE(category, ',', '')) >= numbers.n - 1
) as cuisines_split
WHERE cuisine != '' AND cuisine IS NOT NULL;

-- Insert restaurants with locality_id
INSERT INTO Restaurants (
    name, category, pricing_for_2, locality, dining_rating, 
    dining_review_count, delivery_rating, delivery_rating_count,
    website, address, phone_no, latitude, longitude, 
    known_for, ambience_features, locality_id
)
SELECT 
    t.name, t.category, t.pricing_for_2, t.locality, t.dining_rating,
    t.dining_review_count, t.delivery_rating, t.delivery_rating_count,
    t.website, t.address, t.phone_no, t.latitude, t.longitude,
    t.known_for, t.ambience_features, l.locality_id
FROM temp_restaurants t
LEFT JOIN Localities l ON TRIM(SUBSTRING_INDEX(t.locality, ',', 1)) = l.locality_name;

-- Populate Restaurant_Cuisines mapping
INSERT INTO Restaurant_Cuisines (restaurant_id, cuisine_id)
SELECT DISTINCT r.restaurant_id, c.cuisine_id
FROM Restaurants r
CROSS JOIN (
    SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8
) numbers
JOIN Cuisines c ON c.cuisine_name = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(r.category, ',', numbers.n), ',', -1))
WHERE CHAR_LENGTH(r.category) - CHAR_LENGTH(REPLACE(r.category, ',', '')) >= numbers.n - 1;

-- Clean up
DROP TEMPORARY TABLE temp_restaurants;