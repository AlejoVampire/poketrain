import { getRandomPokemon, getSpritePath } from '../services/pokemonService.js';

export function renderQuiz(pokemon, currentQuestion, totalQuestions) {
  return `
    <div class="card">
    <div class="progress-info">
      Pregunta ${currentQuestion + 1} / ${totalQuestions}
    </div>
    
    <div class="progress-bar">
      <div
        class="progress-fill"
        style="width:${((currentQuestion + 1) / totalQuestions) * 100}%"
      ></div>
    </div>

      <h1 class="quiz-title">¿Qué número es?</h1>

      <img src="${getSpritePath(pokemon.dex)}" />

      <input
        id="answer"
        type="number"
        placeholder="Pokédex #"
      >

      <button id="check-answer">
        Comprobar
      </button>

      <p id="feedback"></p>

    </div>
  `;
}