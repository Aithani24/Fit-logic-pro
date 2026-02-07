
import React, { useState, useEffect } from 'react';
import { DaySchedule, Activity } from '../types';
import { X, CheckCircle2, Timer, Play, ChevronRight, Trophy } from 'lucide-react';

interface Props {
  day: DaySchedule;
  onClose: () => void;
}

const WorkoutSession: React.FC<Props> = ({ day, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [completed, setCompleted] = useState(false);

  const activities = day.activities;
  const currentActivity = activities[currentIdx];
  const totalSets = currentActivity.sets || 1;

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

  if (completed) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-300">
        <div className="bg-lime-400 p-6 rounded-full mb-6">
          <Trophy className="w-16 h-16 text-black" />
        </div>
        <h2 className="text-4xl font-black text-white mb-2">WORKOUT COMPLETE</h2>
        <p className="text-gray-400 mb-8 text-center max-w-xs">You've finished Day {day.day} routine. Recovery starts now.</p>
        <button 
          onClick={onClose}
          className="w-full max-w-xs bg-[#1a1a1a] border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/5 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
      <div className="p-6 flex justify-between items-center border-b border-white/5">
        <div>
          <h3 className="text-xs text-gray-500 font-black uppercase tracking-widest">Active Workout</h3>
          <p className="text-lg font-bold">Day {day.day}: {currentActivity.name}</p>
        </div>
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {!isResting ? (
          <div className="space-y-12 w-full max-w-md animate-in slide-in-from-bottom-8 duration-500">
            <div>
              <span className="text-lime-400 text-sm font-black uppercase bg-lime-400/10 px-4 py-2 rounded-full border border-lime-400/20">
                Exercise {currentIdx + 1} of {activities.length}
              </span>
              <h1 className="text-5xl font-black mt-8 leading-tight tracking-tighter">{currentActivity.name}</h1>
              <p className="text-2xl text-gray-500 mt-2">{currentActivity.reps || currentActivity.duration}</p>
            </div>

            <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 flex flex-col items-center">
              <span className="text-xs text-gray-500 font-bold uppercase mb-2">Current Set</span>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-lime-400">{currentSet}</span>
                <span className="text-2xl font-bold text-gray-700">/ {totalSets}</span>
              </div>
            </div>

            <button 
              onClick={handleDone}
              className="w-full bg-lime-400 text-black text-2xl font-black py-6 rounded-3xl shadow-[0_0_40px_rgba(163,230,53,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <CheckCircle2 className="w-8 h-8" />
              DONE
            </button>
          </div>
        ) : (
          <div className="space-y-12 w-full max-w-md animate-in zoom-in-95 duration-500">
            <div className="relative flex items-center justify-center">
              <div className="w-64 h-64 rounded-full border-8 border-white/5 flex flex-col items-center justify-center">
                <Timer className="w-10 h-10 text-amber-400 mb-2 animate-pulse" />
                <span className="text-7xl font-black text-white">{timeLeft}</span>
                <span className="text-xs text-gray-500 font-bold uppercase">Seconds Rest</span>
              </div>
              <svg className="absolute w-64 h-64 -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-amber-400"
                  strokeDasharray={754}
                  strokeDashoffset={754 - (754 * timeLeft) / 45}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
            </div>

            <div>
              <p className="text-gray-500 uppercase text-xs font-bold mb-1">Up Next</p>
              <h2 className="text-2xl font-bold">
                {currentSet < totalSets ? `Set ${currentSet + 1} of ${currentActivity.name}` : `Exercise ${currentIdx + 2}: ${activities[currentIdx + 1]?.name}`}
              </h2>
            </div>

            <button 
              onClick={skipRest}
              className="w-full bg-[#1a1a1a] border border-white/10 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
            >
              <Play className="w-5 h-5" />
              Skip Rest
            </button>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/5 flex items-center gap-4">
         <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-lime-400 transition-all duration-1000"
              style={{ width: `${((currentIdx) / activities.length) * 100}%` }}
            />
         </div>
         <span className="text-xs font-bold text-gray-500">{Math.round((currentIdx / activities.length) * 100)}%</span>
      </div>
    </div>
  );
};

export default WorkoutSession;
