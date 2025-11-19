# Emotional Vent Space

An anonymous messaging app where people can share their thoughts and feelings safely. Built as part of the Muhe Health Support Group application.

## What it does

- Post messages anonymously without signing up
- See messages from others in real-time
- Works on phones, tablets, and desktops
- Filters out inappropriate content automatically
- Shows how long ago each message was posted

## Built with

- React 19
- Tailwind CSS
- Firebase Firestore
- React Router

## Setup

You'll need Node.js and a Firebase account to run this locally.

1. Install everything:
```bash
npm install
```

2. Create a `.env` file with your Firebase credentials:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

To get these values, go to the Firebase Console, create a project, enable Firestore Database, then grab the config from Project Settings.

3. Run it:
```bash
npm start
```

Opens at http://localhost:3000

4. Build for production:
```bash
npm run build
```

## Notes

The profanity filter uses the bad-words library. Messages are limited to 500 characters. All data is stored in Firebase, so there's no backend server to manage.

Built for the Muhe Health Support Group full stack developer application.
