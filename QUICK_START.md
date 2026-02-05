# 🚀 Quick Start Guide

Follow these steps to get your UCI Meal Swipe Marketplace running!

## 1️⃣ Create Your Environment File

Create a file called `.env.local` in the project root with the following content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**⚠️ Important**: Don't commit this file to git! It's already in `.gitignore`.

## 2️⃣ Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or select existing)
3. Click the web icon (`</>`) to add a web app
4. Copy the configuration values
5. Paste them into your `.env.local` file

## 3️⃣ Enable Firebase Services

### Authentication:
- Go to Authentication > Sign-in method
- Enable "Email/Password"
- Enable "Google"

### Firestore:
- Go to Firestore Database
- Create database (test mode is fine for development)
- Add these security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 4️⃣ Run the App

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎉 You're Done!

Try these features:
- ✅ Sign up with email or Google
- ✅ Create your profile
- ✅ Add meal swipes
- ✅ Toggle active/inactive
- ✅ View the marketplace

---

Need more help? Check out `FIREBASE_SETUP.md` for detailed instructions!
