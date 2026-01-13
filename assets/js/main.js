// Main JavaScript functionality

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 75; // Account for fixed header (75px)
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Load recent blog posts on homepage
async function loadRecentPosts() {
    const container = document.getElementById('recent-posts');
    if (!container) return;
    
    try {
        const response = await fetch('assets/js/posts.json');
        if (!response.ok) throw new Error('Failed to load posts');
        
        const posts = await response.json();
        const recentPosts = posts.slice(0, 3); // Get 3 most recent
        
        if (recentPosts.length === 0) {
            container.innerHTML = '<p>No blog posts yet. Check back soon!</p>';
            return;
        }
        
        container.innerHTML = recentPosts.map(post => {
            const date = new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return `
                <article class="bg-panel rounded-[5px] shadow-custom p-4 mb-6">
                    <h3 class="m-0 mb-2 text-2xl font-bold"><a href="/blog/${post.slug}" class="text-text no-underline hover:underline">${post.title}</a></h3>
                    <div class="mb-2 text-muted text-sm">
                        <span class="post-date">${date}</span>
                    </div>
                    <p class="m-0 mb-3 text-muted leading-[1.6]">${post.excerpt}</p>
                    <a href="/blog/${post.slug}" class="text-text no-underline hover:underline">Read More →</a>
                </article>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading recent posts:', error);
        container.innerHTML = '<p>Unable to load recent posts.</p>';
    }
}

// Lazy load images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    loadRecentPosts();
    initLazyLoading();
});
