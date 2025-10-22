# GymApp - Deployment Guide

## Deploying to Firebase Hosting

Firebase Hosting provides fast and secure hosting for your web app with automatic SSL.

### Prerequisites

- Completed installation and configuration (see INSTALLATION.md)
- Firebase CLI installed globally
- A working Firebase project

### Step 1: Install Firebase CLI

If you haven't already, install the Firebase CLI globally:

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

### Step 3: Initialize Firebase Hosting

In your project directory, run:

```bash
firebase init hosting
```

Answer the prompts as follows:
- **Use an existing project?** Yes
- **Select your project:** Choose your Firebase project
- **What do you want to use as your public directory?** `dist`
- **Configure as a single-page app?** Yes
- **Set up automatic builds?** No (we'll build manually)
- **Overwrite index.html?** No

### Step 4: Update Firebase Configuration

Create `firebase.json` if it wasn't created:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Step 5: Set Production Environment Variables

For production, you can either:

**Option A: Use the same .env file**
- The build process will include these at build time
- Make sure `.env` is not committed to git

**Option B: Set up Firebase environment config**
```bash
firebase functions:config:set env.firebase_api_key="your_key"
# ... set other variables
```

### Step 6: Build the Production App

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Step 7: Test Production Build Locally (Optional)

Preview the production build locally:

```bash
npm run preview
```

Or use Firebase hosting emulator:

```bash
firebase serve
```

### Step 8: Deploy to Firebase Hosting

Deploy your app:

```bash
firebase deploy --only hosting
```

After deployment, you'll receive a hosting URL like:
`https://your-project-id.web.app`

### Step 9: Set Up Firestore Security Rules

**IMPORTANT:** Before going live, secure your Firestore database!

In Firebase Console, go to Firestore Database > Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Workouts collection
    match /workouts/{workoutId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn() && 
        (resource.data.createdBy == request.auth.uid || isAdmin());
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if isSignedIn() && 
        (request.auth.uid in resource.data.assignedUsers || isAdmin());
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn() && 
        (resource.data.createdBy == request.auth.uid || isAdmin());
    }
    
    // Logs collection
    match /logs/{logId} {
      allow read, write: if isSignedIn() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isSignedIn() && 
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

Click "Publish" to apply the rules.

### Step 10: Configure Custom Domain (Optional)

1. In Firebase Console, go to Hosting
2. Click "Add custom domain"
3. Follow the wizard to verify domain ownership
4. Update DNS records as instructed
5. Firebase automatically provisions SSL certificate

## Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
          
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

Don't forget to add secrets in GitHub repository settings!

## Alternative Deployment Options

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Performance Optimization

### Enable Compression
Firebase Hosting automatically compresses assets.

### Image Optimization
Consider using WebP format and lazy loading for images.

### Code Splitting
Vite automatically code-splits for optimal loading.

### Caching
Configure browser caching in `firebase.json` (already included above).

## Monitoring & Analytics

### Enable Firebase Analytics

1. In Firebase Console, go to Analytics
2. Enable Google Analytics
3. Add to `src/config/firebase.js`:

```javascript
import { getAnalytics } from 'firebase/analytics';
export const analytics = getAnalytics(app);
```

### Performance Monitoring

```bash
npm install firebase
```

Add to your app:

```javascript
import { getPerformance } from 'firebase/performance';
const perf = getPerformance(app);
```

## Rollback

If you need to rollback to a previous version:

```bash
firebase hosting:rollback
```

## Cost Estimation

**Firebase Free Tier (Spark Plan):**
- Hosting: 10 GB storage, 360 MB/day transfer
- Firestore: 1 GB storage, 50K reads/day, 20K writes/day
- Authentication: Unlimited

For most small to medium apps, the free tier is sufficient!

## Support & Troubleshooting

### Common Issues

**Build fails:**
- Check all environment variables are set
- Ensure all dependencies are installed
- Clear cache: `npm cache clean --force`

**Deployment fails:**
- Verify Firebase CLI is logged in
- Check project permissions
- Ensure `firebase.json` is configured correctly

**App not loading after deployment:**
- Check browser console for errors
- Verify environment variables in build
- Check Firestore security rules

## Next Steps

- Set up monitoring and error tracking (e.g., Sentry)
- Configure backup strategies for Firestore
- Implement rate limiting for API calls
- Add custom error pages
- Set up staging environment
