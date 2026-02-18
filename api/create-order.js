import Razorpay from 'razorpay';
import { google } from 'googleapis';

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

const serializeRazorpayError = (err) => {
  if (!err) return null;
  const e = err;

  const razorpayPayload = e?.error || e?.response?.data?.error || null;
  const details = {
    name: e?.name,
    message: e?.message,
    statusCode: e?.statusCode,
    code: razorpayPayload?.code || e?.code,
    description: razorpayPayload?.description,
    field: razorpayPayload?.field,
    source: razorpayPayload?.source,
    step: razorpayPayload?.step,
    reason: razorpayPayload?.reason,
  };

  Object.keys(details).forEach((k) => {
    if (details[k] === undefined) delete details[k];
  });

  return details;
};

const normalizePrivateKey = (value) => {
  if (!value) return '';
  let v = String(value).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  return v.replace(/\\n/g, '\n');
};

const getGoogleSheetsClient = async () => {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY);

  if (!spreadsheetId || !clientEmail || !privateKey) return null;

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  await auth.authorize();

  return {
    spreadsheetId,
    sheets: google.sheets({ version: 'v4', auth }),
  };
};

const resolveSheetTabName = (courseSlug) => {
  const dslrTab = process.env.GOOGLE_SHEETS_TAB_DSLR || 'DSLR';
  const smartphoneTab = process.env.GOOGLE_SHEETS_TAB_SMARTPHONE || 'Smartphone';

  if (courseSlug === 'mobile') return smartphoneTab;
  return dslrTab;
};

const MASTERCLASS_ONE_TIME_COUPONS = new Set([
  'AM200-7K3P9Q',
  'AM200-X2M8LD',
  'AM200-Q5R1TF',
  'AM200-N9V4ZA',
  'AM200-H6C3WJ',
  'AM200-P8D2YU',
  'AM200-B1G7SN',
  'AM200-K4J9ER',
  'AM200-T6Z3HC',
  'AM200-M2F8VP',
]);

const isCouponUsed = async ({ courseSlug, coupon }) => {
  const client = await getGoogleSheetsClient();
  if (!client) return null;

  const sheetName = resolveSheetTabName(courseSlug);
  const { spreadsheetId, sheets } = client;

  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!L:L`,
  });

  const values = resp.data?.values || [];
  const normalizedCoupon = String(coupon || '').trim().toUpperCase();
  return values.some((row) => (row?.[0] ? String(row[0]).trim().toUpperCase() : '') === normalizedCoupon);
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
    const { amount, currency, courseSlug, name, email, contact, smartphone, coupon } = await readJsonBody(req);

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

    const normalizedCoupon = coupon ? String(coupon).trim().toUpperCase() : '';
    const wantsCoupon = Boolean(normalizedCoupon);
    const isMasterclass = courseSlug === 'masterclass';

    if (wantsCoupon && !isMasterclass) {
      sendJson(res, 400, { error: 'Coupon codes are only available for the Astrophotography Masterclass.' });
      return;
    }

    let finalAmount = amount;
    if (wantsCoupon && isMasterclass) {
      if (!MASTERCLASS_ONE_TIME_COUPONS.has(normalizedCoupon)) {
        sendJson(res, 400, { error: 'Invalid coupon code.' });
        return;
      }

      const alreadyUsed = await isCouponUsed({ courseSlug, coupon: normalizedCoupon });
      if (alreadyUsed === null) {
        sendJson(res, 500, { error: 'Coupon validation is temporarily unavailable. Please try again later.' });
        return;
      }
      if (alreadyUsed) {
        sendJson(res, 400, { error: 'This coupon code has already been used.' });
        return;
      }

      finalAmount = 200;
    }

    const orderAmount = currency === 'INR' ? finalAmount * 100 : finalAmount;

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
        coupon: normalizedCoupon || '',
      },
    });

    sendJson(res, 200, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    const details = serializeRazorpayError(error);
    console.error('Error creating order:', details || error);
    sendJson(res, 500, {
      error:
        details?.description ||
        details?.message ||
        'Failed to create order. Please try again.',
      ...(details ? { details } : {}),
    });
  }
}
