export const generations = {
  1: { name: 'Kanto', start: 1, end: 151 },
  2: { name: 'Johto', start: 152, end: 251 },
  3: { name: 'Hoenn', start: 252, end: 386 },
  4: { name: 'Sinnoh', start: 387, end: 493 },
  5: { name: 'Unova', start: 494, end: 649 },
  6: { name: 'Kalos', start: 650, end: 721 },
  7: { name: 'Alola', start: 722, end: 809 },
  8: { name: 'Galar', start: 810, end: 905 },
  9: { name: 'Paldea', start: 906, end: 1025 }
};

export const pokemonList = [];

for (const gen in generations) {
  const { start, end } = generations[gen];
  for (let dex = start; dex <= end; dex++) {
    pokemonList.push({
      dex,
      gen: Number(gen)
    });
  }
}