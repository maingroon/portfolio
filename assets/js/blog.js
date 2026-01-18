// Blog functionality
let allPosts = [];
let filteredPosts = [];

// Load posts from JSON file
async function loadPosts() {
    try {
        const response = await fetch('assets/js/posts.json');
        if (!response.ok) {
            throw new Error('Failed to load posts');
        }
        allPosts = await response.json();
        filteredPosts = [...allPosts];
        renderPosts();
        renderTagFilter();
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('blog-posts-list').innerHTML = 
            '<p class="error">Failed to load blog posts. Please try again later.</p>';
    }
}

// Render blog posts
function renderPosts() {
    const container = document.getElementById('blog-posts-list');
    const noResults = document.getElementById('no-results');
    
    if (filteredPosts.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    container.innerHTML = filteredPosts.map(post => {
        const date = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const tagsHtml = post.tags && post.tags.length > 0
            ? `<div class="post-tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
            : '';
        
        return `
            <article class="blog-post-card">
                <div class="post-card-content">
                    <h2 class="post-title">
                        <a href="./blog-posts/${post.slug}.html">${post.title}</a>
                    </h2>
                    <div class="post-meta">
                        <span class="post-date">${date}</span>
                        ${tagsHtml}
                    </div>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <a href="./blog-posts/${post.slug}.html" class="read-more">Read More →</a>
                </div>
            </article>
        `;
    }).join('');
}

// Render tag filter
function renderTagFilter() {
    const tagFilter = document.getElementById('tag-filter');
    const allTags = new Set();
    
    allPosts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => allTags.add(tag));
        }
    });
    
    if (allTags.size === 0) {
        tagFilter.style.display = 'none';
        return;
    }
    
    const tagsArray = Array.from(allTags).sort();
    tagFilter.innerHTML = '<span class="filter-label">Filter by tag:</span>' +
        tagsArray.map(tag => 
            `<button class="tag-filter-btn" data-tag="${tag}">${tag}</button>`
        ).join('');
    
    // Add event listeners to tag buttons
    tagFilter.querySelectorAll('.tag-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTag = btn.dataset.tag;
            btn.classList.toggle('active');
            filterPosts();
        });
    });
}

// Filter posts based on search and tags
function filterPosts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const activeTags = Array.from(document.querySelectorAll('.tag-filter-btn.active'))
        .map(btn => btn.dataset.tag);
    
    filteredPosts = allPosts.filter(post => {
        // Search filter
        const matchesSearch = !searchTerm || 
            post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        
        // Tag filter
        const matchesTags = activeTags.length === 0 ||
            (post.tags && activeTags.some(tag => post.tags.includes(tag)));
        
        return matchesSearch && matchesTags;
    });
    
    renderPosts();
}

// Initialize blog functionality when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadPosts();
        setupSearch();
    });
} else {
    loadPosts();
    setupSearch();
}

// Setup search input
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterPosts);
    }
}
