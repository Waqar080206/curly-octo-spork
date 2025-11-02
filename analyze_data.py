import pandas as pd
import numpy as np

# Read the CSV file
df = pd.read_csv('DelhiNCR Restaurants.csv')

print("=== ACTUAL DATA ANALYSIS ===")
print(f"Total rows in CSV: {len(df)}")
print(f"Unique restaurants: {df['Restaurant_Name'].nunique()}")

# Basic statistics
print(f"\n=== BASIC STATISTICS ===")
print(f"Average dining rating: {df['Dining_Rating'].mean():.2f}")
print(f"Average pricing for 2: ₹{df['Pricing_for_2'].mean():.0f}")

# Top cuisines analysis
print(f"\n=== TOP CUISINES ===")
# Split categories and count
all_cuisines = []
for categories in df['Category'].dropna():
    cuisines = [cuisine.strip() for cuisine in str(categories).split(',')]
    all_cuisines.extend(cuisines)

cuisine_counts = pd.Series(all_cuisines).value_counts()
print("Top 8 cuisines:")
for i, (cuisine, count) in enumerate(cuisine_counts.head(8).items()):
    avg_rating = df[df['Category'].str.contains(cuisine, na=False)]['Dining_Rating'].mean()
    print(f"{i+1}. {cuisine}: {count} restaurants (Avg rating: {avg_rating:.1f})")

# City analysis
print(f"\n=== CITY ANALYSIS ===")
# Extract city from locality
df['City'] = df['Locality'].str.split(',').str[-1].str.strip()
city_stats = df.groupby('City').agg({
    'Restaurant_Name': 'count',
    'Dining_Rating': 'mean'
}).round(2)
city_stats.columns = ['Restaurant_Count', 'Avg_Rating']
city_stats = city_stats.sort_values('Restaurant_Count', ascending=False)
print("City-wise distribution:")
for city, row in city_stats.head().iterrows():
    print(f"{city}: {row['Restaurant_Count']} restaurants (Avg rating: {row['Avg_Rating']})")

# Rating distribution
print(f"\n=== RATING DISTRIBUTION ===")
rating_bins = [0, 2, 3, 4, 4.5, 5]
rating_labels = ['Poor (< 2.0)', 'Below Avg (2.0-3.0)', 'Average (3.0-4.0)', 'Good (4.0-4.5)', 'Excellent (4.5+)']
df['Rating_Category'] = pd.cut(df['Dining_Rating'], bins=rating_bins, labels=rating_labels, include_lowest=True)
rating_dist = df['Rating_Category'].value_counts().sort_index()
for category, count in rating_dist.items():
    percentage = (count / len(df)) * 100
    print(f"{category}: {count} restaurants ({percentage:.1f}%)")

# Price analysis
print(f"\n=== PRICE ANALYSIS ===")
price_bins = [0, 500, 1000, 2000, 3000, float('inf')]
price_labels = ['Budget (< ₹500)', 'Mid-Range (₹500-1000)', 'Premium (₹1000-2000)', 'Luxury (₹2000-3000)', 'Ultra-Luxury (> ₹3000)']
df['Price_Category'] = pd.cut(df['Pricing_for_2'], bins=price_bins, labels=price_labels, include_lowest=True)
price_dist = df.groupby('Price_Category').agg({
    'Restaurant_Name': 'count',
    'Dining_Rating': 'mean'
}).round(2)
price_dist.columns = ['Count', 'Avg_Rating']
for category, row in price_dist.iterrows():
    percentage = (row['Count'] / len(df)) * 100
    print(f"{category}: {row['Count']} restaurants ({percentage:.1f}%) - Avg rating: {row['Avg_Rating']}")