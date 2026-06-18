import { pokemonList } from './data/pokemon.js';
import { renderMenu } from './components/menu.js';
import { gameState } from './services/gameState.js';
import { renderQuiz } from './components/quiz.js';
import { saveState, loadState } from './services/gameState.js';
let currentView = 'menu';
const app = document.querySelector('#app');

function renderView() {
  if (currentView === 'menu') {
    app.innerHTML = renderMenu();

    updateMaxQuestions();

    document
      .querySelectorAll('input[type="checkbox"]')
      .forEach(cb => {
        cb.addEventListener('change', updateMaxQuestions);
      });

    document
      .querySelector('#question-count')
      .addEventListener('input', updateMaxQuestions);

    attachMenuEvents();
  }

  if (currentView === 'stats') {
    renderStats();
  }
}

function attachMenuEvents() {
  const startBtn = document.querySelector('#start-button');
  const statsBtn = document.querySelector('#stats-button');

  if (startBtn) {
    startBtn.onclick = () => {
      currentView = 'quiz';
      startGame();
    };
  }

  if (statsBtn) {
    statsBtn.onclick = () => {
      currentView = 'stats';
      renderView();
    };
  }
}

function renderStats() {
  const stats = gameState.stats;

  let correct = 0;
  let wrong = 0;
  let totalAttempts = 0;
  let hardest = null;
  let totalAnswered = 0;

  Object.values(stats).forEach(s => {
    totalAnswered += (s.correct || 0);
    totalAnswered += (s.wrong || 0);
  });

  Object.entries(stats).forEach(([dex, s]) => {
    correct += s.correct || 0;
    wrong += s.wrong || 0;
    totalAttempts += (s.correct + s.wrong);

    const errorRate = s.wrong;

    if (!hardest || errorRate > hardest.wrong) {
      hardest = { dex, ...s };
    }
  });
  const generationStats = {};
  Object.entries(stats).forEach(([dex, s]) => {
    const pokemon = pokemonList.find(
      p => p.dex === Number(dex)
    );
  
    if (!pokemon) return;
  
    const gen = pokemon.gen;
  
    if (!generationStats[gen]) {
      generationStats[gen] = {
        correct: 0,
        total: 0
      };
    }
  
    generationStats[gen].correct += s.correct;
    generationStats[gen].total += s.correct + s.wrong;
  });

  const generationHtml = Object.entries(generationStats)
  .map(([gen, data]) => {
    const accuracy = Math.round(
      (data.correct / data.total) * 100
    );

    return `
      <div>
        Gen ${gen}: ${accuracy}%
      </div>
    `;
  })
  .join('');

  const accuracy = totalAttempts
    ? Math.round((correct / totalAttempts) * 100)
    : 0;

  app.innerHTML = `
    <div class="card stats">

      <h1>Estadísticas</h1>

      <div class="stat-grid">
        <div>✔ Correctas <strong>${correct}</strong></div>
        <div>❌ Incorrectas <strong>${wrong}</strong></div>
        <div>📚 Respondidas históricas <strong>${totalAnswered}</strong></div>
        <div>🎯 Precisión <strong>${accuracy}%</strong></div>
      </div>

      <p class="hardest">
        🔥 Más difícil: #${hardest?.dex || '-'}
      </p>

      <h2>Precisión por generación</h2>

      <div class="stat-grid">
        ${generationHtml}
      </div>

      <button id="back-menu">Volver</button>

    </div>
  `;

  document.querySelector('#back-menu').onclick = () => {
    currentView = 'menu';
    renderView();
  };
}

function getSelectedGenerations() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  const selected = [];

  checkboxes.forEach(cb => {
    if (cb.checked) selected.push(Number(cb.value));
  });

  return selected;
}

function getAvailablePokemon(selectedGens) {
  return pokemonList.filter(p => selectedGens.includes(p.gen));
}

function updateMaxQuestions() {
  const selectedGens = getSelectedGenerations();

  const available = getAvailablePokemon(selectedGens);

  const input = document.querySelector('#question-count');
  const info = document.querySelector('#max-info');

  if (!input || !info) return;

  input.max = available.length;

  const value = Number(input.value) || 1;

  input.value = Math.min(value, available.length);

  info.textContent = `Máximo disponible: ${available.length}`;
}

