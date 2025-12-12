# Google Authentication Guide

Quick guide for implementing Google Sign-in with Firebase.

## How It Works

1. User clicks "Sign in with Google"
2. Firebase opens Google Sign-in popup
3. User selects Google account
4. Firebase returns user information
5. App saves user data and standups to Firestore

## Features

### Authentication
- ✅ Google Sign-in with popup
- ✅ Auto sign-in on page load
- ✅ Sign out functionality
- ✅ User profile display (name, email, photo)

### Data Storage
- ✅ Local storage (always available)
- ✅ Cloud storage (when signed in)
- ✅ Automatic sync
- ✅ User-specific data isolation

## User Flow

### Not Signed In
- Can generate standups
- Saves to localStorage only
- History limited to current browser
- No sync across devices

### Signed In
- All above features
- **Plus** saves to Firestore
- Access history from any device
- Persistent storage
- More secure

## Implementation Details

### AuthService (`src/services/authService.ts`)

```typescript
// Sign in with Google
await authService.signInWithGoogle();

// Sign out
await authService.signOut();

// Listen to auth state
authService.onAuthStateChange((user) => {
  if (user) {
    console.log('Signed in:', user.displayName);
  } else {
    console.log('Signed out');
  }
});
```

### StorageService (`src/services/storageService.ts`)

```typescript
// Always saves to localStorage
storageService.saveToLocal(entry);

// Saves to Firestore when signed in
if (user) {
  await storageService.saveToCloud(entry, user.uid);
}

// Get local history
const localHistory = storageService.getLocalHistory();

// Get cloud history (requires auth)
const cloudHistory = await storageService.getCloudHistory(user.uid);
```

## Security

### Firestore Rules

```javascript
// Users can only access their own data
allow read: if request.auth.uid == resource.data.userId;
allow write: if request.auth.uid == request.resource.data.userId;
```

### Best Practices
- ✅ Never store sensitive data in localStorage
- ✅ Always validate user identity server-side (Firestore rules)
- ✅ Use HTTPS in production
- ✅ Keep Firebase SDK updated

## Testing

### Local Testing
1. Start dev server: `npm start`
2. Open http://localhost:5173
3. Click "Sign in with Google"
4. Use your Google account

### Verify Data
1. Firebase Console → Authentication
   - See your user listed
2. Firebase Console → Firestore Database
   - See `standups` collection
   - Check `userId` field matches

## Troubleshooting

### Sign-in popup blocked
**Solution:** Allow popups for localhost

### "auth/popup-closed-by-user"
**Solution:** User closed popup, try again

### Data not syncing
**Solution:**
- Check internet connection
- Verify Firestore rules
- Check browser console for errors

### Multiple accounts
**Solution:** 
- Sign out completely
- Clear browser cache
- Sign in with correct account

## Privacy & Data

### What We Store
- User ID (Firebase UID)
- Email address
- Display name
- Profile photo URL
- Standup entries (yesterday, today, blockers, generated text)
- Timestamps

### What We Don't Store
- Passwords (handled by Google)
- Personal conversations
- Browsing history
- Other Google account data

## Advanced Features (Optional)

### Email/Password Auth
```typescript
// Add to firebase.ts
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Implement in authService.ts
async signUpWithEmail(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}
```

### GitHub/Twitter Auth
```typescript
// Add provider
import { GithubAuthProvider } from 'firebase/auth';
export const githubProvider = new GithubAuthProvider();

// Use same signInWithPopup method
```

### Offline Support
```typescript
// Enable offline persistence
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db).catch((err) => {
  console.error('Offline persistence error:', err);
});
```

## Resources

- [Firebase Auth Docs](https://firebase.google.com/docs/auth/web/google-signin)
- [Firestore Security](https://firebase.google.com/docs/firestore/security/overview)
- [Google Sign-in Best Practices](https://developers.google.com/identity/sign-in/web/sign-in)

---

**Ready to use!** Sign in with Google and enjoy cloud-synced standups! 🚀

