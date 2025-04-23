export function initQuiz() {
  const items = window.items;
  const container = document.getElementById('quiz-container');
  let score = 0, q = 0;

  function nextQ() {
    if (q >= items.length) {
      container.innerHTML = `
        <h2>Your score: ${score}/${items.length}</h2>
        <button onclick="location.reload()" class="btn mt-4">Retry</button>
      `;
      return;
    }
    const item = items[q++];
    const choices = [item.key];
    while (choices.length < 4) {
      const rand = items[Math.floor(Math.random() * items.length)].key;
      if (!choices.includes(rand)) choices.push(rand);
    }
    choices.sort();

    container.innerHTML = `
      <img src="/static/images/${item.file}" alt="${item.key}" class="quiz-img">
      <div id="opts"></div>
    `;
    const opts = document.getElementById('opts');
    choices.forEach(c => {
      const b = document.createElement('button');
      b.textContent = c;
      b.className = 'btn m-2';
      b.addEventListener('click', () => {
        if (c === item.key) score++;
        nextQ();
      });
      opts.appendChild(b);
    });
  }

  nextQ();
}
