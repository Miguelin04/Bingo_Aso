export type BingoLetter = 'B' | 'I' | 'N' | 'G' | 'O';

export interface BingoNumber {
  letter: BingoLetter;
  number: number;
}

export interface BingoCell {
  id: string;
  number: number | 'FREE';
  letter: BingoLetter;
  marked: boolean;
}

export interface GameState {
  currentNumber: BingoNumber | null;
  history: number[];
  isGameOver: boolean;
  flavorText: string;
}

export enum ViewMode {
  HOME = 'HOME',
  ADMIN = 'ADMIN',
  PLAYER = 'PLAYER'
}