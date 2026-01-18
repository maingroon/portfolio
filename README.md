# Portfolio Website

A professional portfolio website with a blog section.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the site:
```bash
npm run build
```

This will convert all Markdown files in the `blog/` directory to HTML pages in the `blog-posts/` directory.

## Development

To add a new blog post:

1. Create a new `.md` file in the `blog/` directory
2. Add frontmatter at the top:
```yaml
---
title: Post Title
date: 2024-01-15
tags: [java, spring, tutorial]
excerpt: A brief description of post
---
```
3. Write a content in Markdown
4. Run `npm run build` to generate the HTML

## Deployment

### GitHub Pages

This project is configured for GitHub Pages deployment. Follow these steps:

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**

3. **Build and deploy**:
   ```bash
   npm run build
   git add .
   git commit -m "Build for GitHub Pages"
   git push
   ```

4. **Your site will be available at**:
   - `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` (for project repos)
   - `https://YOUR_USERNAME.github.io/` (if repo is named `YOUR_USERNAME.github.io`)

**Note**: Make sure to run `npm run build` before each deployment to generate the latest blog posts and CSS files.
