export const gameState = {
  selectedGenerations: [1,2,3,4,5,6,7,8,9],
  totalQuestions: 10,
  currentQuestion: 0,
  score: 0,
  adaptiveMode: true,
  currentPokemon: null,
  usedPokemon: [],
  stats: {},
};

const KEY = 'pokemon-quiz-state';

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function loadState() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
}