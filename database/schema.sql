-- DBMS Project: Zomato Restaurants in Delhi NCR
-- Database Schema Definition

CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

-- Main Restaurants Table
CREATE TABLE Restaurants (
    restaurant_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(500),
    pricing_for_2 INT,
    locality VARCHAR(255),
    city VARCHAR(100),
    dining_rating DECIMAL(3,2),
    dining_review_count INT DEFAULT 0,
    delivery_rating DECIMAL(3,2),
    delivery_rating_count INT DEFAULT 0,
    website VARCHAR(500),
    address TEXT,
    phone_no VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    known_for TEXT,
    ambience_features TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cuisines Table (Normalized)
CREATE TABLE Cuisines (
    cuisine_id INT PRIMARY KEY AUTO_INCREMENT,
    cuisine_name VARCHAR(100) UNIQUE NOT NULL
);

-- Restaurant-Cuisine Mapping (Many-to-Many)
CREATE TABLE Restaurant_Cuisines (
    restaurant_id INT,
    cuisine_id INT,
    PRIMARY KEY (restaurant_id, cuisine_id),
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (cuisine_id) REFERENCES Cuisines(cuisine_id) ON DELETE CASCADE
);

-- Localities Table
CREATE TABLE Localities (
    locality_id INT PRIMARY KEY AUTO_INCREMENT,
    locality_name VARCHAR(255) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    area_type ENUM('Central', 'Suburban', 'Commercial', 'Residential') DEFAULT 'Residential'
);

-- Add foreign key to Restaurants table
ALTER TABLE Restaurants 
ADD COLUMN locality_id INT,
ADD FOREIGN KEY (locality_id) REFERENCES Localities(locality_id);

-- Reviews Table (for future expansion)
CREATE TABLE Reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id INT,
    rating DECIMAL(3,2),
    review_text TEXT,
    review_date DATE,
    reviewer_name VARCHAR(100),
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_restaurant_rating ON Restaurants(dining_rating);
CREATE INDEX idx_restaurant_locality ON Restaurants(locality);
CREATE INDEX idx_restaurant_pricing ON Restaurants(pricing_for_2);
CREATE INDEX idx_restaurant_city ON Restaurants(city);