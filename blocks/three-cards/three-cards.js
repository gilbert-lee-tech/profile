import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Three Cards block: same content model as Cards (image + body per row), rendered as a list
 * with up to three cards per row on wide viewports; extra cards wrap, and short last rows
 * stay centered.
 * When the block enters the viewport, each card animates over 1s from translateY(-100px) and
 * opacity 0.5 to translateY(0) and opacity 1 (IntersectionObserver; CSS handles motion;
 * reduced motion is respected in three-cards.css).
 *
 * EDS sample block (Markdown table in document / `.md`):
 *
 * | three-cards | |
 * | --- | --- |
 * | ![Project screenshot](image1.jpg) | **First project** Short description of the work. |
 * | ![Project screenshot](image2.jpg) | **Second project** Short description of the work. |
 * | ![Project screenshot](image3.jpg) | **Third project** Short description of the work. |
 *
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

  block.classList.add('three-cards-animate');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          block.classList.add('three-cards-visible');
          observer.unobserve(block);
        }
      });
    },
    { rootMargin: '0px', threshold: 0.15 },
  );
  observer.observe(block);
}
