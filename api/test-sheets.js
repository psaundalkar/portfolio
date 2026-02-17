import { google } from 'googleapis';

const sendJson = (res, statusCode, body) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

const getAuth = async () => {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!spreadsheetId || !clientEmail || !privateKey) {
    return { ok: false, error: 'Missing GOOGLE_SHEETS_SPREADSHEET_ID / GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY' };
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  await auth.authorize();

  return {
    ok: true,
    spreadsheetId,
    sheets: google.sheets({ version: 'v4', auth }),
  };
};

const getTokenFromReq = (req) => {
  const header = req.headers['x-test-token'];
  if (typeof header === 'string' && header.trim()) return header.trim();

  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    return url.searchParams.get('token') || '';
  } catch {
    return '';
  }
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { ok: false, error: 'Method not allowed' });
    return;
  }

  const expectedToken = process.env.TEST_SHEETS_TOKEN;
  if (!expectedToken) {
    sendJson(res, 500, { ok: false, error: 'Server misconfigured: missing TEST_SHEETS_TOKEN' });
    return;
  }

  const providedToken = getTokenFromReq(req);
  if (providedToken !== expectedToken) {
    sendJson(res, 403, { ok: false, error: 'Forbidden' });
    return;
  }

  let tab = 'DSLR';
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    tab = url.searchParams.get('tab') || tab;
  } catch {
    // ignore
  }

  try {
    const auth = await getAuth();
    if (!auth.ok) {
      sendJson(res, 500, { ok: false, error: auth.error });
      return;
    }

    const values = [
      [
        new Date().toISOString(),
        'test',
        'Test Course',
        'Test User',
        'test@example.com',
        '9999999999',
        'iPhone',
        123,
        'INR',
        'order_test',
        'pay_test',
      ],
    ];

    const result = await auth.sheets.spreadsheets.values.append({
      spreadsheetId: auth.spreadsheetId,
      range: `${tab}!A1`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });

    sendJson(res, 200, {
      ok: true,
      tab,
      updates: result.data?.updates || null,
    });
  } catch (error) {
    console.error('Sheets test failed:', error);
    sendJson(res, 500, {
      ok: false,
      error: error?.message || 'Sheets test failed',
      details: {
        code: error?.code,
        status: error?.response?.status,
        data: error?.response?.data,
      },
    });
  }
}
