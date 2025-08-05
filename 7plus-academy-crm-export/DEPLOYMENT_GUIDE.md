# 🚀 Quick Deployment Guide for 7+ Academy CRM

## 📋 Prerequisites
- GitHub account
- 5 minutes of your time

## 🎯 Step-by-Step Deployment

### Option 1: Vercel (Recommended - Easiest)

1. **Create GitHub Repository**
   ```bash
   # If you haven't already, create a GitHub repo and push your code
   git remote add origin https://github.com/YOUR_USERNAME/7plus-academy-crm.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Sign up with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"
   - Wait 2-3 minutes for deployment

3. **Get Your URL**
   - Your app will be available at: `https://your-project-name.vercel.app`
   - Share this URL with your staff!

### Option 2: Netlify (Alternative)

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [https://netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Choose your repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Click "Deploy site"

3. **Get Your URL**
   - Your app will be available at: `https://your-site-name.netlify.app`

## 🔐 Demo Credentials

Share these credentials with your staff:

### Admin Access
- **Username**: `admin`
- **Password**: `password123`

### Staff Access
- **Username**: `staff_a`, `staff_b`, or `staff_c`
- **Password**: `password123`

## 📱 Features Your Staff Can Test

### For Administrators
1. **Dashboard Overview** - View all statistics
2. **User Management** - Add/edit staff accounts
3. **Task Assignment** - Reassign students to staff
4. **School Database** - Manage school information

### For Staff Members
1. **My Tasks** - View assigned students
2. **Student Management** - View and edit student info
3. **School Recommendations** - Get AI-powered suggestions

### For Everyone
1. **Student Database** - Search and filter students
2. **Application Form** - Add new students
3. **School Database** - Browse available schools

## 🔧 Customization

### Change Demo Data
- Edit `data/students.js` for student data
- Edit `data/schools.js` for school data
- Edit `app/api/auth/login/route.js` for user credentials

### Add Your Logo
- Replace the title in `app/layout.jsx`
- Add your logo to the `public` folder

## 🆘 Troubleshooting

### If deployment fails:
1. Check that all files are committed to GitHub
2. Ensure `package.json` has all dependencies
3. Verify Node.js version is 18+ in deployment settings

### If the app doesn't load:
1. Check the deployment logs
2. Verify the build command is correct
3. Ensure all environment variables are set (if any)

## 📞 Support

If you need help with deployment:
1. Check the deployment platform's documentation
2. Look at the build logs for errors
3. Contact the development team

---

**Your CRM will be live in minutes! 🎉** 