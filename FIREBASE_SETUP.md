# Firebase Setup Guide

This guide will help you set up Firebase for the UCI Meal Swipe Marketplace.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or "Create a project"
3. Enter a project name (e.g., "UCI Meal Swipes")
4. (Optional) Enable Google Analytics
5. Click "Create Project"

## Step 2: Register Your App

1. In your Firebase project, click the **Web** icon (`</>`) to add a web app
2. Register your app with a nickname (e.g., "UCI Swipes Web App")
3. Don't enable Firebase Hosting (unless you want to)
4. Click "Register app"
5. **Copy the configuration values** - you'll need these for `.env.local`

Your config will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abc123"
};
```

## Step 3: Enable Authentication

1. In the Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Go to the **Sign-in method** tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"
5. Enable **Google**:
   - Click on "Google"
   - Toggle "Enable"
   - Enter your project support email
   - Click "Save"

## Step 4: Set Up Firestore Database

1. In the Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose a location (us-central is usually good for UCI)
4. Start in **test mode** for development (we'll add security rules next)
5. Click "Enable"

## Step 5: Configure Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles (for marketplace)
      allow read: if true;
      
      // Only authenticated users can create their own profile
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Users can only update their own profile
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // Users can delete their own profile
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 6: Create .env.local File

1. In your project root, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_from_step_2
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 7: Test Your Setup

1. Start the development server:
   ```bash
   bun dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)
3. Try signing up with an email or Google account
4. Create a profile
5. Check Firebase Console:
   - Authentication > Users should show your new user
   - Firestore Database > users should show your profile

## Firestore Data Structure

Your Firestore database will have the following structure:

```
users (collection)
  └── {userId} (document)
      ├── email: string
      ├── displayName: string
      ├── phone: string (optional)
      ├── diningHall: "Brandywine" | "Anteatery"
      ├── swipeCount: number
      ├── isActive: boolean
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Check that your `.env.local` file exists and has the correct values
- Restart your development server after creating `.env.local`

### "Missing or insufficient permissions"
- Make sure you published the security rules in Step 5
- Check that you're signed in when trying to create/update profiles

### Google Sign-In Not Working
- Make sure you enabled Google provider in Authentication
- Check that you added a support email
- For production, you'll need to add authorized domains in Firebase Console

## Production Deployment

When deploying to production (e.g., Vercel):

1. Add your environment variables in your hosting platform's settings
2. Update Firebase authorized domains:
   - Go to Authentication > Settings > Authorized domains
   - Add your production domain (e.g., `your-app.vercel.app`)
3. Consider switching Firestore to production mode with proper security rules

## Support

If you run into issues:
- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Review the browser console for error messages
- Check Firebase Console > Authentication and Firestore for any issues
