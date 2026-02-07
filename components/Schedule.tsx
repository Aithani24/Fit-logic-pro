
import React from 'react';
import { DaySchedule, DayStatus } from '../types';
import { Calendar, Dumbbell, Coffee, Droplets, Moon, RefreshCcw, Play } from 'lucide-react';

interface Props {
  schedule: DaySchedule[];
  onToggleRest: (day: number) => void;
  onLogSoreness: () => void;
  onStartWorkout: (day: DaySchedule) => void;
}

const Schedule: React.FC<Props> = ({ schedule, onToggleRest, onLogSoreness, onStartWorkout }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-lime-400" />
          7-Day Adaptive Engine
        </h2>
        <button 
          onClick={onLogSoreness}
          className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Log High Soreness
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {schedule.map((day) => (
          <div 
            key={day.day}
            className={`p-4 rounded-2xl border transition-all flex items-center gap-6 ${
              day.status === DayStatus.REST 
                ? 'bg-amber-400/5 border-amber-400/20' 
                : 'bg-[#1a1a1a] border-white/5 hover:border-lime-400/20'
            }`}
          >
            <div className="flex flex-col items-center justify-center w-12 shrink-0">
              <span className="text-xs text-gray-500 uppercase font-bold">Day</span>
              <span className="text-2xl font-black text-white">{day.day}</span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {day.status === DayStatus.REST ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 text-amber-400 text-[10px] font-black uppercase rounded-full">
                    <Coffee className="w-3 h-3" /> Active Recovery
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-lime-400/10 text-lime-400 text-[10px] font-black uppercase rounded-full">
                    <Dumbbell className="w-3 h-3" /> Training Day
                  </span>
                )}
                {day.isSorenessTriggered && (
                  <span className="text-[10px] text-red-400 font-bold bg-red-400/10 px-2 py-1 rounded-full animate-pulse">
                    Adaptive Adjustment
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                {day.activities.slice(0, 3).map((act, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{act.name}</span>
                    <span className="text-xs text-gray-500 font-medium">
                      {act.duration || act.target || `${act.calories} kcal`}
                    </span>
                  </div>
                ))}
                {day.activities.length > 3 && (
                  <div className="text-[10px] text-gray-600 font-bold italic">+{day.activities.length - 3} more exercises</div>
                )}

                {day.status === DayStatus.REST && (
                  <div className="mt-3 pt-3 border-t border-amber-400/10 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-[10px] text-amber-200/60 uppercase font-bold">
                      <Droplets className="w-3 h-3 text-amber-400" />
                      Hydration +500ml
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-amber-200/60 uppercase font-bold">
                      <Moon className="w-3 h-3 text-amber-400" />
                      Sleep Target: 8h
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-2">
              <button 
                onClick={() => {
                  if (day.status === DayStatus.WORKOUT) {
                    onStartWorkout(day);
                  } else {
                    onToggleRest(day.day);
                  }
                }}
                className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${
                  day.status === DayStatus.REST
                    ? 'bg-amber-400 text-black font-bold'
                    : 'bg-lime-400 text-black font-black shadow-[0_0_20px_rgba(163,230,53,0.2)]'
                }`}
              >
                {day.status === DayStatus.REST ? (
                  <>Resting</>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Start
                  </>
                )}
              </button>
              {day.status === DayStatus.WORKOUT && (
                <button 
                  onClick={() => onToggleRest(day.day)}
                  className="text-[10px] text-gray-600 font-bold uppercase hover:text-white"
                >
                  Set to Rest
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
