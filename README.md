# TapLink — NFC + QR Digital Business Profile Platform

> **One Tap. Everything Connected.**

Production Domain: **`https://taplink.in`**  
Customer Profile Schema: **`https://taplink.in/[username]`** (e.g. `/rahul`, `/abc-salon`, `/sharma-cafe`)

---

## ⚡ Overview

**TapLink** is a production-grade SaaS web application built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL (via Prisma ORM / Supabase). It empowers businesses and professionals to replace paper business cards with NFC contactless smart cards and dynamic QR codes that link directly to a unified digital business profile.

---

## 🌟 Key Features

1. **Custom Dynamic Profiles (`/[username]`)**
   - Direct, mobile-first digital profile cards.
   - Dynamic buttons:
     - **WhatsApp**: Click-to-chat `https://wa.me/[number]?text=[message]` with pre-filled inquiry.
     - **Call Me**: Instant `tel:[phone]` direct dialing.
     - **Google Review**: 5-Star review link to booster ratings.
     - **Get Directions**: Google Maps location pin.
     - **UPI Payment**: Instant 0%-fee UPI payments (`upi://pay?pa=...`) with copy UPI ID and QR modal.
     - **Social Media**: Instagram, Facebook, YouTube, Website links.
     - **Save Contact (vCard)**: 1-click `.vcf` download to add directly into phone address book.
     - **Share Profile**: Native mobile Web Share API + Copy link.

2. **Public SaaS Homepage (`/`)**
   - Brand headline: *"One Tap. Everything Connected."*
   - Interactive live phone mockup with switcher for demo profiles (`/rahul`, `/abc-salon`, `/sharma-cafe`).
   - Feature breakdowns, hardware NFC card showcase, 3-step workflow, and FAQ.

3. **Admin Dashboard (`/admin`)**
   - **Dashboard Overview**: Total customers, active profiles, profile views, total link clicks, and conversion rate.
   - **Customer Management**: Create, edit, view, deactivate/reactivate, and delete customer profiles.
   - **QR Code Studio**: Customizable colors, vector SVG & 1024px PNG downloads, printable counter standee preview.
   - **NFC Hardware Manager**: Link physical NFC chip UIDs (NTAG213 / NTAG216) and direct Web NFC programming.
   - **Analytics & Insights**: Action breakdown by event type (WhatsApp, Calls, UPI, Reviews, Socials) and live activity stream.
   - **Settings**: Domain management, DB backup export, and admin credentials.

---

## 🏗 Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components & Client Actions)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS & Modern Glassmorphism
- **Database**: PostgreSQL (Prisma ORM & Supabase ready with raw SQL migrations)
- **Icons**: Lucide React
- **QR Engine**: `qrcode.react` (High-res SVG & Canvas PNG rendering)
- **Authentication**: JWT session tokens with HTTP-Only cookies & bcrypt password hashing
- **Deployment**: Vercel & GitHub Actions

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <your-repo>
cd Taplink
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taplink?schema=public"
NEXT_PUBLIC_APP_URL="https://taplink.in"
JWT_SECRET="your_secure_jwt_secret_here"
ADMIN_EMAIL="admin@taplink.in"
ADMIN_PASSWORD="TapLinkAdmin2026!"
```

### 3. Initialize Database & Seed

```bash
# Push schema to PostgreSQL
npm run db:push

# (Optional) Seed demo profiles (/rahul, /abc-salon, /sharma-cafe)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄 Database Schema (PostgreSQL / Supabase)

### `users`
- `id` (UUID, Primary Key)
- `email` (Unique)
- `password_hash`
- `role` (`ADMIN`, `USER`)
- `created_at`, `updated_at`

### `customers`
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key to users)
- `username` (Unique, permanent URL slug)
- `name`
- `business_name`
- `bio`
- `profile_image`
- `phone`
- `whatsapp`, `whatsapp_message`
- `instagram_url`, `facebook_url`, `youtube_url`, `website_url`
- `google_review_url`, `location_url`, `upi_id`
- `is_active` (Boolean)
- `created_at`, `updated_at`

### `nfc_cards`
- `id` (UUID, Primary Key)
- `customer_id` (Foreign Key to customers)
- `card_uid` (Unique NFC chip UID)
- `status` (`ACTIVE`, `INACTIVE`, `UNASSIGNED`)
- `created_at`, `updated_at`

### `analytics_events`
- `id` (UUID, Primary Key)
- `customer_id` (Foreign Key to customers)
- `event_type` (`profile_view`, `whatsapp_click`, `call_click`, `instagram_click`, `facebook_click`, `youtube_click`, `google_review_click`, `website_click`, `location_click`, `upi_click`, `vcard_download`, `share_click`)
- `created_at`
- `metadata` (JSONB)

---

## 📲 NFC Card Programming

NFC Cards used with TapLink use standard **NDEF URI records**:

- **Target Record Type**: `URI / URL`
- **URI Payload**: `https://taplink.in/[username]` (e.g. `https://taplink.in/rahul`)
- **Recommended Chip**: NXP NTAG213 / NTAG215 / NTAG216

Cards can be programmed either via the built-in **Web NFC tool** inside `/admin/nfc-cards` or any standard mobile app (such as *NFC Tools* or *NXP TagWriter*).

---

## 🛡 Security & Best Practices

- Admin routes (`/admin/*`) are protected with cryptographic JWT tokens stored in strict HTTP-only cookies.
- Passwords hashed with salted bcrypt rounds.
- UPI links do not expose sensitive credentials; payments flow directly into the merchant's configured UPI address with zero intermediary fees.
- All dynamic inputs (usernames, phone numbers, WhatsApp links, URLs) are sanitized on both server and client layers.