function startGame() {
  const selectedGens = getSelectedGenerations();

  const available = getAvailablePokemon(selectedGens);

  const questionCount = Math.min(
    Number(document.querySelector('#question-count').value) || 1,
    available.length
  );

  gameState.selectedGenerations = selectedGens;
  gameState.totalQuestions = questionCount;
  gameState.currentQuestion = 0;
  gameState.score = 0;

  const randomIndex = Math.floor(Math.random() * available.length);
  gameState.currentPokemon = available[randomIndex];

  app.innerHTML = renderQuiz(
    gameState.currentPokemon,
    gameState.currentQuestion,
    gameState.totalQuestions
  );
  document
    .querySelector('#check-answer')
    .addEventListener('click', checkAnswer);
  document
    .querySelector('#answer')
    .addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        checkAnswer();
      }
    });
  document.querySelector('#answer').focus();
  saveState(gameState);
  console.log('Game started:', gameState);
}

function checkAnswer() {
  const input = document.querySelector('#answer');
  const value = Number(input.value);

  if (!value) {
    return;
  }

  const correct = gameState.currentPokemon.dex;
  const dex = correct;

  if (!gameState.stats[dex]) {
    gameState.stats[dex] = {
      correct: 0,
      wrong: 0
    };
  }

  const isCorrect = value === correct;

  if (isCorrect) {
    gameState.score++;
    gameState.stats[dex].correct++;
  } else {
    gameState.stats[dex].wrong++;
  }

  gameState.currentQuestion++;

  saveState(gameState);

  showFloatingResult(isCorrect);

  input.value = '';

  const card = document.querySelector('.card');

  card.classList.add('question-exit');

  setTimeout(() => {
    nextQuestion();
  }, 1200);
}

function showFloatingResult(isCorrect) {
  const el = document.createElement('div');

  el.textContent = isCorrect
    ? '¡Correcto!'
    : '¡Incorrecto!';

  el.className = isCorrect
    ? 'floating correct'
    : 'floating wrong';

  document.querySelector('.card').appendChild(el);

  setTimeout(() => {
    el.remove();
  }, 1200);
}

function nextQuestion() {
  const selectedGens = gameState.selectedGenerations;

  const available = pokemonList.filter(p =>
    selectedGens.includes(p.gen)
  );

  if (gameState.currentQuestion >= gameState.totalQuestions) {
    showResults();
    return;
  }

  function getWeight(pokemon) {
    const stat = gameState.stats[pokemon.dex];

    if (!stat) return 1;

    return 1 + (stat.wrong * 2) - stat.correct;
  }

  const pool = [];

  available.forEach(p => {
    const weight = Math.max(1, getWeight(p));

    for (let i = 0; i < weight; i++) {
      pool.push(p);
    }
  });

  const randomPokemon =
    pool[Math.floor(Math.random() * pool.length)];

  app.classList.add('fade-out');

  setTimeout(() => {
    gameState.currentPokemon = randomPokemon;

    app.innerHTML = renderQuiz(
      gameState.currentPokemon,
      gameState.currentQuestion,
      gameState.totalQuestions
    );
    const card = document.querySelector('.card');

    card.classList.add('question-enter');

    requestAnimationFrame(() => {
      card.classList.remove('question-enter');
    });

    document
      .querySelector('#check-answer')
      .addEventListener('click', checkAnswer);
    document
      .querySelector('#answer')
      .addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          checkAnswer();
        }
      });
    document.querySelector('#answer').focus();
    requestAnimationFrame(() => {
      app.classList.remove('fade-out');
    });
  }, 50);
}

function showResults() {
  app.innerHTML = `
    <div class="card">
      <h1>Resultados</h1>

      <p>Correctas: ${gameState.score}</p>
      <p>Total: ${gameState.totalQuestions}</p>

      <button onclick="location.reload()">
        Volver al menú
      </button>
    </div>
  `;
}

function init() {
  const saved = loadState?.();
  if (saved) Object.assign(gameState, saved);

  renderView();
}

init();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}
