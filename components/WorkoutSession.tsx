
import React, { useState, useEffect, useRef } from 'react';
import { DaySchedule, Activity, WorkoutLog } from '../types';
import { X, CheckCircle2, Timer, Play, Trophy, Zap, Flame, Clock } from 'lucide-react';

interface Props {
  day: DaySchedule;
  userWeight: number;
  onClose: (log?: WorkoutLog) => void;
}

const WorkoutSession: React.FC<Props> = ({ day, userWeight, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [completed, setCompleted] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const activities = day.activities;
  const currentActivity = activities[currentIdx];
  const totalSets = currentActivity.sets || 1;

  // Constants for the circular timer
  const RADIUS = 45;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  useEffect(() => {
    let timer: number;
    if (isResting && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isResting && timeLeft === 0) {
      handleNext();
    }
    return () => clearInterval(timer);
  }, [isResting, timeLeft]);

  const handleDone = () => {
    setIsResting(true);
    setTimeLeft(45);
  };

  const handleNext = () => {
    setIsResting(false);
    if (currentSet < totalSets) {
      setCurrentSet(currentSet + 1);
    } else {
      if (currentIdx < activities.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setCurrentSet(1);
      } else {
        setCompleted(true);
      }
    }
  };

  const skipRest = () => {
    setTimeLeft(0);
  };

  const calculateFinalStats = () => {
    const endTime = Date.now();
    const durationMs = endTime - startTimeRef.current;
    const durationMinutes = Math.max(1, Math.round(durationMs / 60000));
    
    const avgMet = day.activities.reduce((acc, curr) => acc + (curr.met || 5), 0) / day.activities.length;
    const caloriesBurned = Math.round(avgMet * userWeight * (durationMinutes / 60));

    return { durationMinutes, caloriesBurned };
  };

  const handleFinalCompletion = () => {
    const { durationMinutes, caloriesBurned } = calculateFinalStats();
    
    const log: WorkoutLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      dayNumber: day.day,
      caloriesBurned,
      durationMinutes,
      exercisesCompleted: day.activities.map(a => a.name)
    };

    onClose(log);
  };

  if (completed) {
    const { durationMinutes, caloriesBurned } = calculateFinalStats();
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-lime-400/5 blur-[120px] rounded-full scale-150 animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
          <div className="bg-lime-400 p-6 rounded-full mb-6 shadow-[0_0_100px_rgba(163,230,53,0.6)] animate-bounce">
            <Trophy className="w-12 h-12 text-black" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tighter text-center uppercase">Session Elite</h2>
          <p className="text-lime-400 font-black uppercase tracking-[0.4em] mb-8 text-xs">Workout Logged</p>

          <div className="grid grid-cols-2 gap-3 w-full mb-8">
            <div className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] text-center backdrop-blur-xl">
              <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Burned</p>
              <p className="text-2xl font-black text-white">{caloriesBurned}<span className="text-[10px] text-gray-600 ml-1">kcal</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] text-center backdrop-blur-xl">
              <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Duration</p>
              <p className="text-2xl font-black text-white">{durationMinutes}<span className="text-[10px] text-gray-600 ml-1">min</span></p>
            </div>
          </div>

          <button 
            onClick={handleFinalCompletion}
            className="w-full bg-white text-black font-black py-5 rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.2)] uppercase tracking-widest text-sm"
          >
            Save Performance
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300 overflow-hidden">
      <div className={`absolute inset-0 transition-colors duration-1000 ${isResting ? 'bg-amber-400/[0.04]' : 'bg-lime-400/[0.02]'}`} />
      
      {/* Header - Compact */}
      <div className="p-4 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-3xl z-50">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg border transition-colors ${isResting ? 'bg-amber-400/10 border-amber-400/20 text-amber-400' : 'bg-lime-400/10 border-lime-400/20 text-lime-400'}`}>
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em]">Live Training</h3>
            <p className="text-sm font-bold text-white tracking-tight">Day {day.day}: {currentActivity.name}</p>
          </div>
        </div>
        <button onClick={() => onClose()} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 transition-all active:scale-90">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 relative flex flex-col items-center justify-between p-6 text-center z-10 overflow-y-auto">
        {!isResting ? (
          <div className="flex-1 w-full max-w-lg flex flex-col items-center justify-center gap-8 py-4">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 text-lime-400 text-[9px] font-black uppercase bg-lime-400/10 px-4 py-1.5 rounded-full border border-lime-400/20 tracking-[0.2em]">
                <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse" />
                Move {currentIdx + 1} / {activities.length}
              </span>
              <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tighter text-white uppercase drop-shadow-lg px-2">
                {currentActivity.name}
              </h1>
              <p className="text-lg text-gray-400 font-bold tracking-tight bg-white/5 px-4 py-1.5 rounded-full inline-block border border-white/5">
                {currentActivity.reps || currentActivity.duration}
              </p>
            </div>

            <div className="relative group w-full max-w-[280px]">
              <div className="absolute inset-0 bg-lime-400/5 blur-[40px] rounded-full" />
              <div className="relative bg-black/40 p-6 rounded-[2.5rem] border border-white/5 flex flex-col items-center shadow-xl backdrop-blur-3xl overflow-hidden">
                <span className="text-[8px] text-gray-600 font-black uppercase tracking-[0.4em] mb-4">Set Counter</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-7xl font-black text-white tabular-nums leading-none tracking-tighter">{currentSet}</span>
                  <span className="text-2xl font-black text-gray-800">/ {totalSets}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleDone}
              className="w-full max-w-xs bg-lime-400 text-black text-xl font-black py-5 rounded-[1.5rem] shadow-xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
            >
              <CheckCircle2 className="w-6 h-6" />
              Done Set
            </button>
          </div>
        ) : (
          <div className="flex-1 w-full max-w-lg flex flex-col items-center justify-center gap-8 py-4">
            {/* Centered Timer - Resized */}
            <div className="relative flex items-center justify-center w-full max-w-[260px] aspect-square">
              <div className="absolute inset-[-5%] bg-amber-400/10 rounded-full blur-[60px] animate-pulse" />
              
              <svg 
                viewBox="0 0 100 100" 
                className="absolute w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]"
              >
                <circle cx="50" cy="50" r={RADIUS} stroke="rgba(255,255,255,0.03)" strokeWidth="3" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  stroke="url(#restGradient)"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE - (CIRCUMFERENCE * timeLeft) / 45}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
                <defs>
                  <linearGradient id="restGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="flex flex-col items-center justify-center z-10">
                <Timer className="w-6 h-6 text-amber-400 mb-1" />
                <span className="text-7xl sm:text-8xl font-black text-white tabular-nums leading-none tracking-tighter">
                  {timeLeft}
                </span>
                <div className="mt-2 px-4 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full">
                  <span className="text-[8px] text-amber-400 font-black uppercase tracking-[0.4em]">
                    Recovering
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/10 w-full max-w-[300px] shadow-lg relative overflow-hidden">
              <p className="text-gray-500 uppercase text-[8px] font-black tracking-[0.4em] mb-2">Up Next</p>
              <h2 className="text-xl font-black text-white leading-tight">
                {currentSet < totalSets 
                  ? `Set ${currentSet + 1} of ${currentActivity.name}` 
                  : `${activities[currentIdx + 1]?.name || 'Final Session'}`}
              </h2>
            </div>

            <button 
              onClick={skipRest}
              className="w-full max-w-xs bg-white/5 border border-white/10 text-white text-sm font-black py-4 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest"
            >
              <Play className="w-4 h-4 fill-current" />
              Skip Rest
            </button>
          </div>
        )}
      </div>

      {/* Footer - Slimmer */}
      <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col gap-3 z-50">
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em]">Duration</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-lime-400" />
                <span className="text-base font-black text-white tabular-nums">
                  {Math.floor((Date.now() - startTimeRef.current) / 1000 / 60)}:
                  {String(Math.floor((Date.now() - startTimeRef.current) / 1000) % 60).padStart(2, '0')}
                </span>
              </div>
            </div>
            <div className="bg-lime-400/10 px-3 py-1.5 rounded-lg border border-lime-400/20">
              <span className="text-[9px] font-black text-lime-400 uppercase tracking-widest">
                {Math.round(((currentIdx) / activities.length) * 100)}% Complete
              </span>
            </div>
         </div>
         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-lime-500 to-lime-300 transition-all duration-1000"
              style={{ width: `${((currentIdx + (isResting ? 0.5 : 0)) / activities.length) * 100}%` }}
            />
         </div>
      </div>
    </div>
  );
};

export default WorkoutSession;
