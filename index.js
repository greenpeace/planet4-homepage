/* global addEventListener, fetch */

addEventListener('fetch', event => {
  event.passThroughOnException();
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const requestURL = new URL(request.url);
  const path = requestURL.pathname.replace(/\/+$/, '');

  if (requestURL.search.indexOf('&preview=true') == -1) {
    if (!path || path == '/') {
      return await fetch('https://storage.googleapis.com/planet4-homepage/index.html');
    }

    if (path == '/features') {
      return await fetch('https://storage.googleapis.com/planet4-homepage/features/index.html');
    }
  }

  const response = await fetch(request);

  return response;
}
