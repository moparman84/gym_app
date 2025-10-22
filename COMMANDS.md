# 🚀 Command Reference

All commands you need to develop, build, and deploy your GymApp.

## 📦 Initial Setup

### Install All Dependencies
```bash
npm install
```

### Create Environment File
```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

Then edit `.env` with your Firebase credentials.

## 🔧 Development

### Start Development Server
```bash
npm run dev
```
Runs on http://localhost:5173

### Run Linter
```bash
npm run lint
```

### Fix Linting Issues
```bash
npm run lint -- --fix
```

## 🏗️ Production Build

### Build for Production
```bash
npm run build
```
Creates optimized build in `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Test production build locally

### Clean Build
```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force dist, node_modules
npm install
npm run build

# Linux/Mac
rm -rf dist node_modules
npm install
npm run build
```

## 🔥 Firebase Commands

### Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Login to Firebase
```bash
firebase login
```

### Initialize Firebase Hosting
```bash
firebase init hosting
```
Answer prompts:
- Public directory: `dist`
- Single-page app: `Yes`
- Overwrite index.html: `No`

### Deploy to Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

### Deploy with Message
```bash
firebase deploy --only hosting -m "Your deployment message"
```

### View Deployment History
```bash
firebase hosting:channel:list
```

### Rollback Deployment
```bash
firebase hosting:rollback
```

## 🗄️ Firebase Firestore

### Open Firestore Emulator (Optional)
```bash
firebase emulators:start --only firestore
```

### Export Firestore Data
```bash
firebase firestore:export gs://your-bucket/backups
```

### Import Firestore Data
```bash
firebase firestore:import gs://your-bucket/backups
```

## 🔍 Debugging & Testing

### Check for Outdated Packages
```bash
npm outdated
```

### Update All Packages
```bash
npm update
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install

# Linux/Mac
rm -rf node_modules package-lock.json
npm install
```

## 🌐 Environment Management

### Check Environment Variables
```bash
# Windows (PowerShell)
Get-Content .env

# Linux/Mac
cat .env
```

### Validate Environment Setup
```bash
node -e "console.log(process.env)"
```

## 📊 Project Information

### View Installed Packages
```bash
npm list --depth=0
```

### Check Package Versions
```bash
npm list react react-dom firebase
```

### View Project Structure
```bash
# Windows (PowerShell)
tree /F

# Linux/Mac
tree -L 3
```

## 🚨 Troubleshooting Commands

### Port Already in Use
```bash
# Windows (Find and kill process on port 5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

### Fix Permissions Issues (Linux/Mac)
```bash
sudo chown -R $USER:$USER .
```

### Clear Vite Cache
```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules/.vite

# Linux/Mac
rm -rf node_modules/.vite
```

## 📝 Git Commands

### Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Complete gym management app"
```

### Create .gitignore (Already Done)
The `.gitignore` file is already configured to exclude:
- `node_modules/`
- `dist/`
- `.env` files
- Firebase debug logs

### Push to GitHub
```bash
git remote add origin https://github.com/yourusername/gym-app.git
git branch -M main
git push -u origin main
```

## 🔐 Security Audit

### Check for Vulnerabilities
```bash
npm audit
```

### Fix Vulnerabilities
```bash
npm audit fix
```

### Force Fix (Use with Caution)
```bash
npm audit fix --force
```

## 📈 Performance Analysis

### Analyze Bundle Size
```bash
npm run build
```
Check the output for bundle sizes

### Check Build Stats
```bash
npm run build -- --mode=production
```

## 🎨 Development Tools

### Open in VS Code
```bash
code .
```

### Format Code with Prettier (if installed)
```bash
npx prettier --write "src/**/*.{js,jsx,css,md}"
```

## 🚀 Quick Workflows

### Complete Development Setup
```bash
npm install
cp .env.example .env
# Edit .env with your Firebase config
npm run dev
```

### Complete Production Deployment
```bash
npm run build
firebase deploy --only hosting
```

### Update and Redeploy
```bash
git pull
npm install
npm run build
firebase deploy --only hosting
```

### Create Production Backup
```bash
npm run build
# Copy dist folder to backup location
# Windows
xcopy /E /I dist dist-backup-$(date +%Y%m%d)
# Linux/Mac
cp -r dist dist-backup-$(date +%Y%m%d)
```

## 📱 Mobile Testing

### Test on Local Network
1. Find your local IP:
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

2. Update Vite config to expose server:
```javascript
// vite.config.js
export default defineConfig({
  server: {
    host: '0.0.0.0'
  }
})
```

3. Access from mobile: `http://YOUR_IP:5173`

## 🔄 Continuous Integration

### GitHub Actions (Auto-deploy)
Create `.github/workflows/deploy.yml` and commits will auto-deploy.

### Manual Deploy from CI
```bash
firebase deploy --token "$FIREBASE_TOKEN"
```

## 💡 Pro Tips

**Speed up npm install:**
```bash
npm ci  # Uses package-lock.json for faster, deterministic installs
```

**Run scripts silently:**
```bash
npm run build --silent
```

**Check which version of Node/npm:**
```bash
node --version
npm --version
```

**Update to latest npm:**
```bash
npm install -g npm@latest
```

---

## 📚 Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start dev server | `npm run dev` |
| Build production | `npm run build` |
| Deploy to Firebase | `firebase deploy` |
| Run linter | `npm run lint` |
| Preview build | `npm run preview` |

---

**Save this file for quick reference!**
