# Yalla Kauppa - Frontend

Frontend application for Yalla Kauppa (food store) built with Next.js.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- CSS Modules
- Nunito Font (Google Fonts)

## Features

- Modern responsive navbar with navigation links
- Landing page with hero section
- Social media integration (Facebook, Instagram)
- Mobile-first design

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OFFER_ADMIN_USERNAME=...
OFFER_ADMIN_PASSWORD=...
```

### Required Supabase Tables

Create three tables (or equivalent views) in Supabase:

1. `offer_rails`
   - `id` (text, primary key)
   - `title` (text)
   - `description` (text)
   - `sort_order` (int, optional)
2. `offer_items`
   - `id` (uuid)
   - `rail_id` (text, FK → offer_rails.id)
   - `product`, `description`, `image_src`, `image_alt`, `price`, `original_price`, `location`, `badge`
   - `sort_order` (int)
3. `weekly_offers`
   - `id` (text)
   - `title`, `location`, `image_src`, `image_alt`, `price`, `original_price`, `discount`, `valid_until`, `href`
   - `image_gallery` (jsonb, optional array of `{ src, alt }`)
   - `sort_order` (int)

Expose the tables via Supabase Row Level Security or policies suited for read-only anon access.

### Admin Page

- Navigate to `/hallinta/uusi-tarjous`
- Log in with the credentials from `OFFER_ADMIN_USERNAME` / `OFFER_ADMIN_PASSWORD`
- Voit lisätä kuvan joko omalta koneelta (tiedosto muutetaan data-URL:ksi automaattisesti) tai syöttää valmiin URL-osoitteen
- Uusi tarjous tallentuu `offer_items`-tauluun Supabasen palvelinavaimen (`SUPABASE_SERVICE_ROLE_KEY`) avulla
- Onnistuneen tallennuksen jälkeen `/tarjoukset` ja etusivun listaukset päivittyvät ilman kovakoodattuja dummy-tietoja

## Project Structure

```
src/
  app/           # Next.js App Router pages
  components/    # React components
    Navbar.tsx   # Navigation bar component
    Hero.tsx     # Landing page hero section
```

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com), the platform from the creators of Next.js.
