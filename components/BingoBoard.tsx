import React from 'react';
import { BINGO_LETTERS, LETTER_RANGES } from '../constants';

interface BingoBoardProps {
  history: number[];
}

const BingoBoard: React.FC<BingoBoardProps> = ({ history }) => {
  return (
    <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl shadow-2xl w-full max-w-5xl mx-auto border border-slate-800">
      <h3 className="text-xl sm:text-2xl font-black text-slate-400 mb-6 text-center uppercase tracking-[0.2em]">Tablero de Control</h3>
      <div className="flex flex-col gap-3">
        {BINGO_LETTERS.map((letter) => (
          <div key={letter} className="flex items-center gap-3">
            {/* Row Letter Header */}
            <div className={`
              w-10 h-10 sm:w-12 sm:h-12 flex flex-shrink-0 items-center justify-center rounded-full font-black text-xl sm:text-2xl shadow-lg border-2 border-white/10
              ${letter === 'B' ? 'bg-blue-600 text-white shadow-blue-500/20' : ''}
              ${letter === 'I' ? 'bg-red-600 text-white shadow-red-500/20' : ''}
              ${letter === 'N' ? 'bg-green-600 text-white shadow-green-500/20' : ''}
              ${letter === 'G' ? 'bg-yellow-500 text-yellow-900 shadow-yellow-500/20' : ''}
              ${letter === 'O' ? 'bg-purple-600 text-white shadow-purple-500/20' : ''}
            `}>
              {letter}
            </div>
            
            {/* Numbers Grid - Explicit 15 columns definition */}
            <div className="flex-1 grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1 sm:gap-2">
              {Array.from(
                { length: LETTER_RANGES[letter].max - LETTER_RANGES[letter].min + 1 },
                (_, i) => i + LETTER_RANGES[letter].min
              ).map((num) => {
                const isCalled = history.includes(num);
                return (
                  <div
                    key={num}
                    className={`
                      aspect-square flex items-center justify-center text-[10px] sm:text-sm font-bold rounded-full transition-all duration-500 border
                      ${isCalled 
                        ? 'bg-gradient-to-br from-white to-slate-200 text-slate-900 scale-100 shadow-[0_0_15px_rgba(255,255,255,0.4)] border-white z-10' 
                        : 'bg-slate-900/50 text-slate-700 scale-75 border-transparent opacity-40'}
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