import crypto from 'crypto';
import Razorpay from 'razorpay';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const readRawBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

const sendJson = (res, statusCode, body) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
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
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
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

const wasPaymentAlreadyProcessed = async ({ courseSlug, paymentId }) => {
  const client = await getGoogleSheetsClient();
  if (!client) return null;

  const { spreadsheetId, sheets } = client;
  const sheetName = resolveSheetTabName(courseSlug);

  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!K:K`,
  });

  const values = resp.data?.values || [];
  const needle = String(paymentId || '').trim();
  return values.some((row) => (row?.[0] ? String(row[0]).trim() : '') === needle);
};

const appendEnrollmentToSheet = async (enrollmentData) => {
  const client = await getGoogleSheetsClient();
  if (!client) return { success: false, skipped: true, error: 'Google Sheets not configured' };

  const { spreadsheetId, sheets } = client;
  const sheetName = resolveSheetTabName(enrollmentData.courseSlug);

  const values = [
    [
      new Date().toISOString(),
      enrollmentData.courseSlug,
      enrollmentData.courseTitle,
      enrollmentData.name,
      enrollmentData.email,
      enrollmentData.phone,
      enrollmentData.smartphone || '',
      enrollmentData.amount,
      enrollmentData.currency,
      enrollmentData.orderId,
      enrollmentData.paymentId,
      enrollmentData.coupon || '',
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values },
  });

  return { success: true };
};

const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  return null;
};

const buildEnrollmentEmail = ({ name, email, courseTitle, courseSlug, paymentId }) => {
  const courseInfo = {
    masterclass: {
      title: 'Astrophotography Masterclass',
      nextSteps: [
        'Zoom link will be shared 2 days before the start of the course',
        'Block your calendar for the live session schedule mentioned below',
        'Download the course materials and RAW practice files (shared via email)',
      ],
      scheduleLines: [
        'Batch 1 starts: 28 Feb (Saturday)',
        'Schedule: Every weekend (Sat & Sun), one session per day',
        'Total: 8 sessions across 4 weekends (≈ 1 month)',
        'Time: 11:00 AM',
        'Platform: Zoom',
        'Recording: Included for all live sessions',
      ],
      supportEmail: process.env.SUPPORT_EMAIL || 'support@yourdomain.com',
    },
    mobile: {
      title: 'Mobile Astrophotography',
      nextSteps: [
        'Zoom link will be shared 2 days before the start of the course',
        'Block your calendar for the live session time mentioned below',
        'Keep your phone charged and ready before the session',
      ],
      scheduleLines: ['Batch 1: 1 Mar (Sunday)', 'Time: 4:00 PM', 'Duration: 1 to 1.5 hours (single session)', 'Platform: Zoom'],
      supportEmail: process.env.SUPPORT_EMAIL || 'support@yourdomain.com',
    },
  };

  const info = courseInfo[courseSlug] || {
    title: courseTitle || 'Course',
    nextSteps: [],
    scheduleLines: [],
    supportEmail: process.env.SUPPORT_EMAIL || 'support@yourdomain.com',
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .success-icon { font-size: 48px; margin-bottom: 10px; }
        h1 { margin: 0; font-size: 24px; }
        h2 { color: #667eea; margin-top: 30px; }
        .next-steps { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .next-steps ol { margin: 10px 0; padding-left: 20px; }
        .next-steps li { margin: 8px 0; }
        .payment-info { background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">✓</div>
          <h1>Welcome to ${info.title}!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for enrolling in <strong>${info.title}</strong>! Your payment has been confirmed and you're all set to begin your astrophotography journey.</p>
          <div class="payment-info">
            <strong>Payment Details:</strong><br>
            Payment ID: ${paymentId}<br>
            Status: ✅ Confirmed
          </div>
          ${info.nextSteps.length ? `<h2>What's Next?</h2>
          <div class="next-steps">
            <ol>
              ${info.nextSteps.map((step) => `<li>${step}</li>`).join('')}
            </ol>
          </div>` : ''}
          ${info.scheduleLines.length ? `<h2>Live Session Schedule</h2>
          <div class="next-steps">
            <ul>
              ${info.scheduleLines.map((line) => `<li>${line}</li>`).join('')}
            </ul>
          </div>` : ''}
          <h2>Need Help?</h2>
          <p>If you have any questions or need assistance, feel free to reach out:</p>
          <ul>
            <li>Email: <a href="mailto:${info.supportEmail}">${info.supportEmail}</a></li>
            <li>WhatsApp: <a href="https://wa.me/919930108404">+91 9930108404</a></li>
          </ul>
          <p>Clear skies,<br><strong>Prashant Saundalkar</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated confirmation email. Please do not reply directly to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Hi ${name},

Thank you for enrolling in ${info.title}! Your payment has been confirmed.

Payment ID: ${paymentId}
Status: Confirmed

Live Session Schedule:
${info.scheduleLines.map((l) => `- ${l}`).join('\n')}

Need Help?
Email: ${info.supportEmail}
WhatsApp: +91 9930108404

Clear skies,
Prashant Saundalkar
  `.trim();

  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const fromName = process.env.EMAIL_FROM_NAME || 'Prashant Saundalkar';

  return {
    to: email,
    subject: `Welcome to ${info.title}! 🎉`,
    html,
    text,
    from: `"${fromName}" <${fromAddress}>`,
  };
};

