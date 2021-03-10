/* global addEventListener, fetch */

addEventListener('fetch', event => {
  event.passThroughOnException();
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const requestURL = new URL(request.url);
  const path = requestURL.pathname.replace(/\/+$/, '');
  const search = requestURL.search;

  if (path == '/features') {
    return await fetch('https://storage.googleapis.com/planet4-homepage/features/index.html');
  }

  if (!path || path == '/') {
    if (!search.includes('?s=') && !search.includes('&preview=true')) {
      return await fetch('https://storage.googleapis.com/planet4-homepage/index.html');
    }
  }

  const response = await fetch(request);

  return response;
}
