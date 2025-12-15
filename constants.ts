import { BingoLetter } from './types';

export const BINGO_LETTERS: BingoLetter[] = ['B', 'I', 'N', 'G', 'O'];

export const LETTER_RANGES: Record<BingoLetter, { min: number; max: number }> = {
  B: { min: 1, max: 15 },
  I: { min: 16, max: 30 },
  N: { min: 31, max: 45 },
  G: { min: 46, max: 60 },
  O: { min: 61, max: 75 },
};

export const ALL_NUMBERS = Array.from({ length: 75 }, (_, i) => i + 1);