const validateWebhookSignature = (rawBody, signature) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return expected === signature;
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'Method not allowed' });
    return;
  }

  const signature = req.headers['x-razorpay-signature'];
  const raw = await readRawBody(req);

  if (!signature || !validateWebhookSignature(raw, signature)) {
    sendJson(res, 401, { ok: false, error: 'Invalid webhook signature' });
    return;
  }

  let payload;
  try {
    payload = JSON.parse(raw.toString('utf8'));
  } catch {
    sendJson(res, 400, { ok: false, error: 'Invalid JSON' });
    return;
  }

  const event = payload?.event;
  if (event !== 'payment.captured') {
    sendJson(res, 200, { ok: true, ignored: true, event });
    return;
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    sendJson(res, 500, { ok: false, error: 'Server misconfigured: missing Razorpay keys' });
    return;
  }

  const paymentEntity = payload?.payload?.payment?.entity;
  const orderId = paymentEntity?.order_id;
  const paymentId = paymentEntity?.id;

  if (!orderId || !paymentId) {
    sendJson(res, 400, { ok: false, error: 'Missing payment/order information' });
    return;
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  let order;
  try {
    order = await razorpay.orders.fetch(orderId);
  } catch (e) {
    console.error('Webhook: order fetch failed', e);
    sendJson(res, 500, { ok: false, error: 'Failed to fetch order' });
    return;
  }

  const enrollmentData = {
    orderId,
    paymentId,
    courseSlug: order.notes?.courseSlug || 'unknown',
    courseTitle: order.notes?.courseTitle || 'Course',
    name: order.notes?.name || paymentEntity?.notes?.name || 'Unknown',
    email: order.notes?.email || paymentEntity?.email || 'unknown@example.com',
    phone: order.notes?.contact || paymentEntity?.contact || '',
    smartphone: order.notes?.smartphone || '',
    coupon: order.notes?.coupon || '',
    amount: order.amount,
    currency: order.currency,
  };

  let alreadyProcessed;
  try {
    alreadyProcessed = await wasPaymentAlreadyProcessed({
      courseSlug: enrollmentData.courseSlug,
      paymentId: enrollmentData.paymentId,
    });
  } catch (e) {
    console.error('Webhook: dedupe check failed', e);
  }

  if (alreadyProcessed) {
    sendJson(res, 200, { ok: true, deduped: true });
    return;
  }

  try {
    await appendEnrollmentToSheet(enrollmentData);
  } catch (e) {
    console.error('Webhook: Google Sheets append failed', e);
  }

  const transporter = createTransporter();
  if (transporter) {
    try {
      const mail = buildEnrollmentEmail(enrollmentData);
      await transporter.sendMail(mail);
    } catch (e) {
      console.error('Webhook: email send failed', e);
    }
  }

  sendJson(res, 200, { ok: true });
}
