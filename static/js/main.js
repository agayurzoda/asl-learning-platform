// static/js/main.js

document.addEventListener("DOMContentLoaded", function () {
  // =============================
  // LESSONS PAGE (Alphabet) LOGIC
  // =============================
  if (document.getElementById("sign-image") && !document.getElementById("question-progress")) {
    console.log("Lessons ALPHABET page detected");

    const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let currentIndex = 0;
    
    const signImage   = document.getElementById("sign-image");
    const prevArrow   = document.getElementById("prev-arrow");
    const nextArrow   = document.getElementById("next-arrow");
    const letterSpans = document.querySelectorAll(".letter");
    
    function showLetter(index) {
      if (index < 0) index = LETTERS.length - 1;
      if (index >= LETTERS.length) index = 0;
      currentIndex = index;
      const letter = LETTERS[currentIndex];
      const ext    = (letter === "J" || letter === "Z") ? "gif" : "jpeg";
      
      signImage.src = `/static/images/asl_alphabet/${letter}.${ext}`;
      signImage.alt = `ASL Sign for Letter ${letter}`;
      
      letterSpans.forEach(span => span.classList.remove("active-letter"));
      letterSpans[currentIndex]?.classList.add("active-letter");
    }
    
    showLetter(0);
    prevArrow.addEventListener("click", () => showLetter(currentIndex - 1));
    nextArrow.addEventListener("click", () => showLetter(currentIndex + 1));
    letterSpans.forEach((span, idx) => span.addEventListener("click", () => showLetter(idx)));
  }
  
  // =============================
  // LESSONS PAGE (Expressions) LOGIC
  // =============================
  const exprContainer = document.querySelector(".expressions-container");
  if (exprContainer && !document.getElementById("question-progress")) {
    console.log("Lessons EXPRESSIONS page detected");

    let idx = 0;
    const imgEl = document.getElementById("sign-image");
    const capEl = document.getElementById("expression-label");
    const prev  = document.getElementById("prev-arrow");
    const next  = document.getElementById("next-arrow");

    function showExpression(i) {
      if (i < 0)      i = EXPRESSIONS.length - 1;
      if (i >= EXPRESSIONS.length) i = 0;
      idx = i;
      const { key, label } = EXPRESSIONS[i];
      imgEl.src         = `/static/images/asl_expressions/${key}.gif`;
      imgEl.alt         = `ASL Expression: ${label}`;
      capEl.textContent = label;
    }

    showExpression(0);
    prev.addEventListener("click", () => showExpression(idx - 1));
    next.addEventListener("click", () => showExpression(idx + 1));
  }

  // =============================
  // QUIZ PAGE LOGIC (Unified)
  // =============================
  const quizContainer = document.querySelector('.quiz-page-container');
  if (quizContainer) {
    console.log("Quiz page detected");

    const quizType        = quizContainer.dataset.quiz; // "alphabet" or "expressions"
    const LETTERS         = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const EXPR_KEYS       = EXPRESSIONS.map(e => e.key);
    const EXPR_LABELS     = EXPRESSIONS.map(e => e.label);
    const TOTAL_QUESTIONS = 5;

    const ALL_KEYS   = quizType === 'alphabet' ? LETTERS   : EXPR_KEYS;
    const ALL_LABELS = quizType === 'alphabet' ? LETTERS   : EXPR_LABELS;

    let questions            = [];
    let currentQuestionIndex = 0;
    let score                = 0;

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    function generateQuestions() {
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

    const progEl  = document.getElementById('question-progress');
    const imgElQ  = document.getElementById('quiz-sign-image');
    const btns    = [0, 1, 2, 3].map(i => document.getElementById(`option${i}`));
    const nextBtn = document.getElementById('next-button');

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

      btns.forEach((b, i) => {
        b.textContent = q.options[i];
        b.disabled    = false;
        b.classList.remove('correct', 'wrong');
      });
      nextBtn.disabled = true;
    }

    function handleAnswer(selectedIdx) {
      const q = questions[currentQuestionIndex];
      if (selectedIdx !== q.correctIndex) {
        btns[selectedIdx].classList.add('wrong');
        btns[selectedIdx].textContent += ' ✘';
      }
      btns[q.correctIndex].classList.add('correct');
      btns[q.correctIndex].textContent += ' ✔';

      if (selectedIdx === q.correctIndex) score++;
      btns.forEach(b => b.disabled = true);
      nextBtn.disabled = false;
    }

    // Start quiz
    generateQuestions();
    showQuestion();
    btns.forEach((b, i) => b.addEventListener('click', () => handleAnswer(i)));
    nextBtn.addEventListener('click', () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < TOTAL_QUESTIONS) {
        showQuestion();
      } else {
        progEl.style.display                = 'none';
        document.querySelector('.sign-viewer').style.display  = 'none';
        document.querySelector('.quiz-prompt').style.display  = 'none';
        document.querySelector('.quiz-answers').style.display = 'none';
        nextBtn.style.display               = 'none';

        const final = document.getElementById('final-screen');
        final.style.display = 'block';
        document.getElementById('final-score').textContent =
          `Your Score: ${score} out of ${TOTAL_QUESTIONS}!`;
      }
    });

    // Retry & Home
    document.getElementById('retry-button').addEventListener('click', () => {
      questions = [];
      currentQuestionIndex = 0;
      score = 0;
      generateQuestions();
      showQuestion();

      progEl.style.display                           = '';
      nextBtn.style.display                          = '';
      document.querySelector('.sign-viewer').style.display  = '';
      document.querySelector('.quiz-prompt').style.display  = '';
      document.querySelector('.quiz-answers').style.display = '';
      document.getElementById('final-screen').style.display = 'none';
    });

    document.getElementById('home-button').addEventListener('click', () => {
      window.location.href = '/';
    });
  }
});
