# Gym Tracker Pro 🏋️

A professional, modern gym workout tracking Progressive Web App (PWA) built with React.

## Features ✨

- **Quick Workout Logging** - Add exercises with sets, reps, and weight
- **Smart Last Weight Display** - Automatically shows your previous weights
- **Personal Records Tracking** - Track your best lifts for each exercise
- **Progress Charts** - Visual graphs showing your strength progression over time
- **1RM Calculator** - Calculate your one-rep max with training percentages
- **Workout History** - View all your past workouts with detailed stats
- **Progressive Web App** - Install on your phone like a native app
- **Offline Support** - Works without internet after first load
- **Persistent Storage** - Your data never leaves your device

## Deployment Options 🚀

### Option 1: Vercel (Recommended for Beginners)

**Pros:**
- Absolutely free for personal projects
- Automatic deployments on every code change
- Built-in analytics and performance monitoring
- Excellent for React/Vite projects
- Custom domain support
- Zero configuration needed

**Cons:**
- None for this use case

#### Step-by-Step Vercel Deployment:

1. **Create a GitHub Account** (if you don't have one)
   - Go to https://github.com
   - Sign up for free

2. **Upload Your Code to GitHub**
   - Create a new repository on GitHub
   - Click "uploading an existing file"
   - Upload ALL the files from this project folder
   - Commit the changes

3. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "Sign Up" and sign in with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project
   - Click "Deploy" (no configuration needed!)
   - Wait 1-2 minutes for deployment

4. **Share Your App**
   - Copy the URL Vercel gives you (e.g., `gym-tracker-pro.vercel.app`)
   - Send it to your friend!
   - They can install it as an app from their phone browser

---

### Option 2: Netlify

**Pros:**
- Also completely free
- Great UI and dashboard
- Form handling if you want to add features later
- Drag-and-drop deployment option

**Cons:**
- Slightly more steps for first deployment

#### Step-by-Step Netlify Deployment:

1. **Build Your App Locally First**
   ```bash
   npm install
   npm run build
   ```
   This creates a `dist` folder with your built app.

2. **Deploy to Netlify**
   - Go to https://netlify.com
   - Sign up for free
   - Click "Add new site" → "Deploy manually"
   - Drag and drop your `dist` folder
   - Wait for deployment (30 seconds)

3. **Or Use GitHub (Better for Updates)**
   - Upload code to GitHub (same as Vercel steps 1-2)
   - On Netlify, click "Add new site" → "Import from Git"
   - Connect GitHub and select your repo
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy"

4. **Share Your App**
   - Copy your Netlify URL (e.g., `gym-tracker-pro.netlify.app`)
   - Send to your friend!

---

## How to Install as an App on iPhone 📱

Once deployed, your friend can install it like a real app:

1. **Open the URL in Safari** (must be Safari, not Chrome)
2. **Tap the Share button** (square with arrow pointing up)
3. **Scroll down and tap "Add to Home Screen"**
4. **Tap "Add"**

The app will now appear on their home screen like any other app!

---

## Local Development 💻

Want to test locally first?

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Project Structure 📁

```
gym-tracker-pro/
├── src/
│   ├── gym-tracker-pro.jsx  # Main app component
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind styles
├── public/
│   └── manifest.json        # PWA manifest
├── index.html               # HTML entry point
├── package.json             # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── README.md               # This file
```

---

## Vercel vs Netlify Comparison

| Feature | Vercel | Netlify |
|---------|--------|---------|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ Easiest | ⭐⭐⭐⭐ Easy |
| **Free Tier** | Unlimited | Unlimited |
| **Auto Deploy** | Yes | Yes |
| **Custom Domain** | Yes | Yes |
| **Speed** | Very Fast | Very Fast |
| **Best For** | React/Next.js | Any static site |

**Recommendation:** Use **Vercel** - it's the easiest and works perfectly with this React app.

---

## Updating Your App 🔄

After your initial deployment:

### If using Vercel or Netlify with GitHub:
1. Make changes to your code
2. Push to GitHub
3. App updates automatically (within 1 minute!)

### If using Netlify drag-and-drop:
1. Make changes to your code
2. Run `npm run build`
3. Drag the new `dist` folder to Netlify

---

## Adding a Custom Domain 🌐

Both Vercel and Netlify support custom domains for free!

### Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update your domain's DNS settings (they'll show you how)

### Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Follow DNS configuration steps

---

## Troubleshooting 🔧

**App not updating?**
- Clear browser cache
- Try in incognito/private mode
- On phone: Delete app and reinstall

**Storage not working?**
- Make sure you're using HTTPS (both services provide this)
- Check browser console for errors

**Icons not showing?**
- Upload icon images to the `public` folder
- Update paths in `manifest.json`

---

## What Makes This Pro-Level? 🏆

Compared to basic gym apps:

✅ **Real-time 1RM calculations** - Industry-standard Epley formula  
✅ **Progress visualization** - Interactive charts (like Strong, Hevy)  
✅ **Smart weight suggestions** - Shows your last lift  
✅ **Volume tracking** - Total weight lifted over time  
✅ **Personal records** - Automatically tracks your bests  
✅ **Modern UI** - Gradient design, smooth animations  
✅ **PWA support** - Installs like a native app  
✅ **Offline-first** - Works without internet  
✅ **Data privacy** - Everything stored locally  

---

## Next Steps 🎯

1. Deploy using Vercel (5 minutes)
2. Test on your phone
3. Share with your buddy
4. Start tracking gains!

**Need help?** The deployment platforms have excellent documentation:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com

---

## License

MIT - Use it however you want!
