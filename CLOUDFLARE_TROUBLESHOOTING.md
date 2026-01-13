# Cloudflare Pages Troubleshooting

## "Edit Code" Button

The **"Edit Code"** button in Cloudflare Pages dashboard allows you to:
- View and edit files directly in the Cloudflare interface
- Make quick changes without using Git
- It opens the Cloudflare online code editor

**Note**: Changes made via "Edit Code" are temporary and will be overwritten on the next Git deployment. It's better to make changes locally and push to Git.

## Why You See "Hello World"

If you're seeing "Hello World" instead of your portfolio, it means Cloudflare Pages is either:
1. Not finding your `index.html` file
2. Using the wrong build output directory
3. Showing a default template

## Solution: Verify Build Settings

In your Cloudflare Pages project settings, verify:

### Build Configuration

1. **Build command**: `npm run build`
2. **Build output directory**: `/` (just a forward slash - this is the root directory)
3. **Root directory**: Leave empty or `/`
4. **Framework preset**: `None` or `Static Site`

### Important Checks

1. **Make sure `index.html` is in the root** of your repository
2. **Make sure `_redirects` file is in the root** (it should be)
3. **Check build logs** in Cloudflare Pages to see if the build succeeded
4. **Verify all files are committed** to Git:
   ```bash
   git status
   git add .
   git commit -m "Ensure all files are committed"
   git push
   ```

## Common Issues

### Issue 1: Build Output Directory Wrong

**Wrong**: `/dist` or `/build` or `/public`
**Correct**: `/` (root directory)

Your files (`index.html`, `blog.html`, `assets/`, etc.) are all in the root, so the output directory must be `/`.

### Issue 2: Files Not Committed

Make sure these files are committed:
- `index.html`
- `blog.html`
- `_redirects`
- `assets/` directory
- `blog-posts/` directory (generated during build)

### Issue 3: Build Failing Silently

Check the build logs in Cloudflare Pages:
1. Go to your project
2. Click on the latest deployment
3. Check the build logs for errors

### Issue 4: Custom Domain Not Configured

If using a custom domain:
1. Go to project settings → Custom domains
2. Add your domain
3. Update DNS records as instructed

## Quick Fix Steps

1. **Verify your build output directory is `/`**
2. **Check build logs** for any errors
3. **Ensure all files are pushed to Git**:
   ```bash
   git add .
   git commit -m "Fix deployment"
   git push
   ```
4. **Redeploy** - Cloudflare Pages will automatically redeploy on push
5. **Clear browser cache** and try again

## Verify Files Are Deployed

After deployment, you can check what files Cloudflare Pages deployed:
1. Go to your project in Cloudflare Pages
2. Click on a deployment
3. Look for "View deployment" or "Browse files"
4. Verify `index.html` is there

If `index.html` is missing, the build output directory is wrong.
