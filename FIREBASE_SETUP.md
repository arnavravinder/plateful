# Firebase Setup Guide for Plateful

## Prerequisites
- Firebase project: `plateful-firebase` (already created)
- Google account with Firebase access

## Required Firebase Services

### 1. Firestore Database
**Enable:** [https://console.firebase.google.com/project/plateful-firebase/firestore](https://console.firebase.google.com/project/plateful-firebase/firestore)

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
**Enable:** [https://console.firebase.google.com/project/plateful-firebase/authentication](https://console.firebase.google.com/project/plateful-firebase/authentication)

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

### 3. Storage
**Enable:** [https://console.firebase.google.com/project/plateful-firebase/storage](https://console.firebase.google.com/project/plateful-firebase/storage)

1. Click **"Get started"**
2. Choose **"Start in production mode"**
3. Select same location as Firestore
4. Click **"Done"**

**Security Rules to add:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /plate-photos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }

    match /upi-qrs/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
        && request.resource.size < 2 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 4. Hosting
**Enable:** [https://console.firebase.google.com/project/plateful-firebase/hosting](https://console.firebase.google.com/project/plateful-firebase/hosting)

1. Click **"Get started"**
2. Follow the prompts (we'll deploy via CLI)
3. Skip the setup steps for now

**Custom domain (already configured):**
- plateful.in → should be connected already

### 5. Enable Billing (Required for Phone Auth)

**Only if you want phone authentication:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/billing)
2. Link project `plateful-firebase` to billing account
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

# 3. Enable Storage
☐ Create default bucket
☐ Add security rules above

# 4. Enable Hosting
☐ Click "Get started"

# 5. Optional: Enable Billing
☐ Link billing account (for real phone auth)
```

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
