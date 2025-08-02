# Netlify Deployment Guide for MedAgg 2.0 Chatbot

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git repository (optional but recommended)

## Step 1: Prepare Your Project

### 1.1 Move the Chatbot Image
**IMPORTANT**: Copy `Chatbot.jpeg` from the `public/` folder to `src/images/` folder:
```bash
# Create the images directory if it doesn't exist
mkdir src/images

# Copy the image file
copy public/Chatbot.jpeg src/images/Chatbot.jpeg
```

### 1.2 Install Dependencies
```bash
npm install
```

### 1.3 Test Local Build
```bash
npm run build
```
This will create a `dist` folder with your production-ready files.

## Step 2: Deploy to Netlify

### Option A: Drag & Drop Deployment
1. Run `npm run build` to create the `dist` folder
2. Go to [netlify.com](https://netlify.com) and sign up/login
3. Drag and drop the entire `dist` folder to the Netlify deploy area
4. Your site will be live instantly!

### Option B: Git-based Deployment (Recommended)
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Netlify will automatically detect the build settings from `netlify.toml`
4. Deploy settings will be:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

## Step 3: Configuration Files Created

### `netlify.toml`
- Configures build settings
- Sets up redirects for SPA routing
- Optimizes caching headers

### `public/_redirects`
- Fallback routing for single-page application
- Ensures all routes serve `index.html`

### Updated `webpack.config.js`
- Added asset handling for images
- Content hashing for cache busting
- Code splitting optimization
- SPA routing support

## Step 4: Verify Deployment

After deployment, test:
1. ✅ Main page loads
2. ✅ Chatbot toggle button appears with image
3. ✅ Chatbot opens and functions properly
4. ✅ All icons are visible (send button, voice button, avatars)
5. ✅ Messages send and receive correctly

## Troubleshooting

### Image Not Loading
- Ensure `Chatbot.jpeg` is in `src/images/` folder
- Check that the import path is correct in `chatbot.jsx`

### Build Fails
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (should be 18+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### SPA Routing Issues
- Verify `_redirects` file is in the `public/` folder
- Check `netlify.toml` redirect configuration

## Performance Optimizations Included

1. **Content Hashing**: Files have unique hashes for cache busting
2. **Code Splitting**: Automatic chunk splitting for better loading
3. **Asset Optimization**: Images are processed and optimized
4. **Caching Headers**: Long-term caching for static assets
5. **Gzip Compression**: Automatic compression on Netlify

## Custom Domain (Optional)
After deployment, you can:
1. Add a custom domain in Netlify dashboard
2. Enable HTTPS (automatic with Netlify)
3. Set up form handling if needed

Your MedAgg 2.0 chatbot is now ready for production deployment! 🚀
