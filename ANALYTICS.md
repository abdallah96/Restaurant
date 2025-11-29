# Analytics Tracking Documentation

This document describes all the user behavior tracking implemented in the restaurant website.

## Overview

The website uses **Vercel Analytics** and **Vercel Speed Insights** to track user behavior and performance metrics. All events are tracked with timestamps for time-based analysis.

## Tracked Events

### Page Views
- **Event**: `page_viewed`
- **Tracked Pages**:
  - `home` - Homepage visits
  - `order` - Order page visits
  - `daily_menu` - Daily menu page visits
  - `menu` - Menu page visits (if implemented)

### Menu Interactions

#### Category Filtering
- **Event**: `category_filtered`
- **Data**: Selected category name
- **Triggers**: When user clicks on a category filter button

#### Daily Special Views
- **Event**: `daily_special_viewed`
- **Data**: Special ID, special name
- **Triggers**: When user clicks/views a daily special item

### Cart Actions

#### Add to Cart
- **Event**: `add_to_cart`
- **Data**: 
  - Item ID
  - Item name
  - Item price
  - Quantity added
  - Item type (menu_item or daily_special)
- **Triggers**: When user adds an item or increases quantity

#### Remove from Cart
- **Event**: `remove_from_cart`
- **Data**: Item ID, name, price
- **Triggers**: When user removes an item completely

#### Update Cart Quantity
- **Event**: `update_cart_quantity`
- **Data**: Item ID, name, old quantity, new quantity
- **Triggers**: When user changes item quantity (not add/remove)

#### Clear Cart
- **Event**: `clear_cart`
- **Data**: Total item count, total amount
- **Triggers**: When cart is cleared (usually after successful order)

### Checkout Process

#### Checkout Initiated
- **Event**: `checkout_initiated`
- **Data**: Cart total, item count
- **Triggers**: When user scrolls to checkout form (50% visible)

#### Order Type Selection
- **Event**: `order_type_selected`
- **Data**: Order type (pickup or delivery)
- **Triggers**: When user selects pickup or delivery option

### Order Completion

#### Order Placed
- **Event**: `order_placed`
- **Data**:
  - Total amount
  - Item count
  - Order type (pickup/delivery)
  - Items summary (formatted string)
- **Triggers**: When order is successfully submitted

#### Item Purchased
- **Event**: `item_purchased` (fired for EACH item in order)
- **Data**:
  - Item ID
  - Item name
  - Item price
  - Quantity
  - Order type
- **Triggers**: When order is successfully placed
- **Purpose**: Track individual item popularity

## Analyzing the Data

### Most Popular Items
Query `item_purchased` events and group by `item_name` to see:
- Which items are ordered most frequently
- Which items generate most revenue
- Pickup vs delivery preferences per item

### User Journey Analysis
Track the sequence:
1. `page_viewed` (entry point)
2. `category_filtered` (browsing behavior)
3. `add_to_cart` (interest)
4. `checkout_initiated` (intent to buy)
5. `order_type_selected` (delivery preference)
6. `order_placed` (conversion)

### Conversion Metrics
- **Cart abandonment**: Compare `add_to_cart` vs `order_placed`
- **Checkout abandonment**: Compare `checkout_initiated` vs `order_placed`
- **Popular categories**: Track `category_filtered` events
- **Daily special performance**: Compare `daily_special_viewed` vs purchases

### Revenue Analytics
- Track `order_placed` total amounts over time
- Compare average order values by order type
- Identify peak ordering times (via timestamps)

## Accessing Analytics

### Vercel Dashboard
1. Go to your Vercel project dashboard
2. Click on "Analytics" tab
3. View page views, custom events, and performance metrics
4. Filter by date range, event type, etc.

### Custom Events
All custom events listed above are visible in the Vercel Analytics dashboard under "Events"

## Performance Monitoring

**Speed Insights** automatically tracks:
- Core Web Vitals (LCP, FID, CLS)
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- User experience scores

## Privacy

- All tracking is anonymous
- No personal information (names, emails, phone numbers) is tracked
- Only behavioral and aggregate data is collected
- Complies with Vercel's privacy standards

## Future Enhancements

Consider adding:
- Search query tracking (if search is implemented)
- Failed order attempts
- Form field interactions
- Time spent on pages
- Scroll depth tracking
- Click heatmaps
