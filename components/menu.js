import { generations } from '../data/pokemon.js';

export function renderMenu() {
  const generationOptions = Object.entries(generations)
    .map(([id, gen]) => {
      return `
        <label class="generation-option">
          <input
            type="checkbox"
            value="${id}"
            checked
          >
          ${gen.name}
        </label>
      `;
    })
    .join('');

  return `
    <div class="card">

      <h1>Pokédex Trainer</h1>

      <h2>Generaciones</h2>

      <div class="generation-list">
        ${generationOptions}
      </div>

      <h2>Cantidad de preguntas</h2>

      <input
        id="question-count"
        type="number"
        min="1"
        value="10"
        data-max="0"
      />

      <small id="max-info"></small>

      <button id="start-button">
        Comenzar
      </button>
      
      <button id="stats-button">
        Estadísticas
      </button>

    </div>
  `;
}