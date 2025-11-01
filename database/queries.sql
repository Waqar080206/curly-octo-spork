-- DBMS Project: Analytics Queries for Zomato Delhi NCR Dashboard
-- Complex SQL queries for restaurant data analysis

USE restaurant_db;

-- ==========================================
-- 1. LOCALITY ANALYSIS
-- ==========================================

-- Average rating by locality with restaurant count
SELECT 
    l.locality_name,
    l.city,
    l.area_type,
    COUNT(r.restaurant_id) as restaurant_count,
    ROUND(AVG(r.dining_rating), 2) as avg_dining_rating,
    ROUND(AVG(r.delivery_rating), 2) as avg_delivery_rating,
    ROUND(AVG(r.pricing_for_2), 0) as avg_cost_for_two
FROM Localities l
JOIN Restaurants r ON l.locality_id = r.locality_id
WHERE r.dining_rating IS NOT NULL
GROUP BY l.locality_id, l.locality_name, l.city, l.area_type
HAVING restaurant_count >= 3
ORDER BY avg_dining_rating DESC, restaurant_count DESC
LIMIT 15;

-- ==========================================
-- 2. CUISINE ANALYSIS
-- ==========================================

-- Top cuisines with performance metrics
SELECT 
    c.cuisine_name,
    COUNT(DISTINCT r.restaurant_id) as restaurant_count,
    ROUND(AVG(r.dining_rating), 2) as avg_rating,
    ROUND(AVG(r.pricing_for_2), 0) as avg_cost,
    SUM(r.dining_review_count) as total_reviews,
    ROUND(COUNT(DISTINCT r.restaurant_id) * 100.0 / (SELECT COUNT(*) FROM Restaurants), 2) as market_share_percent
FROM Cuisines c
JOIN Restaurant_Cuisines rc ON c.cuisine_id = rc.cuisine_id
JOIN Restaurants r ON rc.restaurant_id = r.restaurant_id
WHERE r.dining_rating IS NOT NULL
GROUP BY c.cuisine_id, c.cuisine_name
HAVING restaurant_count >= 5
ORDER BY restaurant_count DESC, avg_rating DESC
LIMIT 20;

-- ==========================================
-- 3. PRICING ANALYSIS
-- ==========================================

-- Cost vs rating analysis with price bands
SELECT 
    CASE 
        WHEN pricing_for_2 < 500 THEN 'Budget (< ₹500)'
        WHEN pricing_for_2 BETWEEN 500 AND 1000 THEN 'Mid-Range (₹500-1000)'
        WHEN pricing_for_2 BETWEEN 1000 AND 2000 THEN 'Premium (₹1000-2000)'
        WHEN pricing_for_2 BETWEEN 2000 AND 3000 THEN 'Luxury (₹2000-3000)'
        ELSE 'Ultra-Luxury (> ₹3000)'
    END as price_segment,
    COUNT(*) as restaurant_count,
    ROUND(AVG(dining_rating), 2) as avg_rating,
    ROUND(MIN(pricing_for_2), 0) as min_cost,
    ROUND(MAX(pricing_for_2), 0) as max_cost,
    ROUND(AVG(pricing_for_2), 0) as avg_cost
FROM Restaurants 
WHERE pricing_for_2 IS NOT NULL AND dining_rating IS NOT NULL
GROUP BY price_segment
ORDER BY avg_cost;

-- ==========================================
-- 4. RATING DISTRIBUTION ANALYSIS
-- ==========================================

-- Rating bands with detailed metrics
SELECT 
    CASE 
        WHEN dining_rating < 2.0 THEN 'Poor (< 2.0)'
        WHEN dining_rating BETWEEN 2.0 AND 2.9 THEN 'Below Average (2.0-2.9)'
        WHEN dining_rating BETWEEN 3.0 AND 3.9 THEN 'Average (3.0-3.9)'
        WHEN dining_rating BETWEEN 4.0 AND 4.4 THEN 'Good (4.0-4.4)'
        WHEN dining_rating BETWEEN 4.5 AND 4.7 THEN 'Excellent (4.5-4.7)'
        ELSE 'Outstanding (4.8+)'
    END as rating_category,
    COUNT(*) as restaurant_count,
    ROUND(AVG(dining_review_count), 0) as avg_reviews,
    ROUND(AVG(pricing_for_2), 0) as avg_cost,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Restaurants WHERE dining_rating IS NOT NULL), 2) as percentage
FROM Restaurants 
WHERE dining_rating IS NOT NULL
GROUP BY rating_category
ORDER BY MIN(dining_rating);

-- ==========================================
-- 5. CITY-WISE PERFORMANCE
-- ==========================================

-- City comparison with comprehensive metrics
SELECT 
    l.city,
    COUNT(DISTINCT r.restaurant_id) as total_restaurants,
    COUNT(DISTINCT l.locality_id) as localities_covered,
    ROUND(AVG(r.dining_rating), 2) as avg_rating,
    ROUND(AVG(r.pricing_for_2), 0) as avg_cost,
    SUM(r.dining_review_count) as total_reviews,
    COUNT(CASE WHEN r.dining_rating >= 4.5 THEN 1 END) as excellent_restaurants,
    ROUND(COUNT(CASE WHEN r.dining_rating >= 4.5 THEN 1 END) * 100.0 / COUNT(*), 2) as excellent_percentage
