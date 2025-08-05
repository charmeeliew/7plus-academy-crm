#!/bin/bash

echo "🚀 Deploying 7+ Academy CRM..."

# Build the project
echo "📦 Building project..."
npm run build

# Create a simple server for deployment
echo "🌐 Creating deployment package..."

# Create a simple package.json for deployment
cat > package-deploy.json << 'EOF'
{
  "name": "7plus-academy-crm",
  "version": "1.0.0",
  "description": "7+ Academy Student Management CRM",
  "scripts": {
    "start": "next start -p $PORT",
    "build": "next build"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "lucide-react": "^0.263.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

echo "✅ Deployment package created!"
echo ""
echo "🌍 To deploy to a public URL, you have several options:"
echo ""
echo "1. Vercel (Recommended):"
echo "   - Go to https://vercel.com"
echo "   - Sign up with GitHub"
echo "   - Import this repository"
echo "   - Deploy automatically"
echo ""
echo "2. Netlify:"
echo "   - Go to https://netlify.com"
echo "   - Sign up and connect GitHub"
echo "   - Import this repository"
echo "   - Set build command: npm run build"
echo "   - Set publish directory: .next"
echo ""
echo "3. Railway:"
echo "   - Go to https://railway.app"
echo "   - Sign up with GitHub"
echo "   - Import this repository"
echo "   - Deploy automatically"
echo ""
echo "4. Render:"
echo "   - Go to https://render.com"
echo "   - Sign up and connect GitHub"
echo "   - Create new Web Service"
echo "   - Import this repository"
echo ""
echo "📋 Your repository is ready for deployment!"
echo "🔗 Once deployed, you'll get a public URL like: https://your-app-name.vercel.app"
echo ""
echo "📧 Share the URL with your staff along with these demo credentials:"
echo "   Admin: admin / password123"
echo "   Staff: staff_a / password123" 