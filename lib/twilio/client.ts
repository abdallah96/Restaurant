import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

let client: ReturnType<typeof twilio> | null = null;

export function getTwilioClient() {
  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured');
    return null;
  }

  if (!client) {
    client = twilio(accountSid, authToken);
  }

  return client;
}

/**
 * Get all staff WhatsApp numbers from environment variables
 * Supports STAFF_WHATSAPP_1, STAFF_WHATSAPP_2, STAFF_WHATSAPP_3, etc.
 */
export function getStaffWhatsAppNumbers(): string[] {
  const staffNumbers: string[] = [];
  
  // Check for numbered staff variables
  let index = 1;
  while (index <= 20) { // Support up to 20 staff members
    const numberKey = `STAFF_WHATSAPP_${index}`;
    const number = process.env[numberKey];
    
    if (number && number.trim()) {
      staffNumbers.push(number.trim());
    }
    index++;
  }
  
  return staffNumbers;
}

export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<boolean> {
  const client = getTwilioClient();
  
  if (!client || !whatsappNumber) {
    console.error('Twilio not configured properly');
    return false;
  }

  try {
    // Format phone number for WhatsApp (must include country code)
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const formattedFrom = whatsappNumber.startsWith('whatsapp:') 
      ? whatsappNumber 
      : `whatsapp:${whatsappNumber}`;

    await client.messages.create({
      body: message,
      from: formattedFrom,
      to: formattedTo,
    });

    console.log(`WhatsApp message sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}

/**
 * Send WhatsApp message to all staff members
 */
export async function notifyAllStaff(message: string): Promise<void> {
  const staffNumbers = getStaffWhatsAppNumbers();
  
  if (staffNumbers.length === 0) {
    console.warn('⚠️ No staff WhatsApp numbers configured. Add STAFF_WHATSAPP_1, STAFF_WHATSAPP_2, etc. to .env.local');
    return;
  }
  
  console.log(`📤 Sending notification to ${staffNumbers.length} staff member(s)...`);
  
  const promises = staffNumbers.map(async (number, index) => {
    try {
      await sendWhatsAppMessage(number, message);
      console.log(`✅ Notification sent to staff ${index + 1}: ${number}`);
    } catch (error) {
      console.error(`❌ Failed to notify staff ${index + 1} (${number}):`, error);
    }
  });
  
  await Promise.allSettled(promises);
}

export function formatOrderStatusMessage(
  orderNumber: string,
  status: string,
  customerName: string,
  totalAmount: number
): string {
  const statusMessages: Record<string, string> = {
    confirmed: '✅ *Commande Confirmée*',
    preparing: '👨‍🍳 *En Préparation*',
    ready: '🎉 *Commande Prête*',
    delivered: '✅ *Livrée*',
    cancelled: '❌ *Annulée*',
  };

  const statusText = statusMessages[status] || status;
  
  return `
🍴 *Restaurant Sénégalais*

${statusText}

Bonjour ${customerName},

📦 Commande: #${orderNumber}
💰 Montant: ${totalAmount.toLocaleString()} FCFA

${
  status === 'confirmed' 
    ? 'Votre commande a été confirmée et sera bientôt préparée.' 
    : status === 'preparing'
    ? 'Notre équipe prépare votre commande avec soin.'
    : status === 'ready'
    ? 'Votre commande est prête ! Vous pouvez venir la récupérer ou elle sera bientôt livrée.'
    : status === 'delivered'
    ? 'Votre commande a été livrée. Bon appétit ! 🍽️'
    : status === 'cancelled'
    ? 'Votre commande a été annulée. Contactez-nous pour plus d\'informations.'
    : ''
}

Merci de votre confiance ! 🙏
`.trim();
}
