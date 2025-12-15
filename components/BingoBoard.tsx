import React from 'react';
import { BINGO_LETTERS, LETTER_RANGES } from '../constants';

interface BingoBoardProps {
  history: number[];
}

const BingoBoard: React.FC<BingoBoardProps> = ({ history }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg w-full max-w-4xl mx-auto border border-slate-700">
      <h3 className="text-xl font-bold text-slate-300 mb-4 text-center uppercase tracking-widest">Tablero de Control</h3>
      <div className="flex flex-col gap-2">
        {BINGO_LETTERS.map((letter) => (
          <div key={letter} className="flex items-center gap-2">
            <div className={`
              w-10 h-10 flex items-center justify-center rounded-full font-black text-xl shadow-md
              ${letter === 'B' ? 'bg-blue-500' : ''}
              ${letter === 'I' ? 'bg-red-500' : ''}
              ${letter === 'N' ? 'bg-green-500' : ''}
              ${letter === 'G' ? 'bg-yellow-500 text-black' : ''}
              ${letter === 'O' ? 'bg-purple-500' : ''}
            `}>
              {letter}
            </div>
            <div className="flex-1 grid grid-cols-15 gap-1">
              {Array.from(
                { length: LETTER_RANGES[letter].max - LETTER_RANGES[letter].min + 1 },
                (_, i) => i + LETTER_RANGES[letter].min
              ).map((num) => {
                const isCalled = history.includes(num);
                return (
                  <div
                    key={num}
                    className={`
                      aspect-square flex items-center justify-center text-xs sm:text-sm font-medium rounded-sm transition-all duration-300
                      ${isCalled 
                        ? 'bg-white text-slate-900 scale-100 shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                        : 'bg-slate-700/50 text-slate-500 scale-90'}
                    `}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BingoBoard;