// static/js/main.js

document.addEventListener("DOMContentLoaded", function () {
  // =============================
  // LESSONS PAGE (Alphabet) LOGIC
  // =============================
  const alphaContainer = document.querySelector('.alphabet-container');
  if (alphaContainer && !document.querySelector('.quiz-page-container')) {
    console.log("Lessons ALPHABET page detected");

    const LETTERS     = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let currentIndex  = 0;
    const signImage   = document.getElementById("sign-image");
    const prevArrow   = document.getElementById("prev-arrow");
    const nextArrow   = document.getElementById("next-arrow");
    const letterSpans = document.querySelectorAll(".letter");

    function showLetter(i) {
      if (i < 0) i = LETTERS.length - 1;
      if (i >= LETTERS.length) i = 0;
      currentIndex = i;
      const L      = LETTERS[i];
      const ext    = (L === "J" || L === "Z") ? "gif" : "jpeg";

      signImage.src = `/static/images/asl_alphabet/${L}.${ext}`;
      signImage.alt = `ASL Sign for Letter ${L}`;

      letterSpans.forEach(s => s.classList.remove("active-letter"));
      letterSpans[currentIndex]?.classList.add("active-letter");
    }

    showLetter(0);
    prevArrow.addEventListener("click", () => showLetter(currentIndex - 1));
    nextArrow.addEventListener("click", () => showLetter(currentIndex + 1));
    letterSpans.forEach((s, i) => s.addEventListener("click", () => showLetter(i)));
  }

  // =============================
  // LESSONS PAGE (Expressions) LOGIC
  // =============================
  const exprContainer = document.querySelector('.expressions-container');
  if (exprContainer && !document.querySelector('.quiz-page-container')) {
    console.log("Lessons EXPRESSIONS page detected");

    // Retrieve the data-expressions JSON
    let exprData = [];
    const dataAttr = exprContainer.dataset.expressions;
    if (dataAttr) {
      try {
        exprData = JSON.parse(dataAttr);
      } catch (e) {
        console.error('Invalid JSON in data-expressions', e);
      }
    }
    // fallback if window.EXPRESSIONS defined
    if (!exprData.length && typeof EXPRESSIONS !== 'undefined') {
      exprData = EXPRESSIONS;
    }
    if (!exprData.length) {
      console.warn('No expressions data available; skipping carousel.');
      return;
    }

    let idx     = 0;
    const imgEl = document.getElementById('sign-image');
    const capEl = document.getElementById('expression-label');
    const prev  = document.getElementById('prev-arrow');
    const next  = document.getElementById('next-arrow');
    const progEl = document.getElementById('expression-progress');

    function showExpression(i) {
      if (i < 0) i = exprData.length - 1;
      if (i >= exprData.length) i = 0;
      idx = i;
      const { key, label } = exprData[i];
      imgEl.src         = `/static/images/asl_expressions/${key}.gif`;
      imgEl.alt         = `ASL Expression: ${label}`;
      capEl.textContent = label;
      if (progEl) {
        progEl.textContent = `Expression ${idx + 1} of ${exprData.length}`;
      }
    }

    showExpression(0);
    prev.addEventListener('click', () => showExpression(idx - 1));
    next.addEventListener('click', () => showExpression(idx + 1));
  }

  // =============================
  // QUIZ PAGE LOGIC (Unified)
  // =============================
  const quizContainer = document.querySelector('.quiz-page-container');
  if (!quizContainer) return;
  console.log("Quiz page detected");

  const quizType        = quizContainer.dataset.quiz; // 'alphabet' or 'expressions'
  const LETTERS         = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const EXPR_KEYS       = (typeof EXPRESSIONS !== 'undefined') ? EXPRESSIONS.map(e => e.key) : [];
  const EXPR_LABELS     = (typeof EXPRESSIONS !== 'undefined') ? EXPRESSIONS.map(e => e.label) : [];
  const TOTAL_QUESTIONS = 5;

  const ALL_KEYS   = quizType === 'alphabet' ? LETTERS : EXPR_KEYS;
  const ALL_LABELS = quizType === 'alphabet' ? LETTERS : EXPR_LABELS;

  let questions            = [];
  let currentQuestionIndex = 0;
  let score                = 0;
  const userAnswers        = Array(TOTAL_QUESTIONS).fill(null);

  // DOM refs
  const progEl    = document.getElementById('question-progress');
  const imgElQ    = document.getElementById('quiz-sign-image');
  const promptEl  = document.querySelector('.quiz-prompt');
  const answerEls = [0,1,2,3].map(i => document.getElementById(`option${i}`));
  const backBtn   = document.getElementById('back-button');
  const nextBtn   = document.getElementById('next-button');
  const errorMsg  = document.getElementById('error-message');

  // shuffle
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // generate questions
  function generateQuestions() {
    questions = [];
    let pool = [...ALL_KEYS];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const pick        = Math.floor(Math.random() * pool.length);
      const correctKey  = pool.splice(pick, 1)[0];
      const correctLabel = ALL_LABELS[ALL_KEYS.indexOf(correctKey)];

      let wrongs = ALL_KEYS.filter(k => k !== correctKey);
      shuffle(wrongs);
      const distractors = wrongs.slice(0, 3);

      let opts = [correctKey, ...distractors];
      shuffle(opts);

      const options = opts.map(k =>
        quizType === 'alphabet'
          ? k
          : EXPRESSIONS.find(e => e.key === k).label
      );
      const correctIndex = options.indexOf(correctLabel);
      questions.push({ key: correctKey, label: correctLabel, options, correctIndex });
    }
  }

  function getExt(key) {
    return quizType === 'alphabet'
      ? (key === 'J' || key === 'Z' ? 'gif' : 'jpeg')
      : 'gif';
  }

  function showQuestion() {
    const q = questions[currentQuestionIndex];
    progEl.textContent = `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`;

    imgElQ.src = `/static/images/asl_${quizType}/${q.key}.${getExt(q.key)}`;
    imgElQ.alt = `ASL ${quizType === 'alphabet' ? 'Letter' : 'Expression'}: ${q.label}`;

    answerEls.forEach((btn, i) => {
      btn.textContent = q.options[i];
      btn.disabled    = false;
      btn.classList.remove('correct','wrong');
    });
    errorMsg.style.display = 'none';

    const prev = userAnswers[currentQuestionIndex];
    if (prev !== null) {
      answerEls.forEach(b => b.disabled = true);
      if (prev === q.correctIndex) {
        answerEls[prev].classList.add('correct');
        answerEls[prev].textContent += ' ✔';
      } else {
        answerEls[prev].classList.add('wrong');
        answerEls[prev].textContent += ' ✘';
        answerEls[q.correctIndex].classList.add('correct');
        answerEls[q.correctIndex].textContent += ' ✔';
      }
      nextBtn.disabled = false;
    } else {
      nextBtn.disabled = true;
    }

    backBtn.disabled = (currentQuestionIndex === 0);
  }

  generateQuestions();
  showQuestion();
  answerEls.forEach((btn,i) => btn.addEventListener('click', () => {
    if (userAnswers[currentQuestionIndex] === null && i === questions[currentQuestionIndex].correctIndex) score++;
    userAnswers[currentQuestionIndex] = i;
    showQuestion();
  }));

  backBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      showQuestion();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (userAnswers[currentQuestionIndex] === null) {
      errorMsg.style.display = 'block';
      return;
    }
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      currentQuestionIndex++;
      showQuestion();
    } else {
      progEl.style.display               = 'none';
      promptEl.style.display             = 'none';
      document.querySelector('.quiz-answers').style.display = 'none';
      backBtn.style.display              = 'none';
      nextBtn.style.display              = 'none';
      document.querySelector('.sign-viewer').style.display = 'none';
      document.getElementById('expression-progress') && (document.getElementById('expression-progress').style.display = 'none');

      const final = document.getElementById('final-screen');
      final.style.display                = 'block';
      document.getElementById('final-score').textContent = `Your Score: ${score} out of ${TOTAL_QUESTIONS}!`;
    }
  });

  document.getElementById('retry-button').addEventListener('click', () => {
    score = 0;
    currentQuestionIndex = 0;
    userAnswers.fill(null);
    generateQuestions();
    showQuestion();
    document.getElementById('final-screen').style.display = 'none';
  });

  document.getElementById('home-button').addEventListener('click', () => {
    window.location.href = '/';
  });

  document.getElementById('lesson-button').addEventListener('click', () => {
    const target = quizType === 'alphabet' ? '/lessons/alphabet' : '/lessons/expressions';
    window.location.href = target;
  });
});