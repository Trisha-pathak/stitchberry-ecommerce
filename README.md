# StitchBerry — Handmade Crochet & Custom Embroidery Platform

A full-stack, animated pastel e-commerce and custom service platform built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Prisma ORM**.

## Database Setup & Recommendation

- **Local Development (Out of the box):** Configured with **SQLite** via Prisma (`prisma/schema.prisma`, `DATABASE_URL="file:./dev.db"`) so you can run, seed, and test every workflow immediately without external database setup.
- **Recommended Production Database:** **PostgreSQL (Supabase or Neon)** paired with **Prisma ORM** and **Supabase Storage / Cloudinary** for customer garment/inspiration photos. A mirror schema is provided in `prisma/schema.postgresql.prisma`. To switch:
  1. Set `provider = "postgresql"` in `prisma/schema.prisma` (or copy `prisma/schema.postgresql.prisma`).
  2. Update `DATABASE_URL` in `.env` to your PostgreSQL/Supabase connection string.
  3. Run `npx prisma db push && npm run db:seed`.

## Quick Start

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

## Razorpay Configuration

Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env` to activate live Razorpay orders via `/api/payments/razorpay`. Without secret keys, checkout runs in deterministic sandbox mode for local testing.
