import Razorpay from 'razorpay';

const readJsonBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return {};
  const raw = Buffer.concat(chunks).toString('utf8');
  return JSON.parse(raw);
};

const sendJson = (res, statusCode, body) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const { amount, currency, courseSlug, name, email, contact, smartphone } = await readJsonBody(req);

    if (!amount || !currency || !courseSlug) {
      sendJson(res, 400, { error: 'Missing required fields' });
      return;
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      sendJson(res, 500, { error: 'Server misconfigured: missing Razorpay keys' });
      return;
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const orderAmount = currency === 'INR' ? amount * 100 : amount;

    const courseTitles = {
      masterclass: 'Astrophotography Masterclass',
      mobile: 'Mobile Astrophotography',
    };

    const order = await razorpay.orders.create({
      amount: orderAmount,
      currency: currency.toUpperCase(),
      receipt: `course_${courseSlug}_${Date.now()}`,
      notes: {
        courseSlug,
        courseTitle: courseTitles[courseSlug] || 'Course',
        name,
        email,
        contact,
        smartphone: smartphone || '',
      },
    });

    sendJson(res, 200, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    sendJson(res, 500, { error: error?.message || 'Failed to create order. Please try again.' });
  }
}
