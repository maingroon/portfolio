// Cloudflare Pages Function to serve static files
// This middleware passes all requests through to static files

export async function onRequest(context) {
  // Simply pass through to static files - don't intercept
  return context.next();
}
