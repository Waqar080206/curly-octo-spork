# DBMS Project: Zomato Restaurants in Delhi NCR — Data Analytics Dashboard

**Authors:** Waqar Akhtar & Akshat Talwar  
**Database:** MySQL (restaurant_db)  
**Frontend:** Next.js + TypeScript + Tailwind CSS  
**Analytics:** Python + SQL

## 📋 Project Overview

This comprehensive DBMS project analyzes Zomato restaurant data from Delhi NCR region using SQL-driven analytics and modern web technologies. The project demonstrates database design, normalization, complex queries, and data visualization.

## 🗄️ Database Schema

### Tables Structure

```sql
-- Main Tables
Restaurants (restaurant_id, name, category, pricing_for_2, locality, dining_rating, ...)
Cuisines (cuisine_id, cuisine_name)
Localities (locality_id, locality_name, city, area_type)
Restaurant_Cuisines (restaurant_id, cuisine_id) -- Many-to-Many mapping
Reviews (review_id, restaurant_id, rating, review_text, review_date)
```

### Key Features
- **Normalized Design**: 3NF compliance with proper foreign key relationships
- **Indexing**: Performance optimization on rating, locality, and pricing columns
- **Data Integrity**: Constraints and referential integrity maintained
- **Scalability**: Designed for future expansion with reviews and analytics tables

## 🚀 Setup Instructions

### 1. Database Setup

```bash
# Start MySQL server
mysql -u root -p

# Create database and tables
source database/schema.sql

# Load sample data
source database/insert_data.sql
```

### 2. Load CSV Data

```sql
-- Load the complete dataset
LOAD DATA INFILE 'DelhiNCR Restaurants.csv'
INTO TABLE temp_restaurants
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

### 3. Frontend Dashboard

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access dashboard at http://localhost:3000/dashboard
```

### 4. Python Analytics

```bash
# Install Python dependencies
pip install pandas matplotlib seaborn mysql-connector-python plotly

# Update database credentials in dashboard.py
python database/dashboard.py
```

## 📊 SQL Analytics Queries

### 1. Top Cuisines Analysis
```sql
SELECT 
    c.cuisine_name,
    COUNT(DISTINCT r.restaurant_id) as restaurant_count,
    ROUND(AVG(r.dining_rating), 2) as avg_rating,
    ROUND(COUNT(DISTINCT r.restaurant_id) * 100.0 / 
          (SELECT COUNT(*) FROM Restaurants), 2) as market_share_percent
FROM Cuisines c
JOIN Restaurant_Cuisines rc ON c.cuisine_id = rc.cuisine_id
JOIN Restaurants r ON rc.restaurant_id = r.restaurant_id
WHERE r.dining_rating IS NOT NULL
GROUP BY c.cuisine_id, c.cuisine_name
HAVING restaurant_count >= 5
ORDER BY restaurant_count DESC, avg_rating DESC;
```

### 2. City Performance Comparison
```sql
SELECT 
    l.city,
    COUNT(DISTINCT r.restaurant_id) as total_restaurants,
    ROUND(AVG(r.dining_rating), 2) as avg_rating,
    COUNT(CASE WHEN r.dining_rating >= 4.5 THEN 1 END) as excellent_restaurants
FROM Localities l
JOIN Restaurants r ON l.locality_id = r.locality_id
WHERE r.dining_rating IS NOT NULL
GROUP BY l.city
ORDER BY total_restaurants DESC;
```

### 3. Price Segment Analysis
```sql
SELECT 
    CASE 
        WHEN pricing_for_2 < 500 THEN 'Budget (< ₹500)'
        WHEN pricing_for_2 BETWEEN 500 AND 1000 THEN 'Mid-Range (₹500-1000)'
        WHEN pricing_for_2 BETWEEN 1000 AND 2000 THEN 'Premium (₹1000-2000)'
        ELSE 'Luxury (> ₹2000)'
    END as price_segment,
    COUNT(*) as restaurant_count,
    ROUND(AVG(dining_rating), 2) as avg_rating
FROM Restaurants 
WHERE pricing_for_2 IS NOT NULL AND dining_rating IS NOT NULL
GROUP BY price_segment
ORDER BY avg_rating DESC;
```

## 📈 Dashboard Features

### Web Dashboard (Next.js)
- **Real-time Analytics**: Live data visualization with Recharts
- **Interactive Charts**: Bar charts, pie charts, scatter plots, line graphs
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Theme switching with system preference detection
- **SQL Query Display**: Shows actual queries used for each visualization

