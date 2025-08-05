# 📁 GitHub Repository Setup

## Quick Setup (5 minutes)

### 1. Create GitHub Repository

1. Go to [https://github.com](https://github.com)
2. Click the "+" icon in the top right
3. Select "New repository"
4. Name it: `7plus-academy-crm`
5. Make it **Public** (for free deployment)
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### 2. Push Your Code

Run these commands in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/7plus-academy-crm.git

# Push your code
git push -u origin main
```

### 3. Verify Everything is Uploaded

Check that these files are in your GitHub repository:
- ✅ `package.json`
- ✅ `next.config.js`
- ✅ `app/` folder
- ✅ `components/` folder
- ✅ `data/` folder
- ✅ `README.md`

## 🚀 Ready for Deployment!

Once your code is on GitHub, you can deploy to:

### Vercel (Recommended)
- Go to [https://vercel.com](https://vercel.com)
- Sign up with GitHub
- Import your repository
- Deploy in 2 minutes

### Netlify (Alternative)
- Go to [https://netlify.com](https://netlify.com)
- Sign up with GitHub
- Import your repository
- Set build command: `npm run build`
- Deploy in 3 minutes

## 📋 What You'll Get

After deployment, you'll have:
- 🌐 **Public URL**: `https://your-app-name.vercel.app`
- 🔐 **Secure HTTPS**: Automatic SSL certificate
- 📱 **Mobile Responsive**: Works on all devices
- ⚡ **Fast Loading**: Global CDN
- 🔄 **Auto Updates**: Deploy new versions instantly

## 🎯 Share with Your Staff

Once deployed, share:
1. **The URL** with your staff
2. **Demo credentials**:
   - Admin: `admin` / `password123`
   - Staff: `staff_a` / `password123`

## 🔧 Custom Domain (Optional)

After deployment, you can:
1. Add a custom domain (e.g., `crm.7plusacademy.com`)
2. Set up email forwarding
3. Add your company branding

---

**Your CRM will be live and accessible to your staff worldwide! 🌍** 