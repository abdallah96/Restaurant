# WhatsApp Multi-Staff Setup Guide

## Overview

Your restaurant website now supports sending WhatsApp notifications to **multiple staff members** when customers place orders. You can have yourself (main person) + 2 staff members = **3 people total**, and easily add more in the future.

## How It Works

1. **Customer places an order** on your website
2. **All configured staff members** receive a WhatsApp notification instantly
3. Each notification includes:
   - Customer name and phone
   - Order items and quantities
   - Total amount in FCFA
   - Delivery/pickup information
   - Special notes

## Setup Steps

### 1. Get Twilio Account (5 minutes)

1. Go to [https://www.twilio.com/](https://www.twilio.com/)
2. Sign up for a **free trial account**
3. Verify your phone number
4. In the Twilio Console, copy:
   - **Account SID**
   - **Auth Token**

### 2. Enable WhatsApp Sandbox (For Testing)

1. In Twilio Console, go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. You'll see instructions like: "Send `join <code>` to +1 415 523 8886"
3. **Each staff member** needs to:
   - Send that code to the Twilio sandbox number from their WhatsApp
   - Example: Send "join chair-hello" to +1 415 523 8886
4. They will receive a confirmation message

⚠️ **Important**: For testing, all staff members must join the sandbox!

### 3. Configure Your Environment Variables

Edit your `.env.local` file:

```env
# Twilio credentials
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Your WhatsApp numbers (Senegal format)
# You (main person)
STAFF_WHATSAPP_1=+221771234567

# Staff member 2
STAFF_WHATSAPP_2=+221772345678

# Staff member 3 (optional)
STAFF_WHATSAPP_3=+221773456789

# Add more staff members as needed
# STAFF_WHATSAPP_4=+221774567890
# STAFF_WHATSAPP_5=+221775678901
# ... up to STAFF_WHATSAPP_20
```

**Phone Number Format:**
- Senegal: `+221` followed by 9 digits (e.g., `+221771234567`)
- Must include country code
- No spaces or dashes

### 4. Test It Out

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Place a test order on your website:
   - Go to [http://localhost:3000/menu](http://localhost:3000/menu)
   - Add items to cart
   - Complete checkout

3. **All configured staff members** should receive a WhatsApp notification!

## Adding More Staff Members (Future)

To add a 4th, 5th, or more staff members:

1. Open `.env.local`
2. Add a new line:
   ```env
   STAFF_WHATSAPP_4=+221774567890
   STAFF_WHATSAPP_5=+221775678901
   ```
3. Restart your server
4. Done! ✅

**No code changes needed** - just add environment variables.

## Production Setup (After Testing)

Once you're ready to go live:

### Option 1: Keep Using Twilio Sandbox (Simple, but limited)
- Free to use
- Staff must join sandbox first
- Good for small operations

### Option 2: Get Your Own WhatsApp Business Number (Professional)

1. In Twilio Console, go to **Phone Numbers** → **Buy a Number**
2. Apply for **WhatsApp Business Profile**:
   - Provide business details
   - Submit for Meta verification (takes 5-20 days)
3. Once approved, update `.env.local`:
   ```env
   TWILIO_WHATSAPP_NUMBER=whatsapp:+221XXXXXXXXX
   ```

**Cost:**
- Receiving messages: Free or very low cost
- Sending notifications: ~$0.005 per message
- Phone number rental: Varies by country

## Troubleshooting

### Staff Not Receiving Notifications

**Check:**
1. Did they join the Twilio sandbox? (Send the join code)
2. Is their number in `.env.local` with correct format? (`+221XXXXXXXXX`)
3. Did you restart the server after adding their number?
4. Check server logs for errors

### Messages Sending But Not Received

**Solutions:**
1. Verify the phone number format (must include `+` and country code)
2. Make sure WhatsApp is installed on their phone
3. Check if they blocked the Twilio number
4. In Twilio Console, check the **Message Logs** for delivery status

### "Twilio not configured" Warning

**Fix:**
1. Check `.env.local` has all required variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_NUMBER`
   - At least `STAFF_WHATSAPP_1`
2. Restart the server

## Example Notification

When an order is placed, staff receive:

```
🔔 *Nouvelle Commande* #abc12345

👤 *Client:* Amadou Gueye
📞 *Téléphone:* +221771234567
📦 *Type:* Livraison
📍 *Adresse:* Dakar, Plateau

📋 *Articles:*
- Thiéboudienne x2 (5000 FCFA)
- Yassa Poulet x1 (3500 FCFA)

💰 *Total:* 8500 FCFA

📝 *Notes:* Extra piment s'il vous plaît
```

## FAQ

**Q: Can I remove a staff member?**
A: Yes, just remove or comment out their line in `.env.local` and restart the server.

**Q: Do all staff get the same message?**
A: Yes, everyone gets identical notifications simultaneously.

**Q: What if I want different staff for different order types?**
A: This would require code changes. Let me know if you need this feature!

**Q: Is this free?**
A: Twilio offers free trial credits. After that:
- Sandbox: Free (with limitations)
- Production: Pay per message (~$0.005 each)

**Q: Can customers reply to notifications?**
A: Not directly. Notifications are sent FROM your Twilio number, so replies go to your business account, not individual staff.

## Support

If you need help:
1. Check Twilio Console logs
2. Check your server logs (`npm run dev`)
3. Review this guide
4. Contact me for assistance

---

**Ready to go!** 🚀 Just add your phone numbers to `.env.local` and start receiving order notifications on WhatsApp.
