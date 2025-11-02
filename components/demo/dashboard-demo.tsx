"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts'

// Custom Tooltip Component for better dark mode support
const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="text-foreground font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-muted-foreground">
            <span className="font-medium" style={{ color: entry.color }}>
              {entry.name === 'restaurants' ? 'Restaurants' : entry.name}:
            </span>{' '}
            {formatter ? formatter(entry.value, entry.dataKey) : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// SQL Query Results - Top Cuisines Analysis (Real Data)
const cuisineData = [
  { name: 'North Indian', restaurants: 1063, avgRating: 4.1, marketShare: 54.1, avgCost: 850 },
  { name: 'Chinese', restaurants: 775, avgRating: 4.1, marketShare: 39.4, avgCost: 720 },
  { name: 'Beverages', restaurants: 726, avgRating: 4.2, marketShare: 37.0, avgCost: 450 },
  { name: 'Fast Food', restaurants: 605, avgRating: 4.1, marketShare: 30.8, avgCost: 450 },
  { name: 'Desserts', restaurants: 425, avgRating: 4.2, marketShare: 21.6, avgCost: 380 },
  { name: 'Italian', restaurants: 407, avgRating: 4.2, marketShare: 20.7, avgCost: 1350 },
  { name: 'Continental', restaurants: 398, avgRating: 4.2, marketShare: 20.3, avgCost: 1200 },
  { name: 'Mughlai', restaurants: 370, avgRating: 4.1, marketShare: 18.8, avgCost: 950 },
]

// SQL Query Results - City-wise Distribution (Real Data)
const cityData = [
  { name: 'New Delhi', count: 1192, color: '#8884d8', avgRating: 4.14, localities: 45 },
  { name: 'Gurgaon', count: 403, color: '#82ca9d', avgRating: 4.18, localities: 38 },
  { name: 'Noida', count: 149, color: '#ffc658', avgRating: 4.14, localities: 28 },
  { name: 'Ghaziabad', count: 86, color: '#ff7300', avgRating: 4.07, localities: 22 },
  { name: 'Faridabad', count: 83, color: '#8dd1e1', avgRating: 4.07, localities: 18 },
]

// SQL Query Results - Rating Distribution Analysis (Real Data)
const ratingDistribution = [
  { rating: 'Poor (< 2.0)', count: 0, percentage: 0.0 },
  { rating: 'Below Avg (2.0-3.0)', count: 0, percentage: 0.0 },
  { rating: 'Average (3.0-4.0)', count: 787, percentage: 40.1 },
  { rating: 'Good (4.0-4.5)', count: 1091, percentage: 55.5 },
  { rating: 'Excellent (4.5+)', count: 87, percentage: 4.4 },
]

// SQL Query Results - Price Segment Analysis (Real Data)
const priceSegmentData = [
  { segment: 'Budget (< ₹500)', count: 705, avgRating: 4.07, percentage: 35.9 },
  { segment: 'Mid-Range (₹500-1000)', count: 559, avgRating: 4.13, percentage: 28.4 },
  { segment: 'Premium (₹1000-2000)', count: 477, avgRating: 4.21, percentage: 24.3 },
  { segment: 'Luxury (₹2000-3000)', count: 140, avgRating: 4.25, percentage: 7.1 },
  { segment: 'Ultra-Luxury (> ₹3000)', count: 84, avgRating: 4.23, percentage: 4.3 },
]

// SQL Query Results - Top Localities by Rating
const localityData = [
  { locality: 'Khan Market', city: 'New Delhi', avgRating: 4.6, restaurants: 45, areaType: 'Commercial' },
  { locality: 'Cyber Hub', city: 'Gurgaon', avgRating: 4.5, restaurants: 78, areaType: 'Commercial' },
  { locality: 'Connaught Place', city: 'New Delhi', avgRating: 4.4, restaurants: 92, areaType: 'Central' },
  { locality: 'Sector 29', city: 'Gurgaon', avgRating: 4.3, restaurants: 67, areaType: 'Commercial' },
  { locality: 'Hauz Khas Village', city: 'New Delhi', avgRating: 4.3, restaurants: 54, areaType: 'Suburban' },
]

// SQL Query Results - Value Analysis (Rating vs Cost)
const valueAnalysisData = [
  { cost: 300, rating: 4.2, restaurants: 45, category: 'Excellent Value' },
  { cost: 500, rating: 4.0, restaurants: 78, category: 'Good Value' },
  { cost: 750, rating: 4.1, restaurants: 156, category: 'Good Value' },
  { cost: 1000, rating: 4.2, restaurants: 234, category: 'Fair Value' },
  { cost: 1500, rating: 4.4, restaurants: 189, category: 'Fair Value' },
  { cost: 2000, rating: 4.5, restaurants: 123, category: 'Premium Pricing' },
  { cost: 3000, rating: 4.7, restaurants: 67, category: 'Premium Pricing' },
  { cost: 4500, rating: 4.8, restaurants: 34, category: 'Premium Pricing' },
]

function DashboardDemo() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Analytics DBMS Dashboard </h1>
              <p className="text-muted-foreground text-lg">
              Restaurant Insights: SQL-Driven Analysis & ML Rating Prediction on Zomato NCR Data
              </p>
            </div>
            <Badge variant="outline" className="text-sm px-3 py-1">
              MySQL Database • 1,943 Unique Restaurants
            </Badge>
          </div>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">Datset: https://sl1nk.com/Kaggle-Datset</Badge>
            <Badge variant="secondary">by Waqar Akhtar & Akshat Talwar</Badge>
            <Badge variant="secondary">DBMS Project</Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
              <Badge variant="secondary">NCR</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,943</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Badge variant="secondary">⭐</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.14</div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Cuisine</CardTitle>
              <Badge variant="secondary">🍛</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">North Indian</div>
              <p className="text-xs text-muted-foreground">1,063 restaurants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cities</CardTitle>
              <Badge variant="secondary">📍</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">New Delhi leads with 1,192</p>
            </CardContent>
          </Card>
        </div>

        {/* SQL Analysis Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Cuisines Analysis</CardTitle>
              <CardDescription>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  SELECT cuisine_name, COUNT(*) as restaurant_count FROM Cuisines...
                </code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cuisineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip
                    content={<CustomTooltip formatter={(value: any) => `${value} Restaurants`} />}
                    labelFormatter={(label) => `Cuisine: ${label}`}
                  />
                  <Bar dataKey="restaurants" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>City Performance Metrics</CardTitle>
              <CardDescription>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  SELECT city, COUNT(*), AVG(rating) FROM Restaurants GROUP BY city...
                </code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={cityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {cityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                            <p className="text-foreground font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-primary">Restaurants:</span> {data.count}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-primary">Avg Rating:</span> {data.avgRating}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-primary">Localities:</span> {data.localities}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* SQL Analysis Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution Analysis</CardTitle>
              <CardDescription>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  SELECT CASE WHEN rating BETWEEN 4.0 AND 4.4 THEN 'Good'...
                </code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" angle={-20} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                            <p className="text-foreground font-medium">{data.rating}</p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-primary">Count:</span> {data.count} Restaurants
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-primary">Percentage:</span> {data.percentage}%
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price vs Rating Analysis</CardTitle>
              <CardDescription>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  SELECT pricing_for_2, AVG(rating) FROM Restaurants GROUP BY...
                </code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={valueAnalysisData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cost" name="Cost for Two (₹)" />
                  <YAxis dataKey="rating" name="Rating" domain={[3.5, 5]} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                            <p className="text-foreground font-medium">Restaurant Data</p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-primary">Cost for Two:</span> ₹{data.cost}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-primary">Rating:</span> {data.rating}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-primary">Restaurants:</span> {data.restaurants}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-primary">Category:</span> {data.category}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Scatter dataKey="rating" fill="hsl(var(--primary))" />                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Segment Analysis</CardTitle>
              <CardDescription>Restaurant distribution by pricing tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {priceSegmentData.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded border">
                    <div>
                      <div className="font-medium text-sm">{segment.segment}</div>
                      <div className="text-xs text-muted-foreground">{segment.count} restaurants</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{segment.avgRating}</div>
                      <div className="text-xs text-muted-foreground">{segment.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Localities</CardTitle>
              <CardDescription>Highest rated restaurant areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {localityData.map((locality, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded border">
                    <div>
                      <div className="font-medium text-sm">{locality.locality}</div>
                      <div className="text-xs text-muted-foreground">{locality.city} • {locality.restaurants} restaurants</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{locality.avgRating}</div>
                      <Badge variant="outline" className="text-xs">{locality.areaType}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Schema</CardTitle>
              <CardDescription>Normalized table structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-muted rounded">
                  <div className="font-mono font-bold">Restaurants</div>
                  <div className="text-xs text-muted-foreground">Main entity with ratings & pricing</div>
                </div>
                <div className="p-2 bg-muted rounded">
                  <div className="font-mono font-bold">Cuisines</div>
                  <div className="text-xs text-muted-foreground">Normalized cuisine types</div>
                </div>
                <div className="p-2 bg-muted rounded">
                  <div className="font-mono font-bold">Localities</div>
                  <div className="text-xs text-muted-foreground">Geographic data with area types</div>
                </div>
                <div className="p-2 bg-muted rounded">
                  <div className="font-mono font-bold">Restaurant_Cuisines</div>
                  <div className="text-xs text-muted-foreground">Many-to-many mapping</div>
                </div>
                <div className="p-2 bg-muted rounded">
                  <div className="font-mono font-bold">Reviews</div>
                  <div className="text-xs text-muted-foreground">Future expansion table</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SQL Queries Table */}
        <Card>
          <CardHeader>
            <CardTitle>SQL Query Results: Cuisine Performance Analysis</CardTitle>
            <CardDescription>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                SELECT c.cuisine_name, COUNT(*) as restaurant_count, AVG(r.dining_rating) as avg_rating,
                AVG(r.pricing_for_2) as avg_cost FROM Cuisines c JOIN Restaurant_Cuisines rc...
              </code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Cuisine Type</th>
                    <th className="text-left p-2">Restaurant Count</th>
                    <th className="text-left p-2">Avg Rating</th>
                    <th className="text-left p-2">Market Share</th>
                    <th className="text-left p-2">Avg Cost</th>
                    <th className="text-left p-2">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {cuisineData.map((cuisine, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{cuisine.name}</td>
                      <td className="p-2">{cuisine.restaurants.toLocaleString()}</td>
                      <td className="p-2 font-mono">{cuisine.avgRating}</td>
                      <td className="p-2">{cuisine.marketShare}%</td>
                      <td className="p-2">₹{cuisine.avgCost}</td>
                      <td className="p-2">
                        <Badge variant={cuisine.avgRating >= 4.2 ? "default" : cuisine.avgRating >= 4.0 ? "secondary" : "destructive"}>
                          {cuisine.avgRating >= 4.2 ? "Excellent" : cuisine.avgRating >= 4.0 ? "Good" : "Average"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { DashboardDemo }