# Sanity CMS & Paystack Setup

## 1. Create a Sanity project

1. Go to [sanity.io/manage](https://www.sanity.io/manage) and create a project.
2. Copy the **Project ID** and set `production` as the dataset (default).
3. Copy `.env.example` to `.env` in the repo root and fill in:

```env
VITE_SANITY_PROJECT_ID=abc123xyz
VITE_SANITY_DATASET=production
SANITY_STUDIO_PROJECT_ID=abc123xyz
SANITY_STUDIO_DATASET=production
```

4. Create an API token with **Editor** permissions at Project → API → Tokens. Add to `.env`:

```env
SANITY_API_TOKEN=sk...
```

## 2. Run Sanity Studio locally

```bash
npm run studio
```

Opens at `http://localhost:3333`. Edit all page content, products, shipping, and site settings.

## 3. Deploy Studio to Sanity (hosted)

From the project root:

```bash
npm run studio:deploy
```

This project is deployed at **https://tandtcompany.sanity.studio/**

To redeploy after schema changes: `npm run studio:deploy`

Optional: set `SANITY_STUDIO_HOSTNAME=tandtcompany` in `sanity/.env` before deploy.

## 4. Seed initial content (optional)

After configuring `.env` with `SANITY_API_TOKEN`:

```bash
cd sanity
npm run seed
```

This creates singleton documents (home, about, shop, contact, terms, site settings), sample products, shipping options, and testimonials.

Upload product images in Studio after seeding.

## 5. Paystack

1. Create an account at [paystack.com](https://paystack.com) and enable **ZAR**.
2. Copy **Public Key** → `VITE_PAYSTACK_PUBLIC_KEY` in `.env`.
3. Copy **Secret Key** → `PAYSTACK_SECRET_KEY` in `.env` (and in Vercel/hosting env vars).

### Local development

The Vite dev server proxies `POST /api/paystack/initialize` using `PAYSTACK_SECRET_KEY` from `.env`.

### Production (Vercel)

Deploy with `api/paystack/initialize.ts` as a serverless function. Set `PAYSTACK_SECRET_KEY` in Vercel environment variables.

### Checkout flow

1. Customer completes delivery form and clicks **Complete Purchase**.
2. Server initializes transaction via Paystack API.
3. Paystack popup opens for card / bank / mobile payment.
4. On success, cart clears and user lands on `/confirmation`.

Without Paystack keys, checkout falls back to mock order flow (for local UI testing).

## 6. Run the storefront

```bash
npm run dev
```

Storefront: `http://localhost:8080`  
Studio: `npm run studio` → `http://localhost:3333`

## Content model overview

| Document | Type | Purpose |
|----------|------|---------|
| Site Settings | Singleton | Announcements, trust strip, footer, tax, shipping refs |
| Home Page | Singleton | Hero, sections, featured products |
| About / Shop / Contact / Terms | Singleton | Page-specific copy |
| Product | Document | Catalog (replaces hardcoded `products.ts`) |
| Product Category | Document | Apparel, Accessories, Lifestyle |
| Testimonial | Document | Home page reviews |
| Shipping Option | Document | Checkout delivery choices |
