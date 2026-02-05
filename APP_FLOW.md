# 🗺️ UCI Meal Swipe Marketplace - App Flow

## User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (/)                          │
│                  Marketplace Homepage                        │
│                                                              │
│  • Browse active users with swipes                          │
│  • Filter: Active / All / Inactive                          │
│  • View user cards (name, swipes, dining hall)             │
│  • "Get Started" button (if not signed in)                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────┴──────────────────┐
         │                                      │
    Not Signed In                          Signed In
         │                                      │
         ▼                                      ▼
┌────────────────────┐              ┌─────────────────────┐
│   AUTH PAGE        │              │  NAVBAR OPTIONS     │
│   (/auth)          │              │                     │
│                    │              │  • My Profile       │
│  • Email/Password  │              │  • Sign Out         │
│  • Google Sign-In  │              │                     │
│  • Toggle Sign     │              └──────────┬──────────┘
│    Up/Sign In      │                         │
└────────┬───────────┘                         │
         │                                      │
         └──────────────┬───────────────────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │   First Time User?  │
             └──────┬──────────────┘
                    │
          ┌─────────┴─────────┐
          │                   │
         Yes                 No
          │                   │
          ▼                   ▼
┌─────────────────────┐   ┌──────────────────────┐
│  CREATE PROFILE     │   │   MY PROFILE         │
│  (/profile/create)  │   │   (/profile)         │
│                     │   │                      │
│  • Display Name     │   │  • View Profile      │
│  • Phone (optional) │   │  • Toggle Active     │
│  • Dining Hall      │   │  • Update Swipes     │
│  • Swipe Count      │   │  • Change Hall       │
│  • Active Status    │   │  • Edit Profile →    │
│                     │   │                      │
│  [Create Profile]   │   └───────────┬──────────┘
└──────────┬──────────┘               │
           │                          │
           └────────────┬─────────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │   PROFILE SAVED     │
              │   in Firestore      │
              └─────────────────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │  Back to Marketplace │
              │  (You're now visible)│
              └─────────────────────┘
```

## Page Breakdown

### 🏠 Home Page `/`
**Purpose**: Browse available meal swipes

**Features**:
- Grid of user cards (mobile: 1 column, tablet: 2, desktop: 3)
- Filter buttons (Active/All/Inactive)
- Count badges showing number in each category
- Call-to-action for non-authenticated users

**User Interactions**:
- Click filter buttons to filter users
- Click "Show Contact" on cards to reveal phone
- Click "Get Started" to sign up
- Click "My Profile" in nav to manage profile

---

### 🔐 Auth Page `/auth`
**Purpose**: User authentication

**Features**:
- Google OAuth button
- Email/password form
- Toggle between Sign Up and Sign In
- Error handling and loading states

**Flow**:
- New users → redirected to create profile
- Returning users → redirected to their profile

---

### 👤 My Profile `/profile`
**Purpose**: View and manage your profile

**Features**:
- Status toggle (Active/Inactive)
- Dining hall selector (Brandywine/Anteatery)
- Swipe counter with +/- buttons
- Edit profile button

**Real-time Updates**:
- Changes save immediately to Firestore
- UI updates optimistically
- Error handling with alerts

---

### ✏️ Create/Edit Profile `/profile/create`
**Purpose**: Set up or modify profile details

**Features**:
- Display name (required)
- Phone number (optional)
- Dining hall selection
- Initial swipe count
- Active status toggle

**Validation**:
- Required fields enforced
- Phone number optional
- Swipe count minimum: 0

---

## Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── Layout
│       ├── Navbar
│       │   ├── Logo
│       │   ├── My Profile Link
│       │   └── Sign Out Button
│       │
│       └── Page Content
│           ├── Home Page
│           │   ├── Header
│           │   ├── CTA Banner (if not signed in)
│           │   ├── Filter Buttons
│           │   └── User Grid
│           │       └── UserCard × N
│           │           ├── Status Badge
│           │           ├── Dining Hall
│           │           ├── Swipe Count
│           │           └── Contact Button
│           │
│           ├── Auth Page
│           │   ├── Google Sign In Button
│           │   ├── Divider
│           │   ├── Email/Password Form
│           │   └── Toggle Link
│           │
│           ├── Profile Page
│           │   ├── Header with Email
│           │   ├── Status Toggle
│           │   ├── Dining Hall Selector
│           │   ├── Swipe Counter
│           │   └── Edit Button
│           │
│           └── Create Profile Page
│               ├── Form Fields
│               └── Submit Button
```

## Data Flow

```
┌─────────────────┐
│  User Action    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React State    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Firebase Call  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Firestore DB   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  UI Update      │
└─────────────────┘
```

## Authentication Flow

```
User Not Signed In
       │
       ▼
┌──────────────┐
│  Click Auth  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  Choose Method:  │
│  • Email         │
│  • Google        │
└──────┬───────────┘
       │
       ▼
┌─────────────────────┐
│  Firebase Auth      │
│  Creates User       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Auth Context       │
│  Sets user state    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Check Firestore    │
│  Profile exists?    │
└──────┬──────────────┘
       │
   ┌───┴───┐
   │       │
  Yes     No
   │       │
   │       ▼
   │  ┌──────────────┐
   │  │ Create       │
   │  │ Profile Page │
   │  └──────────────┘
   │
   ▼
┌──────────────┐
│ My Profile   │
│ Page         │
└──────────────┘
```

## Firestore Data Operations

### Read Operations (Public)
```
getAllUsers()
  ↓
Firestore: users collection
  ↓
Sort by isActive, then updatedAt
  ↓
Return UserProfile[]
```

### Write Operations (Protected)
```
User Action (update swipe count)
  ↓
Check Authentication
  ↓
updateSwipeCount(userId, newCount)
  ↓
Firestore: users/{userId}
  ↓
Update document + timestamp
  ↓
UI reflects change
```

## Mobile Responsive Breakpoints

```
Mobile (< 640px)
├── 1 column grid
├── Stacked navigation
└── Full-width cards

Tablet (640px - 1024px)
├── 2 column grid
├── Horizontal navigation
└── Card grid layout

Desktop (> 1024px)
├── 3 column grid
├── Full navigation
└── Max-width container (1280px)
```

## Security Rules Summary

```
Authentication Rules:
├── Anyone → Read all profiles
├── Authenticated users → Create own profile
├── Users → Update only own profile
└── Users → Delete only own profile

Route Protection:
├── /auth → Redirect if signed in
├── /profile → Redirect if not signed in
└── /profile/create → Redirect if not signed in
```

## Key Features by Page

| Page | Features |
|------|----------|
| **Home** | Browse, Filter, Contact info |
| **Auth** | Sign in/up, Google OAuth |
| **Profile** | View, Toggle status, Update swipes, Change hall |
| **Create** | Set name, phone, hall, swipes |

---

This flow ensures users can easily find swipes, manage their own offerings, and connect with other students!
