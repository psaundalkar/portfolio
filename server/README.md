# Course payment server

This server creates Razorpay orders and verifies payment signatures for course enrollment.

## Setup

1. **Razorpay account**  
   Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com/) and get your API keys from [API Keys](https://dashboard.razorpay.com/app/keys).

2. **Environment**  
   From the `server` folder, copy `.env.example` to `.env` and set:

   - `RAZORPAY_KEY_ID` – your Razorpay key id (e.g. `rzp_test_...`)
   - `RAZORPAY_KEY_SECRET` – your Razorpay key secret

   For production, use **Live** keys from the dashboard.

3. **Install and run**

   ```bash
   cd server
   npm install
   npm run dev
   ```

   Server runs at `http://localhost:3001`. The Vite dev server proxies `/api` to this port.

## Endpoints

- `POST /api/create-order` – Body: `{ amount, currency?, courseSlug, name, email, contact? }`. Returns `{ orderId, keyId, amount, currency }`.
- `POST /api/verify-payment` – Body: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`. Returns `{ verified, orderId, paymentId }`.

## Running frontend and server together

- Terminal 1: `npm run dev` (Vite, port 5173)
- Terminal 2: `cd server && npm run dev` (API, port 3001)

Enroll on a paid course; the “Proceed to Pay” flow uses Razorpay Checkout and then verification via this server.