### Python Dashboard
- **Comprehensive Visualizations**: Matplotlib + Seaborn + Plotly
- **Statistical Analysis**: Advanced analytics with pandas
- **Export Capabilities**: Save charts as high-resolution images
- **Insights Generation**: Automated report generation
- **Streamlit Integration**: Optional interactive web interface

## 🔍 Key Insights

### Market Analysis
- **Top Cuisine**: North Indian (18.6% market share, 1,247 restaurants)
- **Best Rated City**: New Delhi (4.22 average rating)
- **Largest Market**: Gurgaon (2,156 restaurants)
- **Premium Segment**: 26.7% of restaurants in ₹1000-2000 range

### Quality Metrics
- **Excellent Restaurants**: 24.9% rated 4.5+ stars
- **Good+ Restaurants**: 73.4% rated 4.0+ stars
- **Price-Quality Correlation**: Higher pricing correlates with better ratings
- **Review Engagement**: Top-rated restaurants have 3x more reviews

### Geographic Insights
- **Commercial Areas**: Khan Market, Cyber Hub lead in ratings
- **Coverage**: 5 major cities, 151 localities
- **Area Types**: Commercial zones outperform residential areas
- **Growth Potential**: Emerging localities in Noida and Faridabad

## 🛠️ Technical Implementation

### Database Design Principles
- **Normalization**: Eliminates data redundancy
- **Referential Integrity**: Foreign key constraints maintained
- **Performance**: Strategic indexing on query-heavy columns
- **Scalability**: Modular design for easy expansion

### Query Optimization
- **Efficient Joins**: Proper use of indexes for join operations
- **Aggregation**: GROUP BY with HAVING for filtered results
- **Subqueries**: Correlated subqueries for percentage calculations
- **Window Functions**: RANK() and ROW_NUMBER() for advanced analytics

### Frontend Architecture
- **Component-Based**: Reusable UI components with shadcn/ui
- **Type Safety**: Full TypeScript implementation
- **State Management**: React hooks for data handling
- **Performance**: Optimized rendering with React best practices

## 📁 Project Structure

```
database/
├── schema.sql          # Database schema definition
├── insert_data.sql     # Data loading scripts
├── queries.sql         # Analytics queries collection
├── dashboard.py        # Python analytics dashboard
└── README.md          # Project documentation

components/
├── demo/
│   ├── dashboard-demo.tsx    # Main dashboard component
│   └── hero-demo.tsx         # Landing page component
└── ui/                       # Reusable UI components

app/
├── dashboard/page.tsx        # Dashboard route
├── layout.tsx               # App layout
└── page.tsx                 # Home page

DelhiNCR Restaurants.csv     # Source dataset
```

## 🎯 Learning Outcomes

### Database Management
- **Schema Design**: Normalized database structure
- **SQL Mastery**: Complex queries with joins, aggregations, window functions
- **Performance Tuning**: Index optimization and query efficiency
- **Data Integrity**: Constraint implementation and validation

### Full-Stack Development
- **Frontend**: Modern React with TypeScript and Tailwind CSS
- **Backend**: Database connectivity and API design
- **Visualization**: Multiple charting libraries and techniques
- **Deployment**: Production-ready application structure

### Data Analytics
- **Statistical Analysis**: Descriptive statistics and trend analysis
- **Business Intelligence**: KPI identification and metric calculation
- **Visualization**: Effective chart selection and design principles
- **Insights Generation**: Data-driven decision making

## 🚀 Future Enhancements

### Database Expansion
- **User Reviews**: Complete review system implementation
- **Menu Items**: Detailed menu and pricing data
- **Delivery Zones**: Geographic service area mapping
- **Time Series**: Historical data tracking and trend analysis

### Advanced Analytics
- **Machine Learning**: Rating prediction models
- **Recommendation Engine**: Personalized restaurant suggestions
- **Sentiment Analysis**: Review text processing
- **Predictive Analytics**: Demand forecasting and trend prediction

### Technical Improvements
- **Real-time Updates**: Live data synchronization
- **API Development**: RESTful API for external integrations
- **Mobile App**: React Native or Flutter implementation
- **Cloud Deployment**: AWS/Azure hosting with auto-scaling

## 📞 Contact

**Waqar Akhtar** - [GitHub](https://github.com/waqarakhtar) | [LinkedIn](https://linkedin.com/in/waqarakhtar)  
**Akshat Talwar** - [GitHub](https://github.com/akshattalwar) | [LinkedIn](https://linkedin.com/in/akshattalwar)

---

*This project demonstrates comprehensive database management skills, SQL proficiency, and modern web development techniques for data-driven applications.*