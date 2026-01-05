# Firebase Setup for MoodMate 🌿

To enable real authentication (Google Sign-In, Email/Password), you need to connect your Firebase project.

## 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it `MoodMate`.
3. Disable Google Analytics (optional).

## 2. Enable Authentication
1. Go to **Build > Authentication** in the sidebar.
2. Click **Get Started**.
3. Enable **Email/Password**.
4. Enable **Google** (no additional setup needed for localhost).

## 3. Get Your Keys
1. Click the **Gear Icon (Settings)** > **Project settings**.
2. Scroll to "Your apps" and click the **</> (Web)** icon.
3. Register the app (name it `MoodMate`).
4. You will see a `firebaseConfig` object.

## 4. Add to Environment Variables
Create a file named `.env.local` in the root of your project (`c:\Users\admin\Desktop\moodmate\.env.local`) and paste these values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project_id.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
```

## 5. Restart server
Run `npm run dev` again to load the new keys.
