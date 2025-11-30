# 🔧 Fix Error 63015: Number Format Mismatch

## The Problem

Error **63015** means: "Channel Sandbox can only send messages to phone numbers that have joined the Sandbox"

This usually happens when the **phone number format in your environment variables doesn't match** the exact format that Twilio sees when the staff member joined.

## ✅ Solution: Match the Exact Format

### Step 1: Find the Exact Number Format in Twilio

1. Go to https://console.twilio.com/
2. Navigate to: **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Scroll down to see **"Sandbox Participants"**
4. **Copy the EXACT number format** shown there for each staff member

Example formats you might see:
- `+33749965767` (French number)
- `+221771234567` (Senegalese number)
- `whatsapp:+33749965767` (with whatsapp: prefix)

### Step 2: Update Your Environment Variables

Update your `.env.local` (for local) and **Vercel environment variables** (for production) to match **EXACTLY**:

```env
# Example - use the EXACT format from Twilio Console
STAFF_WHATSAPP_1=+33749965767
STAFF_WHATSAPP_2=+221771234567
```

**Important:**
- ✅ Use the **exact format** shown in Twilio Console
- ✅ Include the `+` and country code
- ✅ No spaces, dashes, or parentheses
- ✅ Don't include `whatsapp:` prefix in the env variable (the code adds it)

### Step 3: Verify the Format

After updating, the code will normalize the number. Check your server logs - you'll see:
```
📤 Attempting to send to: whatsapp:+33749965767 (normalized from: +33749965767)
```

The normalized format should match what's in Twilio Console.

### Step 4: Redeploy (for production)

If you're on Vercel:
1. Update environment variables in Vercel dashboard
2. Redeploy your site

## 🔍 Common Format Issues

### Issue 1: Missing Country Code
❌ Wrong: `7749965767`  
✅ Correct: `+33749965767`

### Issue 2: Wrong Country Code
❌ Wrong: `2217749965767` (if it's a French number)  
✅ Correct: `+33749965767`

### Issue 3: Spaces or Dashes
❌ Wrong: `+33 7 49 96 57 67` or `+33-7-49-96-57-67`  
✅ Correct: `+33749965767`

### Issue 4: Different Format Than Joined
If staff joined with `+33749965767` but your env has `0033749965767`, it won't work!

## 📋 Quick Checklist

- [ ] Check Twilio Console → Sandbox Participants
- [ ] Copy the EXACT number format shown
- [ ] Update `.env.local` with that exact format
- [ ] Update Vercel environment variables (for production)
- [ ] Redeploy (for production)
- [ ] Test by placing an order
- [ ] Check server logs for the normalized format

## 🧪 Testing

After updating, place a test order and check your logs. You should see:

```
📤 Attempting to send to: whatsapp:+33749965767 (normalized from: +33749965767)
✅ WhatsApp message sent successfully to whatsapp:+33749965767
```

If you still see error 63015, the format still doesn't match. Double-check Twilio Console!

## 💡 Pro Tip

**The easiest way:** Have each staff member tell you their phone number in international format (with country code), then:
1. Check Twilio Console to see how it appears there
2. Use that EXACT format in your environment variables

---

**Still having issues?** Check the server logs - they now show exactly what format is being sent, so you can compare it to Twilio Console.

