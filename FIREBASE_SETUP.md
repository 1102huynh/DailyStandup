# Firebase Setup Guide

Complete guide to set up Firebase Authentication and Firestore Database for Daily Standup Generator.

## Prerequisites

- Google account
- Node.js and npm installed
- Daily Standup Generator project

## Step 1: Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `daily-standup-app`
4. (Optional) Enable Google Analytics
5. Click **"Create project"** and wait

## Step 2: Register Web App

1. In Firebase dashboard, click **Web icon** (`</>`)
2. App nickname: `Daily Standup Web`
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**
5. **Copy** the configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## Step 3: Enable Google Authentication

1. Go to **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. **"Sign-in method"** tab
4. Click **"Google"**
5. Toggle **Enable**
6. Select support email
7. Click **"Save"**

**Authorized Domains:**
- Verify `localhost` is listed (default)
- Add production domain when deploying

## Step 4: Set Up Firestore Database

1. Go to **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"**
4. Select location (closest to users)
5. Click **"Enable"**

### Security Rules

Go to **"Rules"** tab and paste:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /standups/{standupId} {
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.userId;
    }
  }
}
```

Click **"Publish"**

### Create Index

1. **"Indexes"** tab → **"Create Index"**
2. Configuration:
   - Collection: `standups`
   - Fields:
     - `userId` (Ascending)
     - `createdAt` (Descending)
3. Click **"Create"**

## Step 5: Configure Environment

Create `.env` file in project root:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important:** Never commit `.env` to git!

## Step 6: Test Setup

```bash
npm start
```

1. Open http://localhost:5173
2. Click **"Sign in with Google"**
3. Complete sign-in
4. Generate a standup
5. Verify in Firestore

### Verify Authentication

Firebase Console → **Authentication** → **Users**
- Your Google account should appear

### Verify Firestore Data

Firebase Console → **Firestore Database** → **Data**
- Click `standups` collection
- See your entries with:
  - `userId`
  - `yesterday`, `today`, `blockers`
  - `tone`, `style`
  - `generatedText`
  - `createdAt`

## Troubleshooting

### "auth/unauthorized-domain"

**Solution:**
- Firebase Console → Authentication → Settings → Authorized domains
- Add your domain

### "Missing permissions"

**Solution:**
- Check Firestore Security Rules
- Verify you're signed in
- Check `userId` matches auth UID

### "Firebase Config Not Found"

**Solution:**
- Create `.env` file
- Add all `VITE_` variables
- Restart dev server

### Index Error

**Solution:**
- Firebase shows link to create index
- Click link and wait
- Or create manually in Step 4

## Data Structure

```typescript
{
  id: string,
  userId: string,
  yesterday: string,
  today: string,
  blockers: string,
  tone: 'formal' | 'casual' | 'humorous',
  style: 'short' | 'standard' | 'manager' | 'developer',
  generatedText: string,
  createdAt: Timestamp
}
```

## Security Best Practices

1. Never commit `.env` or real config to public repos
2. Use environment variables
3. Implement proper Firestore rules
4. Keep Firebase SDK updated
5. Enable App Check for production

## Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

**Setup Complete!** 🎉 Firebase is now connected with authentication and cloud storage.

