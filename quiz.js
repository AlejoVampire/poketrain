import { getSpritePath } from '../services/pokemonService.js';

export function renderQuiz(pokemon, currentQuestion, totalQuestions, showResult = false, isCorrect = null, userAnswer = null) {
  return `
    <div class="card">
      <div class="progress-info">
        Pregunta ${currentQuestion + 1} / ${totalQuestions}
      </div>
      
      <div class="progress-bar">
        <div
          class="progress-fill"
          style="width:${((currentQuestion) / totalQuestions) * 100}%"
        ></div>
      </div>

      <div id="dex-number" class="dex-number ${showResult ? (isCorrect ? 'correct' : 'incorrect') : ''}">
        ${showResult ? `#${String(pokemon.dex).padStart(4, '0')}` : ''}
      </div>

      <h1 class="quiz-title">¿Qué número es?</h1>

      <img src="${getSpritePath(pokemon.dex)}" alt="Pokémon" />

      ${!showResult ? `
        <input
          id="answer"
          type="number"
          placeholder="Pokédex #"
          autofocus
        >

        <button id="check-answer">
          Comprobar
        </button>
      ` : `
        <button id="next-question">
          ${currentQuestion + 1 >= totalQuestions ? 'Ver resultados' : 'Siguiente'}
        </button>
      `}

      <p id="feedback"></p>
    </div>
  `;
}