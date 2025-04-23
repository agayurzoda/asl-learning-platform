export function initCarousel() {
  const items = window.items;
  let idx = 0;
  const imgEl = document.getElementById('carouselImage');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const letters = document.querySelectorAll('#letterGrid .letter');

  function update() {
    const item = items[idx];
    imgEl.src = `/static/images/${item.file}`;
    imgEl.alt = item.key;
    letters.forEach((el, i) => el.classList.toggle('active', i === idx));
  }

  prevBtn.addEventListener('click', () => {
    idx = (idx - 1 + items.length) % items.length;
    update();
  });
  nextBtn.addEventListener('click', () => {
    idx = (idx + 1) % items.length;
    update();
  });
  letters.forEach(el => el.addEventListener('click', () => {
    idx = parseInt(el.dataset.index);
    update();
  }));

  update();
}
