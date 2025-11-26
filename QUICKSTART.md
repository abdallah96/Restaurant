# Quick Start Guide

## Overview
Full-stack restaurant ordering system for Senegalese restaurants with daily specials and fast food menu.

## Features
- ✅ Customer ordering with shopping cart
- ✅ Daily special menu (Traditional Senegalese meals)
- ✅ Fast food menu (Burgers, sandwiches, etc.)
- ✅ Admin dashboard for order management
- ✅ WhatsApp order notifications
- ✅ Real-time order tracking
- ✅ Stock management
- ✅ Mobile-responsive design

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor and run `supabase/schema.sql`
4. Copy your project URL and keys from Settings → API

### 3. Configure Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials.

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Routes

- `/` - Homepage
- `/order` - Order page with menu and cart
- `/menu` - Fast food menu
- `/daily-menu` - Daily special menu
- `/admin` - Admin dashboard (order management)

## Tech Stack
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **State:** Zustand
- **Notifications:** React Hot Toast

## Default Data
The database includes sample data:
- 11 fast food items
- 1 daily special (Thiéboudienne)
- Prices in West African CFA Franc (FCFA)

## Need Help?
See `README_SETUP.md` for detailed instructions.
