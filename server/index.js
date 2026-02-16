import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import Razorpay from 'razorpay';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order (amount in paise)
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', courseSlug, name, email, contact } = req.body;
    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    const options = {
      amount: Math.round(Number(amount) * 100), // rupees to paise
      currency: currency || 'INR',
      receipt: `course_${courseSlug}_${Date.now()}`,
      notes: { courseSlug, name, email, contact: contact || '' },
    };
    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

// Verify payment signature
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment details' });
    }
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature', verified: false });
    }
    res.json({ verified: true, orderId: razorpay_order_id, paymentId: razorpay_payment_id });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ error: err.message || 'Verification failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
