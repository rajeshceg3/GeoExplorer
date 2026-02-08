export class SeededRandom {
  constructor(seed) {
    // Hash the string seed to a number if it's a string
    if (typeof seed === 'string') {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      this.seed = Math.abs(hash);
    } else {
      this.seed = seed;
    }
  }

  // Linear Congruential Generator
  // using constants from glibc
  next() {
    this.seed = (1103515245 * this.seed + 12345) % 2147483647;
    return this.seed / 2147483647;
  }
}

export function shuffleArray(array, rng) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
