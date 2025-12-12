# Testing Google Sign-In Implementation

## How to Test the Login Functionality

### Option 1: Quick Test (Without Firebase Setup)

The app is designed to run without Firebase configuration. However, **Google Sign-in will not work** until you set up Firebase.

```bash
npm start
```

**Expected Behavior:**
- ✅ App loads successfully
- ✅ "Sign in with Google" button appears
- ❌ Clicking button will show Firebase error (this is expected)
- ✅ All other features work (localStorage-based)

### Option 2: Full Test (With Firebase - Recommended)

#### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Name: `daily-standup-test` (or any name)
4. Follow prompts and create project

#### Step 2: Enable Google Authentication

1. In Firebase Console → **Authentication**
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click "Google"
5. Toggle **Enable**
6. Select support email
7. Click **Save**

#### Step 3: Register Web App

1. Firebase Console → Project Settings (gear icon)
2. Scroll down → "Your apps"
3. Click Web icon (`</>`)
4. App nickname: `Daily Standup Web`
5. **Don't** check Firebase Hosting (unless you want it)
6. Click "Register app"
7. **Copy** the config object

#### Step 4: Create `.env` File

Create `.env` in project root:

```bash
# Copy from .env.example
cp .env.example .env
```

Edit `.env` and paste your Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSy...your_actual_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef
```

#### Step 5: Set Up Firestore (For Cloud Storage)

1. Firebase Console → **Firestore Database**
2. Click "Create database"
3. Choose "Start in **production mode**"
4. Select location (closest to you)
5. Click "Enable"

**Add Security Rules:**

Go to "Rules" tab and replace with:

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

Click **Publish**

#### Step 6: Run & Test

```bash
npm start
```

Open http://localhost:5173

## Testing Checklist

### 1. Sign-In Flow

- [ ] Click "Sign in with Google" button
- [ ] Button shows "Signing in..." with spinner
- [ ] Google popup opens
- [ ] Select your Google account
- [ ] Popup closes automatically
- [ ] User profile appears in header (name, email, photo)
- [ ] Button changes to "Sign Out"

### 2. After Sign-In

- [ ] User info displays correctly
- [ ] Generate a standup
- [ ] Check Firebase Console → Firestore Database
- [ ] See new document in `standups` collection
- [ ] Document has `userId` field matching your auth UID
- [ ] All standup data is saved

### 3. Sign-Out Flow

- [ ] Click "Sign Out" button
- [ ] User profile disappears
- [ ] Button changes back to "Sign in with Google"
- [ ] App still works (localStorage only)

### 4. Persistence Test

- [ ] Sign in
- [ ] Generate standup
- [ ] Close browser completely
- [ ] Reopen http://localhost:5173
- [ ] Should be **automatically signed in**
- [ ] History should be loaded

### 5. Cross-Device Test (If Using Firestore)

- [ ] Sign in on Device 1
- [ ] Generate standups
- [ ] Sign in on Device 2 (with same Google account)
- [ ] Should see same history
- [ ] Generate standup on Device 2
- [ ] Should appear on Device 1 after refresh

## Expected UI States

### Not Signed In
```
Header: [Logo] [Title]  [Sign in with Google]
```

### Loading
```
Header: [Logo] [Title]  [Spinner] Loading...
```

### Signing In
```
Header: [Logo] [Title]  [Spinner] Signing in...
(Button disabled, cursor not-allowed)
```

### Signed In
```
Header: [Logo] [Title]  [Avatar] [Name/Email] [Sign Out]
```

## Troubleshooting

### Error: "Firebase: Error (auth/unauthorized-domain)"

**Solution:**
1. Firebase Console → Authentication → Settings
2. Authorized domains → Add `localhost`
3. Also add your production domain when deploying

### Error: "Failed to sign in"

**Possible causes:**
- Firebase config not set in `.env`
- Dev server not restarted after creating `.env`
- Google Authentication not enabled in Firebase Console
- Browser blocked popup (check browser settings)

**Solution:**
1. Check `.env` file exists and has all values
2. Restart: `npm start`
3. Check Firebase Console → Authentication is enabled
4. Allow popups for localhost

### Error: "Missing or insufficient permissions"

**Cause:** Firestore security rules not set correctly

**Solution:**
1. Firebase Console → Firestore Database → Rules
2. Copy rules from Step 5 above
3. Click Publish

### Popup Closed by User

**This is normal** - user closed the Google sign-in popup
Just click "Sign in with Google" again

### Data Not Syncing

**Check:**
1. Are you signed in?
2. Is Firestore set up?
3. Are security rules correct?
4. Check browser console for errors

## Console Logs

**Normal sign-in:**
```
// No errors
User signed in: {uid: "...", email: "...", displayName: "..."}
```

**Sign-in error:**
```
Sign in error: [Error details]
// Check the error message for clues
```

## Verification

### Check Firebase Console

1. **Authentication → Users**
   - Your Google account should appear
   - Shows UID, email, sign-in date

2. **Firestore Database → Data**
   - `standups` collection exists
   - Documents have your `userId`
   - Each document has all fields

## Security Notes

- `.env` file is **never** committed to git (in `.gitignore`)
- Firebase API keys are safe to use in frontend (they're restricted by domain)
- Firestore security rules protect your data server-side
- Users can only access their own data

## Demo Credentials

**Note:** You must use your own Google account. There are no demo credentials.

For testing:
- Use your personal Google account
- Or create a test Google account
- No special setup needed for the Google account

## Success Indicators

✅ **Working Correctly:**
- Button changes during sign-in
- User profile appears
- Data saves to Firestore
- Sign out works
- Auto sign-in on reload

❌ **Not Working:**
- Popup doesn't open → Check Firebase config
- Error in console → Check error message
- Data not saving → Check Firestore rules
- Not persistent → Check Firestore is enabled

## Next Steps After Testing

Once Google Sign-in works:

1. **Deploy to Production**
   - Add production domain to Firebase authorized domains
   - Set environment variables on hosting platform
   - Test again on production URL

2. **Optional Enhancements**
   - Add more authentication providers (GitHub, Twitter)
   - Add email/password authentication
   - Add profile page
   - Add user settings

---

**Ready to test!** Follow Option 2 for full Google Sign-in testing. 🚀

