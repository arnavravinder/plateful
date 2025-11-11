# Plateful

Bengaluru's TooGoodToGo killer - Surprise plates from restaurants near you.

## Tech Stack

- **Frontend**: Vue 3 (CDN) + Vanilla CSS
- **Backend**: Firebase 10 (Firestore, Auth, Storage, Hosting)
- **Icons**: Phosphor Icons
- **Fonts**: Instrument Serif + Instrument Sans
- **PWA**: Service Worker + Manifest

## Project Structure

```
/
├── index.html              # Main entry point
├── styles/
│   └── style.css          # All CSS (BEM naming)
├── scripts/
│   ├── app.js             # Main Vue app with all pages
│   └── seed.js            # Seed data for Firestore
├── public/
│   ├── icons/             # PWA icons
│   ├── seed-images/       # Restaurant & plate images
│   └── manifest.json      # PWA manifest
├── sw.js                  # Service worker
├── firebase.json          # Firebase hosting config
└── .firebaserc            # Firebase project config
```

## Setup Instructions

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 2. Seed Firestore Database

1. Open Firebase Console: https://console.firebase.google.com/project/plateful-firebase
2. Go to Firestore Database
3. Run the seed script to populate data:

```javascript
// Copy data from scripts/seed.js and add to Firestore manually or via script
```

Add collections:
- `restaurants` - 8 Bengaluru restaurants
- `plates` - 14 surprise plates
- `reservations` - Empty (populated by users)

### 3. Configure Firebase Authentication

1. Go to Authentication in Firebase Console
2. Enable Phone authentication
3. Add test phone numbers if needed for development

### 4. Deploy to Firebase Hosting

```bash
firebase deploy
```

### 5. Access the App

- **Production**: https://plateful-firebase.web.app
- **Custom Domain**: https://plateful.in

## Pages

1. **Home** (`/`) - Live plate feed with geolocation filtering
2. **Plate Detail** (`/p/:id`) - Plate details with reservation
3. **Restaurant** (`/r/:id`) - Restaurant profile with all plates
4. **Reservation** (`/reserve/:id`) - QR code for payment
5. **Dashboard** (`/dashboard`) - Restaurant management (phone auth)
6. **Admin** (`/admin`) - System overview

## Features

- Real-time Firestore updates
- Geolocation filtering (5km radius)
- Phone OTP authentication
- Restaurant UPI QR code display
- PWA installable
- Offline-capable
- Mobile-first (375px viewport)

## Design System

- **Colors**:
  - Background: #FAFAFA
  - Text: #1A1A1A
  - Primary: #FF2D55
  - Veg: #4ADE80
  - Non-veg: #EF4444
  - Border: #E5E5E5

- **Typography**:
  - Headings: Instrument Serif
  - Body: Instrument Sans

- **No gradients, shadows, or blur**

## Development

Since this is a static site with CDN dependencies, you can:

1. Use any static server:
   ```bash
   python -m http.server 8000
   ```

2. Or Firebase local hosting:
   ```bash
   firebase serve
   ```

3. Visit http://localhost:8000

## Deployment

```bash
firebase deploy --only hosting
```

## Notes

- No build step required
- All dependencies via CDN
- Lightweight and fast
- Firebase project: `plateful-firebase`
- Custom domain configured: `plateful.in`