FROM Localities l
JOIN Restaurants r ON l.locality_id = r.locality_id
WHERE r.dining_rating IS NOT NULL
GROUP BY l.city
ORDER BY total_restaurants DESC;

-- ==========================================
-- 6. HIGH PERFORMING RESTAURANTS
-- ==========================================

-- Top restaurants by multiple criteria
SELECT 
    r.name,
    l.locality_name,
    l.city,
    r.dining_rating,
    r.dining_review_count,
    r.pricing_for_2,
    GROUP_CONCAT(c.cuisine_name ORDER BY c.cuisine_name SEPARATOR ', ') as cuisines,
    CASE 
        WHEN r.dining_rating >= 4.8 AND r.dining_review_count >= 1000 THEN 'Premium Choice'
        WHEN r.dining_rating >= 4.5 AND r.dining_review_count >= 500 THEN 'Highly Recommended'
        WHEN r.dining_rating >= 4.0 AND r.dining_review_count >= 100 THEN 'Good Option'
        ELSE 'Standard'
    END as recommendation_level
FROM Restaurants r
JOIN Localities l ON r.locality_id = l.locality_id
LEFT JOIN Restaurant_Cuisines rc ON r.restaurant_id = rc.restaurant_id
LEFT JOIN Cuisines c ON rc.cuisine_id = c.cuisine_id
WHERE r.dining_rating >= 4.0
GROUP BY r.restaurant_id, r.name, l.locality_name, l.city, r.dining_rating, r.dining_review_count, r.pricing_for_2
ORDER BY r.dining_rating DESC, r.dining_review_count DESC
LIMIT 25;

-- ==========================================
-- 7. DELIVERY VS DINING ANALYSIS
-- ==========================================

-- Compare dining and delivery ratings
SELECT 
    'Overall' as category,
    COUNT(CASE WHEN dining_rating IS NOT NULL THEN 1 END) as restaurants_with_dining,
    COUNT(CASE WHEN delivery_rating IS NOT NULL THEN 1 END) as restaurants_with_delivery,
    ROUND(AVG(dining_rating), 2) as avg_dining_rating,
    ROUND(AVG(delivery_rating), 2) as avg_delivery_rating,
    ROUND(AVG(dining_rating) - AVG(delivery_rating), 2) as rating_difference
FROM Restaurants
WHERE dining_rating IS NOT NULL OR delivery_rating IS NOT NULL

UNION ALL

SELECT 
    l.city,
    COUNT(CASE WHEN r.dining_rating IS NOT NULL THEN 1 END),
    COUNT(CASE WHEN r.delivery_rating IS NOT NULL THEN 1 END),
    ROUND(AVG(r.dining_rating), 2),
    ROUND(AVG(r.delivery_rating), 2),
    ROUND(AVG(r.dining_rating) - AVG(r.delivery_rating), 2)
FROM Restaurants r
JOIN Localities l ON r.locality_id = l.locality_id
WHERE r.dining_rating IS NOT NULL OR r.delivery_rating IS NOT NULL
GROUP BY l.city
ORDER BY category;

-- ==========================================
-- 8. MONTHLY TRENDS (Simulated Data)
-- ==========================================

-- Simulated monthly registration trends
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    COUNT(*) as new_restaurants,
    ROUND(AVG(dining_rating), 2) as avg_rating,
    ROUND(AVG(pricing_for_2), 0) as avg_cost
FROM Restaurants 
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month;

-- ==========================================
-- 9. ADVANCED ANALYTICS QUERIES
-- ==========================================

-- Cuisine popularity by city
SELECT 
    l.city,
    c.cuisine_name,
    COUNT(*) as restaurant_count,
    ROUND(AVG(r.dining_rating), 2) as avg_rating,
    RANK() OVER (PARTITION BY l.city ORDER BY COUNT(*) DESC) as popularity_rank
FROM Restaurants r
JOIN Localities l ON r.locality_id = l.locality_id
JOIN Restaurant_Cuisines rc ON r.restaurant_id = rc.restaurant_id
JOIN Cuisines c ON rc.cuisine_id = c.cuisine_id
WHERE r.dining_rating IS NOT NULL
GROUP BY l.city, c.cuisine_name
HAVING restaurant_count >= 2
ORDER BY l.city, popularity_rank
LIMIT 50;

-- Price-performance ratio analysis
SELECT 
    r.name,
    l.locality_name,
    r.dining_rating,
    r.pricing_for_2,
    ROUND(r.dining_rating / (r.pricing_for_2 / 1000), 3) as value_score,
    CASE 
        WHEN r.dining_rating / (r.pricing_for_2 / 1000) >= 4.0 THEN 'Excellent Value'
        WHEN r.dining_rating / (r.pricing_for_2 / 1000) >= 3.0 THEN 'Good Value'
        WHEN r.dining_rating / (r.pricing_for_2 / 1000) >= 2.0 THEN 'Fair Value'
        ELSE 'Premium Pricing'
    END as value_category
FROM Restaurants r
JOIN Localities l ON r.locality_id = l.locality_id
WHERE r.dining_rating IS NOT NULL AND r.pricing_for_2 > 0
ORDER BY value_score DESC
LIMIT 30;