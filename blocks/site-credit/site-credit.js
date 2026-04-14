export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cell = row.firstElementChild;
  if (!cell) return;

  block.innerHTML = '';
  const wrapper = document.createElement('p');
  wrapper.innerHTML = cell.innerHTML;
  block.append(wrapper);
}
