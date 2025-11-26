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
