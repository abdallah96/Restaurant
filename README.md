# Restaurant Sénégalais - Website

A modern Next.js website for a Senegalese restaurant with fast food menu, daily specials, online ordering, admin dashboard, and WhatsApp notifications.

## Features

- 🍔 Fast food menu and daily specials (Thiéboudienne, Yassa, Mafé, etc.)
- 🛒 Online ordering with delivery and pickup options
- 👨‍💼 Admin dashboard with authentication
- 📱 WhatsApp notifications via Twilio for order updates
- 🎨 Modern, responsive design with smooth animations
- 🔒 Secure JWT-based authentication

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- Supabase account (for production database)
- Twilio account (for WhatsApp notifications)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd senegal-restaurant-website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables (see below)

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase (for production database)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Secret (for admin authentication)
JWT_SECRET=your_secret_key_here_change_in_production

# Twilio (for WhatsApp notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

## Admin Login Setup

### Default Credentials

The application comes with a default admin account:
- **Email**: `admin@restaurant.sn`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change the default password in production!

### Changing Admin Credentials

To change admin credentials, edit `lib/db/store.ts`:

```typescript
const adminUsers: AdminUser[] = [
  {
    id: '1',
    email: 'your-email@example.com',
    password_hash: bcrypt.hashSync('your-secure-password', 10),
    full_name: 'Your Name',
    role: 'admin',
    created_at: new Date().toISOString(),
  },
];
```

### Accessing Admin Dashboard

1. Navigate to `/admin/login`
2. Enter your admin credentials
3. You'll be redirected to the admin dashboard at `/admin`
4. Manage orders, update statuses, and view statistics

## WhatsApp Notifications Setup

### Twilio Account Setup

1. **Create a Twilio Account**
   - Go to [https://www.twilio.com/](https://www.twilio.com/)
   - Sign up for a free account
   - Complete phone verification

2. **Get Your Credentials**
   - Navigate to the Twilio Console Dashboard
   - Copy your **Account SID** and **Auth Token**
   - Add them to your `.env.local` file

3. **Enable WhatsApp Sandbox** (for testing)
   - In the Twilio Console, go to **Messaging** → **Try it out** → **Send a WhatsApp message**
   - Follow the instructions to connect your WhatsApp to the sandbox
   - Send the provided code to the Twilio WhatsApp number
   - Use `whatsapp:+14155238886` as your `TWILIO_WHATSAPP_NUMBER` in `.env.local`

4. **Production WhatsApp Setup** (optional)
   - For production, apply for a Twilio WhatsApp Business Profile
   - Follow [Twilio's WhatsApp Business API documentation](https://www.twilio.com/docs/whatsapp/api)
   - Update `TWILIO_WHATSAPP_NUMBER` with your approved number

### WhatsApp Message Format

Customers receive notifications in French when order status changes:
- ✅ Order Confirmed
- 👨‍🍳 Order Preparing
- 🎉 Order Ready
- ✅ Order Delivered
- ❌ Order Cancelled

### Phone Number Format

Customer phone numbers must include country code:
- **Senegal**: `+221XXXXXXXXX` (e.g., `+221771234567`)
- **US/Canada**: `+1XXXXXXXXXX`
- **France**: `+33XXXXXXXXX`

### Testing WhatsApp Notifications

1. Ensure your `.env.local` is configured
2. Create a test order with your WhatsApp-enabled phone number
3. Log in to admin dashboard
4. Update the order status
5. You should receive a WhatsApp message

## Database Setup

The application uses Supabase for the database. To set up:

1. Create a [Supabase](https://supabase.com/) account
2. Create a new project
3. Run the SQL migrations in the Supabase SQL editor (see `supabase/` folder if available)
4. Add your Supabase URL and anon key to `.env.local`

### Database Tables

- `menu_items` - Fast food menu items
- `daily_specials` - Daily traditional dishes
- `orders` - Customer orders
- `order_items` - Order line items
- `inventory` - Stock management
- `admin_users` - Admin accounts

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── admin/               # Admin dashboard pages
│   │   ├── login/          # Admin login page
│   │   └── page.tsx        # Admin dashboard
│   ├── api/                # API routes
│   │   └── admin/          # Admin API endpoints
│   ├── menu/               # Menu pages
│   ├── order/              # Order page
│   └── daily-menu/         # Daily specials page
├── components/              # React components
│   ├── layout/             # Header, Footer
│   ├── menu/               # Menu components
│   ├── order/              # Order components
│   └── ui/                 # UI components (Button, etc.)
├── lib/                     # Utilities and helpers
│   ├── auth/               # Authentication utilities
│   ├── db/                 # Database/store
│   ├── supabase/           # Supabase client
│   └── twilio/             # Twilio WhatsApp client
├── types/                   # TypeScript types
└── middleware.ts            # Auth middleware
```

## Color Theme

The design uses colors inspired by the Senegalese flag:
- **Primary** (Orange-Gold): `#e88c00`
- **Secondary** (Green): `#0f9d0f`
- **Accent** (Red): `#e60000`

## Troubleshooting

### WhatsApp Messages Not Sending

- Verify Twilio credentials in `.env.local`
- Check that phone numbers include country code
- Ensure WhatsApp sandbox is properly configured
- Check Twilio Console logs for errors

### Admin Login Not Working

- Verify JWT_SECRET is set in `.env.local`
- Clear browser cookies and try again
- Check that credentials match those in `lib/db/store.ts`

### Build Errors

- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Ensure all environment variables are set

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com/new):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add all environment variables in Vercel project settings
4. Deploy!

Make sure to set all environment variables in your Vercel project settings before deploying.
