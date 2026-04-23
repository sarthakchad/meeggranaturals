# Naturals — Skincare & Haircare App

A fully local version of your Base44 app. All data is stored in your browser's localStorage.

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Usage

- **Browse** — Home, Shop, Product pages work out of the box
- **Add products** — Go to `/admin/products` or click "Admin" in the mobile menu
- **Cart & Wishlist** — Add products from the shop and they persist in localStorage
- **Checkout** — Places orders stored locally

## Notes

- No login required — everything is public
- Data is stored in `localStorage` under keys like `naturals_Product`, `naturals_CartItem`, etc.
- To reset all data, open DevTools → Application → Local Storage → clear all `naturals_*` keys
