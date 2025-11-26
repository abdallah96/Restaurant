# Restaurant Senegalais - Setup Guide

A full-stack restaurant ordering system built with Next.js, Tailwind CSS, Supabase, and WhatsApp integration.

## Features

### Frontend (Customer-facing)
- 🍽️ **Daily Special Menu** - Traditional Senegalese meals (Thiéboudienne, Yassa, Mafé, etc.)
- 🍔 **Fast Food Menu** - Regular menu items available every day
- 🛒 **Shopping Cart** - Add items, adjust quantities, and checkout
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 🎨 **Clean UI** - Easy-to-use interface with Tailwind CSS

### Backend (Admin Dashboard)
- 📊 **Order Management** - View and manage incoming orders
- 📞 **WhatsApp Integration** - Automatic order notifications to manager's phone
- 📝 **Menu Management** - Add, update, and remove menu items
- 🗓️ **Daily Special Management** - Set the daily special menu
- 📦 **Stock Management** - Track inventory levels
- ⚡ **Real-time Updates** - Powered by Supabase real-time capabilities

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes, Node.js
- **Database:** Supabase (PostgreSQL)
- **State Management:** Zustand
- **Notifications:** React Hot Toast
- **WhatsApp:** WhatsApp Business API (configurable)

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- (Optional) WhatsApp Business API credentials

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Go to **Settings** → **API** and copy:
   - Project URL
   - Anon/Public Key
   - Service Role Key (keep this secret!)

### 3. Create Database Tables

1. In your Supabase project, go to **SQL Editor**
2. Open the file `supabase/schema.sql` from this project
3. Copy and paste the entire SQL script into the Supabase SQL Editor
4. Click **Run** to execute the script

This will create all necessary tables with sample data.

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Optional: WhatsApp Integration
   WHATSAPP_PHONE_NUMBER=+221XXXXXXXXX
   WHATSAPP_API_KEY=your_whatsapp_api_key_if_using_service
   ```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Customer Flow

1. Visit the homepage at `/`
2. Click "Commander Maintenant" or navigate to `/order`
3. Browse the Daily Special and Regular Menu
4. Add items to cart
5. Scroll down to the checkout form
6. Fill in your details (name, phone, delivery type)
7. Submit your order

### Manager Flow (Admin Dashboard)

The admin dashboard will be accessible at `/admin` (to be implemented with authentication).

Features include:
- View all orders with status tracking
- Update order status (pending → confirmed → preparing → ready → delivered)
- Receive WhatsApp notifications for new orders
- Manage menu items and daily specials
- Track inventory levels

### WhatsApp Integration

When an order is placed, the system will:
1. Create the order in the database
2. Send a formatted WhatsApp message to the manager's phone number
3. Include customer details, order items, and total amount

**Note:** The WhatsApp integration is currently set up for logging. To enable actual WhatsApp sending, you need to:
- Sign up for WhatsApp Business API
- Or use a service like Twilio, MessageBird, or similar
- Update the `sendWhatsAppNotification` function in `app/api/orders/route.ts`

## Database Structure

### Tables

- **menu_items** - Fast food menu items (burgers, chicken, sandwiches, etc.)
- **daily_specials** - Traditional Senegalese daily specials
- **orders** - Customer orders
- **order_items** - Items in each order
- **inventory** - Stock management
- **admin_users** - Admin authentication (for future use)

### Sample Data

The schema includes sample data:
- 11 fast food items (burgers, sandwiches, chicken, drinks)
- 1 daily special (Thiéboudienne)
- Prices in West African CFA Franc (FCFA)

## Customization

### Adding Menu Items

Via Supabase dashboard:
1. Go to **Table Editor** → **menu_items**
2. Click **Insert** → **Insert row**
3. Add item details and save

### Changing Daily Special

Via Supabase dashboard:
1. Go to **Table Editor** → **daily_specials**
2. Update existing or insert new daily special
3. Set `is_active` to `true` and `active_date` to today's date

### Updating Prices

All prices are stored as decimal numbers in the database. Update them in the Supabase dashboard under the respective tables.

### Styling

The app uses Tailwind CSS with a custom color scheme:
- Primary: Orange/Red tones (Senegalese flag colors)
- Secondary: Green tones
- Accent: Yellow tones

Update colors in `tailwind.config.js` if needed.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy

### Deploy to Other Platforms

The app works on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## Troubleshooting

### Database Connection Issues

- Verify your Supabase credentials in `.env.local`
- Check that tables were created correctly
- Ensure Row Level Security policies are set up (from schema.sql)

### Cart Not Persisting

The cart uses Zustand with localStorage persistence. Clear browser cache if issues occur.

### Orders Not Appearing

- Check browser console for errors
- Verify API routes are working: visit `/api/menu` and `/api/menu/daily`
- Check Supabase logs in the dashboard

## Future Enhancements

- [ ] Admin dashboard with authentication
- [ ] Payment integration (Wave, Orange Money, etc.)
- [ ] Order tracking for customers
- [ ] Email notifications
- [ ] Multi-language support (French, Wolof)
- [ ] Restaurant analytics dashboard
- [ ] Customer accounts and order history

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check Next.js documentation

## License

MIT License - feel free to use this project for your restaurant!

---

**Built with ❤️ for Senegalese restaurants**
