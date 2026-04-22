# Raniya Travel — Setup & Admin Guide

## 1. Running the Project

### Prerequisites
- Node.js 18+ installed

### Install & Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000

### Build for production

```bash
npm run build
npm start
```

---

## 2. Deploy to Vercel (Recommended — Free)

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New Project** → select your repo
4. Click **Deploy** — that's it!

Your site goes live at `yourproject.vercel.app`

### Custom domain

In Vercel → Project → Settings → Domains → add `raniyatravel.co.uk`

---

## 3. How to Add/Edit Packages

All packages are in: `src/data/packages.json`

**To add a new package**, copy an existing object and update:

```json
{
  "id": "7",
  "slug": "thailand-island-hopping",   ← URL-friendly, no spaces
  "title": "Thailand Island Hopping",
  "subtitle": "Your short description here",
  "destination": "Thailand",
  "duration": "8 Nights / 9 Days",
  "durationDays": 8,
  "price": 1999,
  "originalPrice": 2400,              ← Remove this line if no sale price
  "currency": "GBP",
  "category": "Beach & Islands",
  "tags": ["Beach", "Islands"],
  "heroImage": "https://images.unsplash.com/photo-XXXX?w=1920&q=80",
  "gallery": [
    "https://images.unsplash.com/photo-XXXX?w=1200&q=80"
  ],
  "overview": "Your overview paragraph...",
  "highlights": ["Highlight 1", "Highlight 2"],
  "included": ["Item 1", "Item 2"],
  "excluded": ["Item 1"],
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival",
      "description": "Day description...",
      "meals": "Dinner",
      "accommodation": "Hotel Name"
    }
  ],
  "instagramVideos": [],
  "featured": true,
  "popular": false,
  "rating": 4.8,
  "reviewCount": 0
}
```

After saving, the new package automatically appears on the website.

---

## 4. How to Edit Package Itinerary

In `src/data/packages.json`, find your package and edit the `itinerary` array:

```json
"itinerary": [
  {
    "day": 1,
    "title": "Day Title",
    "description": "Full description of the day...",
    "meals": "Breakfast & Dinner",
    "accommodation": "Hotel Name, City"
  }
]
```

---

## 5. How to Add Instagram Videos

### On the Home page

Edit `src/app/page.tsx` and update the `instagramVideos` array:

```js
const instagramVideos = [
  {
    url: 'https://www.instagram.com/p/YOUR_POST_ID/',
    thumbnail: 'https://images.unsplash.com/photo-XXX?w=600&h=600&fit=crop',
    caption: 'Caption text',
  },
  // add more...
]
```

### On a Package page

In `src/data/packages.json`, add the Instagram reel URL to the package's `instagramVideos` array:

```json
"instagramVideos": [
  "https://www.instagram.com/reel/YOUR_REEL_ID/"
]
```

---

## 6. How to Change Contact Details

Edit `src/data/config.json`:

```json
{
  "siteName": "Raniya Travel",
  "tagline": "Curated Journeys, Extraordinary Experiences",
  "whatsapp": "447700000000",          ← UK number, no + or spaces
  "phone": "+44 7700 000000",          ← Display format
  "email": "hello@raniyatravel.co.uk",
  "address": "London, United Kingdom",
  "socialMedia": {
    "instagram": "https://instagram.com/raniyatravel",
    "facebook": "https://facebook.com/raniyatravel"
  }
}
```

**WhatsApp number format:** Country code + number, no spaces, no `+`
- UK: `447712345678`
- International: `971501234567`

---

## 7. How to Use Your Own Images

Replace Unsplash URLs with your own by:

**Option A — Hosted images:** Upload to Cloudinary, AWS S3, or any CDN and paste the URL directly.

**Option B — Local images:** 
1. Place images in `/public/images/`
2. Reference as `/images/your-photo.jpg`
3. Update `next.config.js` to remove the Unsplash domain if unused

---

## 8. Package Filters

The filters on `/packages` page work automatically based on the data in `packages.json`. No configuration needed — destinations and categories are derived from the data.

---

## 9. SEO

- Page titles and descriptions are set per-page in each `page.tsx` file using `export const metadata`
- To update the site-wide defaults, edit `src/app/layout.tsx`

---

## 10. File Structure Overview

```
src/
├── app/
│   ├── layout.tsx          ← Global layout (Navbar, Footer)
│   ├── page.tsx            ← Home page
│   ├── packages/
│   │   ├── page.tsx        ← All packages
│   │   └── [slug]/
│   │       ├── page.tsx    ← Package detail (server)
│   │       └── PackageDetailClient.tsx ← Package detail (UI)
│   ├── about/              ← About page
│   ├── contact/            ← Contact page
│   ├── privacy/            ← Privacy policy
│   └── terms/              ← Terms of service
├── components/
│   ├── home/               ← Homepage sections
│   ├── layout/             ← Navbar & Footer
│   ├── packages/           ← Package cards & filters
│   └── ui/                 ← Shared UI (BookingCTAs, StickyBooking, etc.)
├── data/
│   ├── config.json         ← ⭐ Site config (contact details)
│   ├── packages.json       ← ⭐ All tour packages
│   └── testimonials.json   ← ⭐ Client testimonials
└── types/
    └── index.ts            ← TypeScript types
```
