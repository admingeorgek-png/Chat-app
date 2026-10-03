# ChatApp

A WhatsApp-style real-time chat starter built with Expo React Native and Firebase.

## Included
- Email/password registration and login
- User profiles in Firestore
- User search
- One-to-one real-time text messaging
- Online/offline field
- Logout
- Mobile-friendly chat UI

## Setup

1. Install Node.js.
2. Install dependencies:
   npm install
3. Create a Firebase project.
4. Enable Authentication > Email/Password.
5. Create a Firestore database.
6. Copy your Firebase Web App configuration into `firebase.js`.
7. Start:
   npx expo start

## Firestore structure

users/{uid}
chats/{sortedUid1_sortedUid2}/messages/{messageId}

## Important
This is a functional starter, not a production WhatsApp clone. Before public release, add proper Firestore security rules, push notifications, abuse reporting, rate limiting, media upload validation, account recovery, and stronger privacy/security controls.
