import crypto from 'crypto';
import Razorpay from 'razorpay';
import nodemailer from 'nodemailer';
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

const getGoogleSheetsClient = async () => {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

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
        'Check your email inbox for course access details (sent within 24 hours)',
        'Join our private Discord community (invite link will be emailed)',
        'Download the course materials and RAW practice files',
        'Start with Lesson 1: Essential DSLR Gear and Tripod Setup',
      ],
      supportEmail: process.env.SUPPORT_EMAIL || 'support@yourdomain.com',
    },
    mobile: {
      title: 'Mobile Astrophotography',
      nextSteps: [
        'Check your email inbox for course access details (sent within 24 hours)',
        'Download the bonus materials: cheat sheet, RAW files, and star maps',
        'Install recommended apps: NightCap Camera and PhotoPills',
        'Start planning your first shoot using the course planning guide',
      ],
      supportEmail: process.env.SUPPORT_EMAIL || 'support@yourdomain.com',
    },
  };

  const info = courseInfo[courseSlug] || { title: courseTitle || 'Course', nextSteps: [], supportEmail: process.env.SUPPORT_EMAIL || 'support@yourdomain.com' };

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await readJsonBody(req);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      sendJson(res, 400, { verified: false, error: 'Missing payment details' });
      return;
    }

    if (!process.env.RAZORPAY_KEY_SECRET || !process.env.RAZORPAY_KEY_ID) {
      sendJson(res, 500, { verified: false, error: 'Server misconfigured: missing Razorpay keys' });
      return;
    }

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    const isVerified = generatedSignature === razorpay_signature;

    if (!isVerified) {
      sendJson(res, 400, { verified: false, error: 'Invalid signature' });
      return;
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.fetch(razorpay_order_id);
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    const enrollmentData = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      courseSlug: order.notes?.courseSlug || 'unknown',
      courseTitle: order.notes?.courseTitle || 'Course',
      name: order.notes?.name || payment.notes?.name || 'Unknown',
      email: order.notes?.email || payment.email || 'unknown@example.com',
      phone: order.notes?.contact || payment.contact || '',
      smartphone: order.notes?.smartphone || '',
      amount: order.amount,
      currency: order.currency,
    };

    let sheetsWarning;
    try {
      const sheetResult = await appendEnrollmentToSheet(enrollmentData);
      if (!sheetResult.success && !sheetResult.skipped) {
        sheetsWarning = 'Payment verified but saving enrollment to sheet failed';
      }
      if (sheetResult.skipped) {
        sheetsWarning = 'Payment verified but Google Sheets is not configured';
      }
    } catch (sheetError) {
      console.error('Google Sheets append failed:', sheetError);
      sheetsWarning = 'Payment verified but saving enrollment to sheet failed';
    }

    const transporter = createTransporter();
    if (!transporter) {
      sendJson(res, 200, {
        verified: true,
        paymentId: razorpay_payment_id,
        warning: sheetsWarning || 'Payment verified but email service is not configured on server',
      });
      return;
    }

    const mail = buildEnrollmentEmail(enrollmentData);

    try {
      const info = await transporter.sendMail(mail);
      sendJson(res, 200, {
        verified: true,
        paymentId: razorpay_payment_id,
        emailMessageId: info.messageId,
        ...(sheetsWarning ? { warning: sheetsWarning } : {}),
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      sendJson(res, 200, {
        verified: true,
        paymentId: razorpay_payment_id,
        warning: sheetsWarning ? `${sheetsWarning}. Email sending failed.` : 'Payment verified but email sending failed',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    sendJson(res, 500, { verified: false, error: error?.message || 'Payment verification failed' });
  }
}
