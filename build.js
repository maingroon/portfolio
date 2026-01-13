const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');
const matter = require('front-matter');

// Configure marked for syntax highlighting
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error('Highlight error:', err);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

// Read blog posts directory
const blogDir = path.join(__dirname, 'blog');
const outputDir = path.join(__dirname, 'blog-posts');
const templatePath = path.join(__dirname, 'templates', 'blog-post.html');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read template
const template = fs.readFileSync(templatePath, 'utf8');

// Get all markdown files
const markdownFiles = fs.readdirSync(blogDir)
  .filter(file => file.endsWith('.md'))
  .map(file => ({
    filename: file,
    path: path.join(blogDir, file)
  }));

// Process each markdown file
const posts = [];

markdownFiles.forEach(({ filename, path: filePath }) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const { attributes, body } = matter(content);
  
  // Convert markdown to HTML
  const htmlContent = marked.parse(body);
  
  // Generate slug from filename
  const slug = filename.replace('.md', '');
  
  // Create post object
  const post = {
    slug,
    title: attributes.title || slug,
    date: attributes.date || new Date().toISOString().split('T')[0],
    tags: attributes.tags || [],
    excerpt: attributes.excerpt || body.substring(0, 200) + '...',
    content: htmlContent
  };
  
  posts.push(post);
  
  // Generate HTML page
  let postHtml = template
    .replace('{{TITLE}}', post.title)
    .replace('{{EXCERPT}}', post.excerpt.replace(/"/g, '&quot;'))
    .replace('{{DATE}}', new Date(post.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }))
    .replace('{{CONTENT}}', post.content);
  
  // Add tags if they exist
  if (post.tags.length > 0) {
    const tagsHtml = '<div class="post-tags">' + 
      post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') + 
      '</div>';
    postHtml = postHtml.replace('{{TAGS}}', tagsHtml);
  } else {
    postHtml = postHtml.replace('{{TAGS}}', '');
  }
  
  // Write HTML file
  const outputPath = path.join(outputDir, `${slug}.html`);
  fs.writeFileSync(outputPath, postHtml);
  
  console.log(`Generated: ${slug}.html`);
});

// Sort posts by date (newest first)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Generate posts metadata JSON for blog listing
const postsMetadata = posts.map(post => ({
  slug: post.slug,
  title: post.title,
  date: post.date,
  tags: post.tags,
  excerpt: post.excerpt
}));

fs.writeFileSync(
  path.join(__dirname, 'assets', 'js', 'posts.json'),
  JSON.stringify(postsMetadata, null, 2)
);

console.log(`\nProcessed ${posts.length} blog posts`);
console.log('Build complete!');
