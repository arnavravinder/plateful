# Firebase Setup Guide for Plateful

## Prerequisites
- Firebase project: `tryplateful` (already created)
- Google account with Firebase access

## Required Firebase Services

### 1. Firestore Database
**Enable:** [https://console.firebase.google.com/project/tryplateful/firestore](https://console.firebase.google.com/project/tryplateful/firestore)

1. Click **"Create database"**
2. Choose **"Start in production mode"**
3. Select location: **asia-south1** (Mumbai) or **asia-southeast1** (Singapore)
4. Click **"Enable"**

**Security Rules to add:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /plates/{plateId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /reservations/{reservationId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if true;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 2. Authentication
**Enable:** [https://console.firebase.google.com/project/tryplateful/authentication](https://console.firebase.google.com/project/tryplateful/authentication)

**Required Providers:**

#### Phone Authentication (Primary)
1. Go to **Authentication** → **Sign-in method**
2. Click **Phone**
3. Toggle **Enable**
4. Click **Save**

**Important:** Phone auth requires billing enabled on your Google Cloud project. If you don't want to enable billing yet, skip this for now and use test accounts.

**For development (optional):**
- Scroll to **Phone numbers for testing**
- Add test numbers like: `+919999999999` with code `123456`

### 3. Hosting
**Enable:** [https://console.firebase.google.com/project/tryplateful/hosting](https://console.firebase.google.com/project/tryplateful/hosting)

1. Click **"Get started"**
2. Follow the prompts (we'll deploy via CLI)
3. Skip the setup steps for now

**Custom domain (already configured):**
- plateful.in → should be connected already

### 4. Enable Billing (Required for Phone Auth)

**Only if you want phone authentication:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/billing)
2. Link project `tryplateful` to billing account
3. Free tier includes:
   - 10K verifications/month for phone auth
   - 50K reads, 20K writes/day for Firestore
   - 5GB storage
   - 10GB/month bandwidth

**Without billing:**
- Use test phone numbers only
- Or skip phone auth for now (users can't login but you can still view the UI)

## Quick Setup Checklist

```bash
# 1. Enable Firestore
☐ Create database in production mode
☐ Add security rules above
☐ Select Mumbai/Singapore region

# 2. Enable Authentication
☐ Enable Phone provider
☐ Add test numbers (optional): +919999999999 → 123456

# 3. Enable Hosting
☐ Click "Get started"

# 4. Optional: Enable Billing
☐ Link billing account (for real phone auth)
```

## Image Uploads

**We use ImgBB (free) instead of Firebase Storage:**
- Restaurant dashboard supports direct image upload
- Images automatically uploaded to ImgBB
- API key already configured: `5300f0c46f6543615dd9aa89d278febc`
- Free tier: Unlimited uploads

## After Enabling Services

### Seed the Database
```bash
cd /workspaces/plateful
python -m http.server 8000
```
Open: http://localhost:8000/seed-firestore.html
Click: **"Seed Firestore"**

### Deploy
```bash
firebase login
firebase deploy
```

## Testing Without Phone Auth

If you skip billing/phone auth:
- **Dashboard page** won't work (requires phone login)
- **Admin page** won't work
- **Home, Plate Detail, Restaurant pages** will work fine
- You can still demo the full UI and test reservations

## Common Issues

### "Billing not enabled" error
- Enable billing on Google Cloud Console
- Or use test phone numbers only

### "Missing permissions" error
- Check security rules are published
- Make sure Firestore is in production mode

### "Storage bucket not found"
- Create default Storage bucket first
- Refresh the page

### Firestore blocked by adblocker
- Disable adblocker for localhost
- Or allow `*.googleapis.com` in adblocker settings
