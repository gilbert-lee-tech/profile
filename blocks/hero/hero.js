/**
 * Adds a parallax scrolling effect to the hero background image.
 * The picture element translates at 40% of the scroll speed, creating depth.
 * Skipped when the user prefers reduced motion.
 * @param {Element} block - The hero block element
 */
export default function decorate(block) {
  const picture = block.querySelector('picture');
  if (!picture) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const PARALLAX_FACTOR = 0.4;
  let ticking = false;

  function updateParallax() {
    const rect = block.getBoundingClientRect();
    const offset = -rect.top * PARALLAX_FACTOR;
    picture.style.transform = `translateY(${offset}px)`;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  updateParallax();
  window.addEventListener('scroll', onScroll, { passive: true });
}
