import React, { useState, useEffect } from 'react';
import { ViewMode, BingoNumber, GameState } from './types';
import { ALL_NUMBERS, LETTER_RANGES, BINGO_LETTERS } from './constants';
import BingoBoard from './components/BingoBoard';
import PlayerCard from './components/PlayerCard';
import { generateBingoCall } from './services/geminiService';
import { Play, RotateCcw, Volume2, VolumeX, ArrowLeft, Users, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.HOME);
  const [gameState, setGameState] = useState<GameState>({
    currentNumber: null,
    history: [],
    isGameOver: false,
    flavorText: '',
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // Helper to get letter from number
  const getLetter = (num: number) => {
    return BINGO_LETTERS.find(l => num >= LETTER_RANGES[l].min && num <= LETTER_RANGES[l].max) || 'B';
  };

  const speak = (text: string) => {
    if (isMuted || !window.speechSynthesis) return;
    // Cancel previous speech to avoid queue buildup
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const drawNumber = async () => {
    if (gameState.history.length >= 75 || isDrawing) return;
    
    setIsDrawing(true);
    
    // Animation effect
    let shuffleCount = 0;
    const maxShuffles = 10;
    const interval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * 75) + 1;
      setGameState(prev => ({
        ...prev,
        currentNumber: { letter: getLetter(randomNum), number: randomNum }
      }));
      shuffleCount++;
      if (shuffleCount >= maxShuffles) clearInterval(interval);
    }, 80);

    setTimeout(async () => {
      // Actual logic after animation
      let nextNum;
      do {
        nextNum = Math.floor(Math.random() * 75) + 1;
      } while (gameState.history.includes(nextNum));

      const letter = getLetter(nextNum);
      const callText = `${letter} ${nextNum}`;
      
      // Get AI Flavor text
      let flavor = "";
      try {
         flavor = await generateBingoCall(nextNum);
      } catch (e) {
         console.warn("AI generation failed", e);
      }

      setGameState(prev => ({
        ...prev,
        currentNumber: { letter, number: nextNum },
        history: [nextNum, ...prev.history],
        flavorText: flavor
      }));

      speak(`${letter} ${nextNum}. ${flavor}`);
      setIsDrawing(false);

    }, maxShuffles * 80 + 100);
  };

  const resetGame = () => {
    if(confirm("¿Reiniciar el juego? Se borrará todo el historial.")) {
      setGameState({
        currentNumber: null,
        history: [],
        isGameOver: false,
        flavorText: ''
      });
      window.speechSynthesis.cancel();
    }
  };

  if (view === ViewMode.HOME) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center max-w-2xl">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 mb-2 drop-shadow-2xl">
            BINGO
          </h1>
          <p className="text-2xl text-slate-300 mb-12 font-light">
            Master AI Edition
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg mx-auto">
            <button
              onClick={() => setView(ViewMode.ADMIN)}
              className="group flex flex-col items-center p-8 bg-slate-800 rounded-2xl border-2 border-slate-700 hover:border-blue-500 hover:bg-slate-750 transition-all duration-300 shadow-xl hover:shadow-blue-500/20"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Administrador</h2>
              <p className="text-sm text-slate-400">Organizar juego, cantar números y controlar el tablero.</p>
            </button>

            <button
              onClick={() => setView(ViewMode.PLAYER)}
              className="group flex flex-col items-center p-8 bg-slate-800 rounded-2xl border-2 border-slate-700 hover:border-green-500 hover:bg-slate-750 transition-all duration-300 shadow-xl hover:shadow-green-500/20"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users size={32} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Jugador</h2>
              <p className="text-sm text-slate-400">Obtener cartón virtual y jugar en tiempo real.</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === ViewMode.PLAYER) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <header className="bg-slate-900 text-white p-4 flex items-center sticky top-0 z-50 shadow-md">
          <button 
            onClick={() => setView(ViewMode.HOME)}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors mr-4"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold">Modo Jugador</h1>
        </header>
        <main className="flex-1 overflow-y-auto">
          <PlayerCard />
        </main>
      </div>
    );
  }

  // Admin View
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <header className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(ViewMode.HOME)}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Bingo Master</h1>
            <span className="text-xs text-slate-500">
               {gameState.history.length} / 75 Números cantados
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button 
            onClick={resetGame}
            className="p-3 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 rounded-full transition-all"
            title="Reiniciar Juego"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Left: Controls & Current Ball */}
        <div className="flex-1 flex flex-col items-center justify-start gap-8">
          
          {/* Current Ball Display */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className={`
              w-64 h-64 rounded-full flex items-center justify-center shadow-2xl border-[12px] relative bg-slate-100 text-slate-900
              ${!gameState.currentNumber ? 'border-slate-700 opacity-50' : 'bingo-ball-animation'}
              ${gameState.currentNumber?.letter === 'B' ? 'border-blue-500' : ''}
              ${gameState.currentNumber?.letter === 'I' ? 'border-red-500' : ''}
              ${gameState.currentNumber?.letter === 'N' ? 'border-green-500' : ''}
              ${gameState.currentNumber?.letter === 'G' ? 'border-yellow-500' : ''}
              ${gameState.currentNumber?.letter === 'O' ? 'border-purple-500' : ''}
            `}>
              {gameState.currentNumber ? (
                <div className="text-center">
                  <div className="text-4xl font-bold uppercase opacity-60 mb-2">{gameState.currentNumber.letter}</div>
                  <div className="text-8xl font-black tracking-tighter leading-none">{gameState.currentNumber.number}</div>
                </div>
              ) : (
                <span className="text-slate-400 font-bold text-xl uppercase tracking-widest">Listo</span>
              )}
            </div>
            
            {/* Last Called Flavor Text */}
            {gameState.flavorText && (
               <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[120%] text-center">
                  <p className="text-yellow-400 font-medium text-lg italic animate-pulse">
                    "{gameState.flavorText}"
                  </p>
               </div>
            )}
          </div>

          <div className="h-12"></div> {/* Spacer for flavor text */}

          {/* Draw Button */}
          <button
            onClick={drawNumber}
            disabled={gameState.history.length >= 75 || isDrawing}
            className={`
              relative overflow-hidden w-full max-w-xs py-5 rounded-2xl font-black text-2xl uppercase tracking-wider shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0
              ${isDrawing || gameState.history.length >= 75
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/30'}
            `}
          >
            <div className="flex items-center justify-center gap-3 relative z-10">
              {isDrawing ? (
                 <span className="animate-pulse">Sacando...</span>
              ) : (
                 <>
                   <Play fill="currentColor" size={28} />
                   <span>Sacar Bola</span>
                 </>
              )}
            </div>
          </button>
          
          {gameState.history.length > 0 && (
             <div className="flex gap-4 items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700 w-full max-w-xs">
                <span className="text-sm font-bold text-slate-400 uppercase">Anterior:</span>
                <div className="flex-1 flex gap-2 overflow-hidden justify-end">
                   {gameState.history.slice(1, 4).map((h, i) => (
                      <span key={i} className="bg-slate-700 text-white px-3 py-1 rounded-md font-mono font-bold opacity-75 text-sm">
                         {h}
                      </span>
                   ))}
                </div>
             </div>
          )}
        </div>

        {/* Right: Board */}
        <div className="flex-[2] w-full">
          <BingoBoard history={gameState.history} />
        </div>
      </main>
    </div>
  );
};

export default App;