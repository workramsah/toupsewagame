/**
 * Send WhatsApp message via Twilio API
 * Requires: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM in .env
 * TWILIO_WHATSAPP_FROM: Your Twilio WhatsApp number (e.g. whatsapp:+14155238886 for sandbox)
 */
const BUSINESS_NUMBER = '+9779766177585';

function formatWhatsAppNumber(num) {
  if (!num || typeof num !== 'string') return null;
  let n = num.replace(/\D/g, '');
  if (n.startsWith('977')) {
    return `+${n}`;
  }
  if (n.startsWith('0')) {
    n = n.slice(1);
  }
  if (n.length === 10) {
    return `+977${n}`;
  }
  return n ? `+${n}` : null;
}

export async function sendWhatsAppOrderConfirmation({ toNumber, uid }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !fromNumber) {
    console.warn('[whatsapp] Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM in .env');
    return { success: false, reason: 'not_configured' };
  }

  const to = formatWhatsAppNumber(toNumber);
  if (!to) {
    return { success: false, reason: 'invalid_number' };
  }

  const body = `Order is placed on toupsewagame. Your UID: ${uid}. Contact us: ${BUSINESS_NUMBER}`;
  const from = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`;
  const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const params = new URLSearchParams();
    params.set('From', from);
    params.set('To', toFormatted);
    params.set('Body', body);

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    const data = await res.json();
    if (res.ok) {
      return { success: true, sid: data.sid };
    }
    console.error('[whatsapp] Twilio error:', data);
    return { success: false, reason: data.message || 'send_failed' };
  } catch (err) {
    console.error('[whatsapp] Error:', err);
    return { success: false, reason: err.message || 'network_error' };
  }
}