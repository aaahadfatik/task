# Indigo Commerce Dashboard

A Next.js 15 (App Router) ecommerce dashboard with product search, category and date range filtering, favorites, and light/dark themes. Built with TypeScript, Tailwind CSS, and shadcn/ui.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Tech Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- shadcn/ui components (Radix UI primitives)
- DummyJSON API

## Key Features

- Product list with pagination (10 per page)
- Search and category filters
- Debounced search input (350ms)
- Date range filter with interactive calendar and hover preview
- Product details page
- Favorites persisted in `localStorage`
- Light/dark theme toggle
- Loading skeletons, error boundaries, and empty states
- URL query persistence for filters and pagination
- Lightweight chart: products added over the last 6 months

## Date Filtering Implementation

DummyJSON does not provide dates, so each product gets a deterministic `dateAdded` on the client:

- A seeded RNG (based on product ID) generates an offset within the last 180 days.
- The date is derived from the current day minus the offset, ensuring reproducibility on refresh.
- Products are fetched once (`limit=100`) and filtered client-side for search, category, and date range.

The calendar uses shadcn/ui’s `Calendar` (react-day-picker) with customized styling so selected dates use indigo (`primary`) and hover previews are displayed in a small card beneath the calendar.

## Notes / Decisions

- All filters are client-side to support composite filtering.
- Favorites are stored under `favorite-products` in `localStorage`.
- Theme preference is persisted via `next-themes`.

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – start production server
- `npm run lint` – lint

## Personal Touches

- Distinct visual direction: soft indigo gradient background, branded header, refined typography.
- Indigo accent system across buttons, badges, calendar selections, chart.
- Catalog pulse chart with range selector (6 months / 1 year).
- Polished interactions: image hover scale, subtle transitions, refined cards.
- Active filters panel to make filters more transparent for users.
- Favorites panel with quick access and scrolling.
- Sticky header and overlay side panels for desktop.

## Suggestions (Optional Enhancements)

- Pagination edge case: requirement is 10 per page, kept. If allowed, 9 or 12 looks better for visual balance.
- Progressive loading: add “load more” or infinite scroll to reduce clicks.
- Server-component split: render cards server-side, keep only favorite button client-side for better performance.
- Shareable state: persist favorites or view state in URL.
- Optional analytics: add small KPI cards (total products, favorites count, avg rating)
