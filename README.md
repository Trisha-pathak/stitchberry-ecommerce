# StitchBerry — Handmade Crochet & Custom Embroidery Platform

A full-stack, animated pastel e-commerce and custom service platform built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Prisma ORM**.

## Hosting on Vercel (Recommended)

Because Vercel uses serverless functions (which cannot persist a local SQLite file), host StitchBerry with a **PostgreSQL** database (such as **Neon** or **Supabase** from Vercel's Storage Marketplace):

1. **Import on Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new) and import `Trisha-pathak/stitchberry-ecommerce`.
2. **Attach PostgreSQL & Environment Variables:**
   - In your Vercel project, go to **Storage → Create Database → Neon / Supabase Postgres** (or paste your PostgreSQL URL as `DATABASE_URL`).
   - Add `JWT_SECRET` (any long random string) in **Settings → Environment Variables**.
   - Optional: Add **Vercel Blob** (`BLOB_READ_WRITE_TOKEN`) for cloud image uploads, and `NEXT_PUBLIC_RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` for live Razorpay payments.
   - `scripts/prepare-db.mjs` automatically switches Prisma to `provider = "postgresql"` whenever `DATABASE_URL` starts with `postgres://` or `postgresql://` during `npm run build`.
3. **Push Schema & Seed Initial Catalog (once):**
   Run locally using your production `DATABASE_URL`:
   ```bash
   set DATABASE_URL="postgresql://..."
   npx prisma db push
   npm run db:seed
   ```
   *(On PowerShell: `$env:DATABASE_URL="postgresql://..."; npm run db:push; npm run db:seed`)*

## Local Development

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Demo Accounts

- **Customer:** `ananya@stitchberry.in` / `pastel123`
- **Admin:** `admin@stitchberry.in` / `admin123`

## Sample Tracking Codes

- Ready-Made Order: `SB-ORD-1001`
- Custom Crochet Pre-Order: `SB-PRE-2041`
- Custom Embroidery Booking: `SB-EMB-3012`

## Coupons (Ready-Made Checkout)

- `STITCH10` — 10% off
- `PASTEL15` — 15% off
- `FREESHIP` — Free shipping
