async function displayLastModified() {
  try {
    const response = await fetch(window.location.href, { method: 'HEAD' });
    const lastModified = response.headers.get('last-modified');
    if (!lastModified) return;

    const siteCredit = document.querySelector('.site-credit');
    if (!siteCredit) return;

    const date = new Date(lastModified);
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const p = document.createElement('p');
    const time = document.createElement('time');
    time.setAttribute('datetime', date.toISOString());
    time.textContent = `Last updated: ${formatted}`;
    p.append(time);
    siteCredit.append(p);
  } catch {
    // silently fail — last modified date is non-critical
  }
}

displayLastModified();
