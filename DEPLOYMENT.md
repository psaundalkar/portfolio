# Host Your Portfolio on Your Domain (Free)

Your site is a static React app. You can host it **for free** on your own domain using either **Vercel** or **Netlify**. Both support custom domains and free SSL (HTTPS).

---

## Option 1: Vercel (recommended)

### 1. Push your code to GitHub

If you haven’t already:

```bash
git init
git add .
git commit -m "Portfolio ready for deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Create the repo on [github.com](https://github.com/new) first if needed.

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (use “Continue with GitHub”).
2. Click **Add New…** → **Project**.
3. **Import** your GitHub repo (e.g. `Portfolio`).
4. Leave defaults:
   - **Framework Preset:** Vite  
   - **Build Command:** `npm run build`  
   - **Output Directory:** `dist`
5. Click **Deploy**.  
   You’ll get a URL like `your-project.vercel.app`.

### 3. Add your custom domain

1. Open your project on Vercel → **Settings** → **Domains**.
2. Enter your domain (e.g. `yourdomain.com` or `www.yourdomain.com`) and click **Add**.
3. Vercel will show the DNS records you need.

### 4. Point your domain to Vercel

In your **domain registrar** (where you bought the domain – GoDaddy, Namecheap, Google Domains, etc.):

**For root domain (e.g. `yourdomain.com`):**

- Add an **A** record:  
  - **Name/host:** `@` (or leave blank)  
  - **Value:** `76.76.21.21`  
  - **TTL:** 3600 (or default)

**For www (e.g. `www.yourdomain.com`):**

- Add a **CNAME** record:  
  - **Name/host:** `www`  
  - **Value:** `cname.vercel-dns.com`  
  - **TTL:** 3600 (or default)

Save the records. DNS can take from a few minutes up to 48 hours. Vercel will issue a free SSL certificate automatically once DNS is correct.

---

## Option 2: Netlify

### 1. Push to GitHub (same as above)

### 2. Deploy on Netlify

1. Go to [netlify.com](https://netlify.com) and sign up (e.g. with GitHub).
2. **Add new site** → **Import an existing project** → **GitHub** → choose your repo.
3. Settings should be:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy site**. You’ll get a URL like `random-name.netlify.app`.

### 3. Add your custom domain

1. **Site settings** → **Domain management** → **Add custom domain**.
2. Enter your domain and follow the steps.
3. Netlify will show the required DNS records.

### 4. Update DNS at your registrar

- For **root domain:** use the A record Netlify gives you (e.g. `75.2.60.5`).
- For **www:** use the CNAME they give (e.g. `your-site.netlify.app`).

Save, wait for DNS to propagate, and Netlify will enable HTTPS.

---

## Notes

- **Course payment (Razorpay):** The payment flow uses a backend on `localhost:3001`. For production you’ll need to deploy the `server/` (e.g. Railway, Render, Fly.io) and set your frontend’s API base URL to that server. The static site host (Vercel/Netlify) only serves the built frontend.
- **SSL:** Both Vercel and Netlify provide free HTTPS for your custom domain.
- **Build:** Always run `npm run build` locally to confirm it succeeds before pushing.

Once DNS is set and the build is green, your portfolio will be live at your domain.
