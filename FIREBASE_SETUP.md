# Firebase Setup Guide

Follow these steps to set up Firebase for your Daily Standup Generator.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `daily-standup-generator`
4. (Optional) Enable Google Analytics
5. Click "Create project"

## Step 2: Register Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Register app with nickname: `Daily Standup Web`
3. (Optional) Check "Also set up Firebase Hosting"
4. Click "Register app"
5. Copy the Firebase configuration object

## Step 3: Get Firebase Config

You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "daily-standup-xxxxx.firebaseapp.com",
  projectId: "daily-standup-xxxxx",
  storageBucket: "daily-standup-xxxxx.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

## Step 4: Update Your Code

Replace the config in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // Replace with your values
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 5: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Select **Sign-in method** tab
4. Enable **Google** provider:
   - Click on "Google"
   - Toggle "Enable"
   - Enter support email (your email)
   - Click "Save"

## Step 6: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Select "Start in **production mode**"
4. Choose your location (e.g., `us-central`)
5. Click "Enable"

## Step 7: Set Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Standup entries - users can only read/write their own data
    match /standups/{standupId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click "Publish"

## Step 8: Create Firestore Index (Optional but Recommended)

For better query performance:

1. Go to **Firestore Database** → **Indexes**
2. Click "Add index"
3. Collection ID: `standups`
4. Add fields:
   - `userId` (Ascending)
   - `createdAt` (Descending)
5. Click "Create"

## Step 9: Configure OAuth Consent Screen

For Google Sign-In to work properly:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** → **OAuth consent screen**
4. Select "External" user type
5. Fill in:
   - App name: `Daily Standup Generator`
   - User support email: Your email
   - Developer contact: Your email
6. Click "Save and Continue"
7. Skip "Scopes" section
8. Add test users (your email and any testers)
9. Click "Save and Continue"

## Step 10: Add Authorized Domains

1. Back in Firebase Console
2. Go to **Authentication** → **Settings** → **Authorized domains**
3. Add your domains:
   - `localhost` (for development - should already be there)
   - Your production domain (e.g., `daily-standup.vercel.app`)

## Step 11: Test the Setup

1. Start your development server: `npm run dev`
2. Open the app in browser
3. Click "Sign in with Google"
4. Sign in with your Google account
5. Try generating a standup
6. Check Firebase Console → Firestore Database to see the data

## Troubleshooting

### "Auth domain is not configured"
- Make sure you've added your domain to Authorized domains
- For localhost, use `http://localhost:5173` exactly

### "Permission denied" in Firestore
- Check your security rules
- Make sure you're signed in
- Verify `userId` field matches the authenticated user

### Google Sign-In popup blocked
- Allow popups for localhost in your browser
- Check if OAuth consent screen is properly configured

### "API key not valid"
- Double-check your Firebase config in `src/lib/firebase.ts`
- Make sure all values are correct (no extra spaces)

## Environment Variables (Production)

For production deployment, use environment variables:

Create `.env`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Update `src/lib/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

Add `.env` to `.gitignore`!

## Cost Considerations

Firebase Free Tier (Spark Plan) includes:
- **Authentication**: Unlimited users
- **Firestore**: 
  - 1 GB storage
  - 50K reads/day
  - 20K writes/day
  - 20K deletes/day

This is more than enough for personal use or small teams!

## Next Steps

✅ Firebase setup complete!
✅ Authentication working
✅ Firestore connected
✅ Security rules configured

Now you can:
- Deploy to production (Vercel/Netlify)
- Add more features
- Invite your team
- Track usage in Firebase Console

Happy coding! 🚀

