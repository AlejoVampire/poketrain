import { pokemonList } from '../data/pokemon.js';

export function getRandomPokemon() {
  const index = Math.floor(
    Math.random() * pokemonList.length
  );

  return pokemonList[index];
}

export function getSpritePath(dex) {
  return `sprites/${String(dex).padStart(4, '0')}.png`;
}