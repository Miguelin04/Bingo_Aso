import React, { useState, useEffect, useCallback } from 'react';
import { BINGO_LETTERS, LETTER_RANGES } from '../constants';
import { BingoCell } from '../types';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'bingo_card_data_v1';

const generateCard = (): BingoCell[][] => {
  const card: BingoCell[][] = [];
  // Initialize columns
  const columns: number[][] = [[], [], [], [], []];

  BINGO_LETTERS.forEach((letter, colIndex) => {
    const min = LETTER_RANGES[letter].min;
    const max = LETTER_RANGES[letter].max;
    
    // Create pool of numbers for this column
    const pool = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    
    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    
    // Take first 5
    columns[colIndex] = pool.slice(0, 5).sort((a, b) => a - b);
  });

  // Transpose to rows for rendering
  for (let r = 0; r < 5; r++) {
    const row: BingoCell[] = [];
    for (let c = 0; c < 5; c++) {
      let content: number | 'FREE' = columns[c][r];
      let marked = false;
      
      if (r === 2 && c === 2) {
        content = 'FREE';
        marked = true;
      }

      row.push({
        id: `cell-${r}-${c}`,
        number: content,
        letter: BINGO_LETTERS[c],
        marked
      });
    }
    card.push(row);
  }
  return card;
};

const getCardSignature = (card: BingoCell[][]): string => {
  if (!card.length) return '';
  // Create a simple hash/signature from the numbers to identify the card
  const numbers = card.flat().map(c => c.number).join('-');
  let hash = 0;
  for (let i = 0; i < numbers.length; i++) {
    const char = numbers.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).toUpperCase().substring(0, 8);
};

const PlayerCard: React.FC = () => {
  const [card, setCard] = useState<BingoCell[][]>([]);
  const [cardId, setCardId] = useState<string>("");
  
  useEffect(() => {
    const loadCard = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsedCard = JSON.parse(stored);
          setCard(parsedCard);
          setCardId(getCardSignature(parsedCard));
          return;
        } catch (e) {
          console.error("Error parsing stored card", e);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      
      // Generate new unique card
      const newCard = generateCard();
      setCard(newCard);
      setCardId(getCardSignature(newCard));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCard));
    };

    loadCard();
  }, []);

  const toggleCell = (rowIndex: number, colIndex: number) => {
    if (rowIndex === 2 && colIndex === 2) return; // Cannot toggle FREE space

    setCard(prev => {
      // Deep copy to ensure state update triggers
      const newCard = prev.map(row => row.map(cell => ({ ...cell })));
      newCard[rowIndex][colIndex].marked = !newCard[rowIndex][colIndex].marked;
      
      // Persist changes
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCard));
      
      return newCard;
    });
  };

  const handleBingo = useCallback(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7']
    });
  }, []);

  if (card.length === 0) return <div className="text-center p-10 text-slate-500">Generando cartón único...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-lg mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full border-4 border-yellow-500">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg z-10">
           <div className="grid grid-cols-5 font-black text-2xl sm:text-4xl py-3 text-center">
             {BINGO_LETTERS.map(l => <div key={l}>{l}</div>)}
           </div>
           <div className="absolute top-1 right-2 text-[10px] sm:text-xs font-mono opacity-50">
             ID: {cardId}
           </div>
        </div>

        {/* Grid */}
        <div className="bg-slate-100 p-2 sm:p-4 grid grid-rows-5 gap-2 sm:gap-3">
          {card.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-5 gap-2 sm:gap-3">
              {row.map((cell, cIdx) => (
                <button
                  key={cell.id}
                  onClick={() => toggleCell(rIdx, cIdx)}
                  className={`
                    aspect-square flex items-center justify-center rounded-full font-bold text-lg sm:text-3xl shadow-sm transition-all duration-200
                    ${cell.number === 'FREE' 
                      ? 'bg-yellow-400 text-yellow-900 border-2 border-yellow-500' 
                      : cell.marked 
                        ? 'bg-red-500 text-white scale-95 border-4 border-red-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]' 
                        : 'bg-white text-slate-700 hover:bg-red-50 border-2 border-slate-200'}
                  `}
                >
                  {cell.number === 'FREE' ? '★' : cell.number}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 w-full text-center">
        <button 
          onClick={handleBingo}
          className="w-full py-4 px-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-950 rounded-xl font-black text-2xl shadow-lg shadow-yellow-500/30 animate-pulse hover:animate-none transition-transform active:scale-95 uppercase tracking-wider"
        >
          ¡BINGO!
        </button>
        <p className="mt-4 text-xs text-slate-400">
           Tu cartón está guardado en este dispositivo. ID: <span className="font-mono">{cardId}</span>
        </p>
      </div>
    </div>
  );
};

export default PlayerCard;