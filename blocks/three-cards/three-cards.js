import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Three Cards block: same content model as Cards (image + body per row), rendered as a list
 * with up to three cards per row on wide viewports; extra cards wrap, and short last rows stay centered.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'three-cards-card-image';
      else div.className = 'three-cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
