# Dealer's Choice - Railway Deployment

Automated recruitment platform with AI-powered candidate discovery.

## 🚀 Quick Deploy to Railway

### Method 1: Deploy via GitHub (Recommended)

1. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Create a new repository (e.g., "dealers-choice-website")
   - Upload all files from this folder

2. **Deploy to Railway:**
   - Go to https://railway.app
   - Sign in with GitHub
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your repository
   - Railway will automatically detect and deploy!

3. **Generate Domain:**
   - Once deployed, go to **Settings** → **Networking**
   - Click **"Generate Domain"**
   - Your site will be live at: `https://your-project.up.railway.app`

---

### Method 2: Deploy via Railway CLI

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Initialize project:**
   ```bash
   cd path/to/this/folder
   railway init
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

5. **Add domain:**
   ```bash
   railway domain
   ```

---

## 📁 Files Included

- `index.html` - Your main website
- `Ace.svg` - Logo/favicon
- `server.js` - Express server for Railway
- `package.json` - Node.js dependencies
- `.gitignore` - Git ignore rules
- `README.md` - This file

---

## 🔧 Local Development

To test locally before deploying:

```bash
npm install
npm start
```

Visit: http://localhost:3000

---

## 🌐 Environment Variables (Optional)

If you need environment variables:

1. In Railway dashboard → **Variables** tab
2. Add your variables
3. They'll be available as `process.env.VARIABLE_NAME`

---

## ✅ Deployment Checklist

- [ ] All files uploaded to GitHub
- [ ] Railway connected to GitHub repo
- [ ] Project deployed successfully
- [ ] Custom domain generated
- [ ] Website loads correctly
- [ ] Test all payment flows
- [ ] Test access token system

---

## 🆘 Troubleshooting

**Build fails?**
- Check Railway logs in the dashboard
- Make sure `package.json` and `server.js` are in root directory

**Site not loading?**
- Verify the domain is generated
- Check Railway logs for errors
- Make sure PORT is set to `process.env.PORT`

**Need help?**
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

---

## 📞 Support

For questions: bernardliatme@outlook.com

---

## 🎉 You're All Set!

Your Dealer's Choice website is ready to deploy. Follow the steps above and you'll be live in minutes!
