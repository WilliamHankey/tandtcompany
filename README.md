# T & T Company

T & T Company is a faith-led South African lifestyle and apparel storefront. The site combines a responsive React shopping experience with Sanity-managed content and Paystack payments in South African rand (ZAR).

## Features

- Responsive storefront with home, about, shop, product, cart, checkout, confirmation, contact, and terms pages
- Product catalogue and editorial content managed through Sanity
- Local fallback content when Sanity is not configured or unavailable
- Product filtering and individual product pages
- Persistent browser cart backed by `localStorage`
- Delivery options, order totals, and secure Paystack checkout
- Contact links and business details managed through Sanity
- Separate Sanity Studio for content editors

## Tech stack

- React 18 and TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui and Radix UI
- Sanity
- Paystack Inline
- React Hook Form and Zod
- Vitest and Testing Library
- ESLint

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm
- A Sanity project for CMS-backed content
- A Paystack account for checkout testing

### Installation

```bash
git clone https://github.com/WilliamHankey/tandtcompany.git
cd tandtcompany
npm install
cp .env.example .env
npm run dev
```

The Vite development server runs at [http://localhost:8080](http://localhost:8080).

On Windows PowerShell, create the environment file with:

```powershell
Copy-Item .env.example .env
```

## Environment variables

Copy `.env.example` to `.env` and replace the placeholder values.

| Variable | Used by | Purpose |
| --- | --- | --- |
| `VITE_SANITY_PROJECT_ID` | Storefront | Sanity project ID |
| `VITE_SANITY_DATASET` | Storefront | Sanity dataset; defaults to `production` |
| `VITE_SANITY_API_VERSION` | Storefront | Sanity API version |
| `SANITY_STUDIO_PROJECT_ID` | Sanity Studio | Project used by the Studio |
| `SANITY_STUDIO_DATASET` | Sanity Studio | Dataset used by the Studio |
| `SANITY_STUDIO_HOSTNAME` | Sanity Studio | Hosted Studio subdomain |
| `SANITY_API_TOKEN` | Setup scripts | Write token used to seed content and configure CORS |
| `VITE_PAYSTACK_PUBLIC_KEY` | Browser | Paystack public key |
| `PAYSTACK_SECRET_KEY` | Server only | Paystack secret key used by payment API handlers |

Never expose `PAYSTACK_SECRET_KEY` or `SANITY_API_TOKEN` in client-side code or commit a populated `.env` file.

## Sanity CMS

The Studio lives in the `sanity/` directory and uses the same project and dataset as the storefront.

```bash
npm run studio
npm run sanity:seed
npm run sanity:setup
npm run studio:build
npm run studio:deploy
```

The storefront continues to render its bundled fallback products and content when `VITE_SANITY_PROJECT_ID` is not set. Sanity content takes precedence when the CMS is configured and contains matching documents.

## Payments

Checkout uses Paystack Inline and charges in ZAR. The browser calls:

- `POST /api/paystack/initialize`
- `POST /api/paystack/verify`

Keep the Paystack secret key in the server environment. The Vite development configuration includes local payment-initialization middleware, while production must expose the payment API handlers and make both routes available over HTTPS. Use Paystack test keys during development and verify the complete successful-payment flow before enabling live keys.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run build:dev` | Build using Vite's development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run studio` | Start Sanity Studio |
| `npm run studio:build` | Build Sanity Studio |
| `npm run studio:deploy` | Deploy Sanity Studio |
| `npm run sanity:seed` | Seed the Sanity dataset |
| `npm run sanity:setup` | Configure Sanity CORS and seed content |

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Storefront home page |
| `/about` | Brand and founder story |
| `/shop` | Product catalogue |
| `/shop/:slug` | Product details |
| `/cart` | Shopping cart |
| `/checkout` | Delivery details and payment |
| `/confirmation` | Successful-order confirmation |
| `/contact` | Contact details and enquiry form |
| `/terms` | Store terms |
| `*` | Not-found page |

## Project structure

```text
.
├── public/                 Static public assets
├── sanity/                 Sanity Studio, schemas, structure, and setup scripts
├── src/
│   ├── assets/             Bundled images and visual assets
│   ├── components/         Storefront and reusable UI components
│   ├── context/            Cart state and persistence
│   ├── data/               Fallback catalogue content
│   ├── hooks/              Sanity-backed data hooks
│   ├── lib/                Sanity and Paystack clients
│   ├── pages/              Route-level page components
│   ├── types/              Shared TypeScript types
│   ├── App.tsx             Providers and application routes
│   └── main.tsx            Browser entry point
├── .env.example            Environment-variable template
├── package.json            Dependencies and scripts
└── vite.config.ts          Vite configuration and local payment middleware
```

## Quality checks

```bash
npm run lint
npm test
npm run build
```

Also test Sanity and fallback content, cart persistence, delivery totals, Paystack success/cancellation/failure, and responsive navigation and checkout.

## Deployment notes

- Configure all required environment variables in the hosting platform.
- Serve the SPA with history fallback so React Router routes resolve.
- Provide secure server-side Paystack initialization and verification handlers.
- Add the production storefront origin to Sanity CORS.
- Confirm the Sanity dataset is populated and readable.
- Exercise checkout with Paystack test keys before switching to live keys.

## License

No license file is currently included. Unless the repository owner states otherwise, the source code remains all rights reserved.
