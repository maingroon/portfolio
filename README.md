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

Simply upload the contents of the project directory (excluding `node_modules` and `blog/` source files if you prefer).
