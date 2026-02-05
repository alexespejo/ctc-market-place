# 🍽️ UCI Meal Swipe Marketplace

A mobile-first marketplace platform for UCI students to share and find meal swipes. Connect with fellow students to share swipes at Brandywine and Anteatery dining halls.

## 🚀 Features

- **User Authentication**: Sign in with Google or email/password
- **Profile Management**: Create and manage your swiper profile
- **Real-time Updates**: See active users with available meal swipes
- **Smart Filtering**: Filter users by active/inactive status
- **Mobile-First Design**: Optimized for mobile devices but looks great on desktop
- **Easy Controls**: 
  - Toggle between dining halls (Brandywine/Anteatery)
  - Adjust swipe count with simple +/- buttons
  - Set active/inactive status with a toggle

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Language**: TypeScript

## 📋 Prerequisites

- Bun installed on your machine
- Firebase project set up (see setup instructions below)

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd ctc-meal-swipe-marketplace
bun install
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Enable "Google" provider
4. Enable **Firestore Database**:
   - Go to Firestore Database
   - Create database (start in production mode or test mode)
   - Set up security rules (see below)

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Firebase credentials:
   - In Firebase Console, go to Project Settings (gear icon)
   - Under "Your apps", create or select a Web app
   - Copy the configuration values

3. Update `.env.local` with your Firebase credentials:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 4. Firestore Security Rules

Add these security rules in Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles
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

### 5. Run the Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📱 How to Use

1. **Sign In/Sign Up**: Click "Sign In" and create an account or sign in with Google
2. **Create Profile**: Fill in your details, select your nearest dining hall, and set your initial swipe count
3. **View Marketplace**: Browse active users on the home page
4. **Manage Your Profile**: 
   - Toggle active/inactive status
   - Update your swipe count
   - Change your dining hall
   - Edit your contact information

## 🏗️ Project Structure

```
ctc-meal-swipe-marketplace/
├── app/
│   ├── auth/              # Authentication page
│   ├── profile/           # Profile pages
│   │   ├── page.tsx       # View profile
│   │   └── create/        # Create/edit profile
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Home/marketplace page
│   └── globals.css        # Global styles
├── components/
│   ├── Navbar.tsx         # Navigation component
│   └── UserCard.tsx       # User card component
├── contexts/
│   └── AuthContext.tsx    # Authentication context
├── lib/
│   ├── firebase.ts        # Firebase initialization
│   ├── firestore.ts       # Firestore helper functions
│   └── types.ts           # TypeScript type definitions
└── .env.local             # Environment variables (create this!)
```

## 🔐 Security Notes

- Never commit `.env.local` to version control
- The `.env.example` file is provided as a template
- Firestore security rules ensure users can only edit their own profiles
- All read operations are public (anyone can view the marketplace)

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub (make sure `.env.local` is in `.gitignore`)
2. Import your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel project settings
4. Deploy!

## 📝 Future Enhancements

- Rating system for users
- Direct messaging between users
- Notification system
- Location-based matching
- Transaction history
- Admin dashboard

## 🤝 Contributing

This is a community project for UCI students. Feel free to submit issues and pull requests!

## 📄 License

MIT License - feel free to use this project for your own purposes.
