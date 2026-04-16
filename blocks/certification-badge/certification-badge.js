/**
 * Certification Badge block: renders a list of certifications. Each row may
 * contain up to three columns in any order — the block auto-detects each
 * column type and renders them in the authored order:
 *
 * - **Link column** (contains an `<a>`) — styled as a green "Verified ✓" badge
 *   if the href contains `credential/verify`, otherwise as an outlined
 *   "View Course" button. Opens in a new tab with `aria-label`.
 * - **Image column** (contains an `<img>`) — rendered as an optimized 80px
 *   badge icon via `createOptimizedPicture`.
 * - **Name column** (plain text) — certification title.
 *
 * Column order in the Google Doc controls display order on the page.
 *
 * EDS sample block (Markdown table in document / `.md`):
 *
 * | certification-badge | | |
 * | --- | --- | --- |
 * | [Verify](https://certification.adobe.com/credential/verify/xxx) | ![Adobe Certified Expert badge](badge.png) | Adobe Experience Manager Sites Developer Certified Expert |
 * | [View Course](https://certification.adobe.com/courses/1308) | | Adobe Experience Manager Edge Delivery Services - Developer Professional |
 *
 * @param {Element} block The block element
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

const isLinkColumn = (col) => !!col.querySelector('a[href]');
const isImageColumn = (col) => !!col.querySelector('img');
const isNameColumn = (col) => !isLinkColumn(col) && !isImageColumn(col);

function decorateLink(link) {
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.setAttribute('aria-label', `${link.textContent.trim()} (opens in new tab)`);
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    [...row.children].forEach((col) => {
      if (isLinkColumn(col)) {
        const link = col.querySelector('a');
        decorateLink(link);
        link.className = link.href.includes('credential/verify')
          ? 'certification-badge-verify'
          : 'certification-badge-course';
        li.append(link);
      } else if (isImageColumn(col)) {
        const img = col.querySelector('img');
        const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '80' }]);
        picture.classList.add('certification-badge-icon');
        li.append(picture);
      } else if (isNameColumn(col)) {
        const name = document.createElement('span');
        name.className = 'certification-badge-name';
        name.textContent = col.textContent.trim();
        li.append(name);
      }
    });

    ul.append(li);
  });

  block.replaceChildren(ul);
}
