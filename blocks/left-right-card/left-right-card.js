import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Left-Right Card block: same content model as Cards (image + body per row),
 * but each card occupies a single row with a horizontal left/right layout.
 * When the image is authored in the first column it appears on the left;
 * when authored in the second column it appears on the right.
 * Cards are 80% wide, centred, with a 4/8 flex image-to-body ratio,
 * rounded corners, and a drop shadow.
 *
 * EDS sample block (Markdown table in document / `.md`):
 *
 * Image left:
 * | left-right-card | |
 * | --- | --- |
 * | ![Project screenshot](image.jpg) | **Title** Description of the work. |
 *
 * Image right:
 * | left-right-card | |
 * | --- | --- |
 * | **Title** Description of the work. | ![Project screenshot](image.jpg) |
 *
 * @param {Element} block The block element
 */
const hasPicture = (div) => div.children.length === 1 && !!div.querySelector('picture');

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      div.className = hasPicture(div) ? 'left-right-card-image' : 'left-right-card-body';
    });

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(
    createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
  ));

  block.replaceChildren(ul);
}
