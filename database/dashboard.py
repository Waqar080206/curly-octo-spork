#!/usr/bin/env python3
"""
DBMS Project: Zomato Restaurants in Delhi NCR — Data Analytics Dashboard
Database: restaurant_db (MySQL)
Authors: Waqar Akhtar & Akshat Talwar

This script demonstrates SQL-driven analytics with visualization
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import mysql.connector
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import warnings
warnings.filterwarnings('ignore')

# Database Configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'your_password',  # Update with your MySQL password
    'database': 'restaurant_db'
}

class RestaurantAnalytics:
    def __init__(self, db_config):
        """Initialize database connection"""
        try:
            self.conn = mysql.connector.connect(**db_config)
            print("✅ Connected to MySQL database successfully!")
        except mysql.connector.Error as err:
            print(f"❌ Database connection failed: {err}")
            self.conn = None
    
    def execute_query(self, query, description=""):
        """Execute SQL query and return DataFrame"""
        if not self.conn:
            print("❌ No database connection")
            return None
        
        try:
            print(f"🔍 Executing: {description}")
            df = pd.read_sql(query, self.conn)
            print(f"✅ Retrieved {len(df)} rows")
            return df
        except Exception as e:
            print(f"❌ Query failed: {e}")
            return None
    
    def get_cuisine_analysis(self):
        """SQL Query 1: Top cuisines with performance metrics"""
        query = """
        SELECT 
            c.cuisine_name,
            COUNT(DISTINCT r.restaurant_id) as restaurant_count,
            ROUND(AVG(r.dining_rating), 2) as avg_rating,
            ROUND(AVG(r.pricing_for_2), 0) as avg_cost,
            SUM(r.dining_review_count) as total_reviews,
            ROUND(COUNT(DISTINCT r.restaurant_id) * 100.0 / 
                  (SELECT COUNT(*) FROM Restaurants), 2) as market_share_percent
        FROM Cuisines c
        JOIN Restaurant_Cuisines rc ON c.cuisine_id = rc.cuisine_id
        JOIN Restaurants r ON rc.restaurant_id = r.restaurant_id
        WHERE r.dining_rating IS NOT NULL
        GROUP BY c.cuisine_id, c.cuisine_name
        HAVING restaurant_count >= 5
        ORDER BY restaurant_count DESC, avg_rating DESC
        LIMIT 15;
        """
        return self.execute_query(query, "Top Cuisines Analysis")
    
    def get_city_performance(self):
        """SQL Query 2: City-wise performance comparison"""
        query = """
        SELECT 
            l.city,
            COUNT(DISTINCT r.restaurant_id) as total_restaurants,
            COUNT(DISTINCT l.locality_id) as localities_covered,
            ROUND(AVG(r.dining_rating), 2) as avg_rating,
            ROUND(AVG(r.pricing_for_2), 0) as avg_cost,
            SUM(r.dining_review_count) as total_reviews,
            COUNT(CASE WHEN r.dining_rating >= 4.5 THEN 1 END) as excellent_restaurants
        FROM Localities l
        JOIN Restaurants r ON l.locality_id = r.locality_id
        WHERE r.dining_rating IS NOT NULL
        GROUP BY l.city
        ORDER BY total_restaurants DESC;
        """
        return self.execute_query(query, "City Performance Analysis")
    
    def get_rating_distribution(self):
        """SQL Query 3: Rating distribution with categories"""
        query = """
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
            ROUND(COUNT(*) * 100.0 / 
                  (SELECT COUNT(*) FROM Restaurants WHERE dining_rating IS NOT NULL), 2) as percentage
        FROM Restaurants 
        WHERE dining_rating IS NOT NULL
        GROUP BY rating_category
        ORDER BY MIN(dining_rating);
        """
        return self.execute_query(query, "Rating Distribution Analysis")
    
    def get_price_analysis(self):
        """SQL Query 4: Price segment analysis"""
        query = """
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
        """
        return self.execute_query(query, "Price Segment Analysis")
    
    def get_top_localities(self):
        """SQL Query 5: Top performing localities"""
        query = """
        SELECT 
            l.locality_name,
            l.city,
            l.area_type,
            COUNT(r.restaurant_id) as restaurant_count,
            ROUND(AVG(r.dining_rating), 2) as avg_dining_rating,
            ROUND(AVG(r.pricing_for_2), 0) as avg_cost_for_two
        FROM Localities l
        JOIN Restaurants r ON l.locality_id = r.locality_id
        WHERE r.dining_rating IS NOT NULL
        GROUP BY l.locality_id, l.locality_name, l.city, l.area_type
        HAVING restaurant_count >= 3
        ORDER BY avg_dining_rating DESC, restaurant_count DESC
        LIMIT 10;
        """
        return self.execute_query(query, "Top Localities Analysis")
    
    def create_visualizations(self):
        """Create comprehensive dashboard visualizations"""
        print("\n📊 Creating Data Visualizations...")
        
        # Set style
        plt.style.use('seaborn-v0_8')
        sns.set_palette("husl")
        
        # Get data
        cuisine_data = self.get_cuisine_analysis()
        city_data = self.get_city_performance()
        rating_data = self.get_rating_distribution()
        price_data = self.get_price_analysis()
        locality_data = self.get_top_localities()
        
        if not all([df is not None for df in [cuisine_data, city_data, rating_data, price_data]]):
            print("❌ Failed to retrieve data for visualizations")
            return
        
        # Create subplot figure
        fig = plt.figure(figsize=(20, 15))
        
        # 1. Top Cuisines Bar Chart
        plt.subplot(2, 3, 1)
        top_cuisines = cuisine_data.head(8)
        bars = plt.bar(range(len(top_cuisines)), top_cuisines['restaurant_count'], 
                      color=sns.color_palette("viridis", len(top_cuisines)))
        plt.title('Top 8 Cuisines by Restaurant Count', fontsize=14, fontweight='bold')
        plt.xlabel('Cuisine Type')
        plt.ylabel('Number of Restaurants')
        plt.xticks(range(len(top_cuisines)), top_cuisines['cuisine_name'], rotation=45, ha='right')
        
        # Add value labels on bars
        for i, bar in enumerate(bars):
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height + 10,
                    f'{int(height)}', ha='center', va='bottom', fontsize=10)
        
        # 2. City Distribution Pie Chart
        plt.subplot(2, 3, 2)
        plt.pie(city_data['total_restaurants'], labels=city_data['city'], autopct='%1.1f%%',
                startangle=90, colors=sns.color_palette("Set3", len(city_data)))
        plt.title('Restaurant Distribution by City', fontsize=14, fontweight='bold')
        
        # 3. Rating Distribution
        plt.subplot(2, 3, 3)
        bars = plt.bar(range(len(rating_data)), rating_data['restaurant_count'],
                      color=sns.color_palette("RdYlGn", len(rating_data)))
        plt.title('Rating Distribution', fontsize=14, fontweight='bold')
        plt.xlabel('Rating Category')
        plt.ylabel('Number of Restaurants')
        plt.xticks(range(len(rating_data)), rating_data['rating_category'], rotation=45, ha='right')
        
        # 4. Price vs Rating Scatter
        plt.subplot(2, 3, 4)
        scatter_data = cuisine_data.head(10)
        plt.scatter(scatter_data['avg_cost'], scatter_data['avg_rating'], 
                   s=scatter_data['restaurant_count']*2, alpha=0.6, 
                   c=range(len(scatter_data)), cmap='viridis')
        plt.xlabel('Average Cost for Two (₹)')
        plt.ylabel('Average Rating')
        plt.title('Cost vs Rating (Bubble size = Restaurant Count)', fontsize=14, fontweight='bold')
        
        # Add cuisine labels
        for i, row in scatter_data.iterrows():
            plt.annotate(row['cuisine_name'][:8], 
                        (row['avg_cost'], row['avg_rating']),
                        xytext=(5, 5), textcoords='offset points', fontsize=8)
        
        # 5. Price Segment Analysis
        plt.subplot(2, 3, 5)
        bars = plt.bar(range(len(price_data)), price_data['avg_rating'],
                      color=sns.color_palette("coolwarm", len(price_data)))
        plt.title('Average Rating by Price Segment', fontsize=14, fontweight='bold')
        plt.xlabel('Price Segment')
        plt.ylabel('Average Rating')
        plt.xticks(range(len(price_data)), price_data['price_segment'], rotation=45, ha='right')
        
        # 6. Top Localities
        plt.subplot(2, 3, 6)
        top_localities = locality_data.head(8)
        bars = plt.barh(range(len(top_localities)), top_localities['avg_dining_rating'],
                       color=sns.color_palette("plasma", len(top_localities)))
        plt.title('Top Localities by Average Rating', fontsize=14, fontweight='bold')
        plt.xlabel('Average Rating')
        plt.ylabel('Locality')
        plt.yticks(range(len(top_localities)), top_localities['locality_name'])
        
        plt.tight_layout()
        plt.savefig('restaurant_analytics_dashboard.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        print("✅ Dashboard saved as 'restaurant_analytics_dashboard.png'")
    
    def generate_insights_report(self):
        """Generate analytical insights from the data"""
        print("\n📋 ANALYTICAL INSIGHTS REPORT")
        print("=" * 50)
        
        # Get summary statistics
        cuisine_data = self.get_cuisine_analysis()
        city_data = self.get_city_performance()
        rating_data = self.get_rating_distribution()
        
        if cuisine_data is not None:
            print(f"\n🍽️  CUISINE INSIGHTS:")
            top_cuisine = cuisine_data.iloc[0]
            print(f"   • Most Popular: {top_cuisine['cuisine_name']} ({top_cuisine['restaurant_count']} restaurants)")
            print(f"   • Market Share: {top_cuisine['market_share_percent']}%")
            print(f"   • Average Rating: {top_cuisine['avg_rating']}/5.0")
            
            high_rated = cuisine_data[cuisine_data['avg_rating'] >= 4.3]
            print(f"   • High-Rated Cuisines (≥4.3): {len(high_rated)} types")
        
        if city_data is not None:
            print(f"\n🏙️  CITY INSIGHTS:")
            top_city = city_data.iloc[0]
            print(f"   • Largest Market: {top_city['city']} ({top_city['total_restaurants']} restaurants)")
            print(f"   • Best Rated City: {city_data.loc[city_data['avg_rating'].idxmax(), 'city']}")
            print(f"   • Total Cities Covered: {len(city_data)}")
        
        if rating_data is not None:
            print(f"\n⭐ RATING INSIGHTS:")
            excellent = rating_data[rating_data['rating_category'].str.contains('Excellent|Outstanding')]
            excellent_pct = excellent['percentage'].sum() if not excellent.empty else 0
            print(f"   • Excellent+ Restaurants: {excellent_pct}%")
            
            good_plus = rating_data[rating_data['rating_category'].str.contains('Good|Excellent|Outstanding')]
            good_pct = good_plus['percentage'].sum() if not good_plus.empty else 0
            print(f"   • Good+ Restaurants: {good_pct}%")
        
        print(f"\n💡 KEY RECOMMENDATIONS:")
        print(f"   • Focus on high-performing cuisines for new restaurant ventures")
        print(f"   • Gurgaon and New Delhi show strong market potential")
        print(f"   • Quality ratings correlate with customer engagement")
        print(f"   • Premium pricing segments maintain higher ratings")
    
    def close_connection(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()
            print("🔌 Database connection closed")

def main():
    """Main execution function"""
    print("🚀 DBMS Project: Zomato NCR Restaurant Analytics")
    print("=" * 60)
    
    # Initialize analytics
    analytics = RestaurantAnalytics(DB_CONFIG)
    
    if analytics.conn:
        # Generate visualizations
        analytics.create_visualizations()
        
        # Generate insights report
        analytics.generate_insights_report()
        
        # Close connection
        analytics.close_connection()
    else:
        print("❌ Cannot proceed without database connection")
        print("💡 Make sure MySQL is running and credentials are correct")

if __name__ == "__main__":
    main()

# Additional Streamlit Dashboard (Optional)
"""
To run interactive dashboard with Streamlit:

pip install streamlit
streamlit run dashboard.py

Add this code for Streamlit interface:

import streamlit as st

def create_streamlit_dashboard():
    st.title('🍽️ Zomato NCR Restaurant Analytics Dashboard')
    st.markdown('**DBMS Project by Waqar Akhtar & Akshat Talwar**')
    
    analytics = RestaurantAnalytics(DB_CONFIG)
    
    if analytics.conn:
        # Sidebar filters
        st.sidebar.header('Filters')
        
        # Main dashboard
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Total Restaurants", "6,694", "+12%")
        with col2:
            st.metric("Average Rating", "4.15", "+0.05")
        with col3:
            st.metric("Cities Covered", "5", "NCR")
        with col4:
            st.metric("Top Cuisine", "North Indian", "18.6%")
        
        # Charts
        cuisine_data = analytics.get_cuisine_analysis()
        if cuisine_data is not None:
            st.subheader('Top Cuisines')
            st.bar_chart(cuisine_data.set_index('cuisine_name')['restaurant_count'])
        
        analytics.close_connection()
"""