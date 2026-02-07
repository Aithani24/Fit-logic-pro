
import React, { useState } from 'react';
import { WorkoutLog } from '../types';
import { ChevronLeft, ChevronRight, Activity, Flame, Clock } from 'lucide-react';

interface Props {
  logs: WorkoutLog[];
}

const CalendarTrack: React.FC<Props> = ({ logs }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getLogsForDay = (day: number) => {
    return logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getDate() === day && 
             logDate.getMonth() === currentDate.getMonth() && 
             logDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const totalMonthlyCals = logs.reduce((acc, log) => {
    const logDate = new Date(log.date);
    if (logDate.getMonth() === currentDate.getMonth() && logDate.getFullYear() === currentDate.getFullYear()) {
      return acc + log.caloriesBurned;
    }
    return acc;
  }, 0);

  const workoutDaysCount = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    .filter(day => getLogsForDay(day).length > 0).length;

  return (
    <div className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-lime-400" />
            Activity History
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Consistency Tracker</p>
        </div>
        <div className="flex items-center gap-4 bg-black/50 p-2 rounded-2xl border border-white/5">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-xl transition-all"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
          <span className="font-black text-sm uppercase tracking-widest min-w-[120px] text-center text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-xl transition-all"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Month Stats */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-black/40 p-5 rounded-3xl border border-white/5 group hover:border-lime-400/30 transition-all backdrop-blur-sm">
            <Flame className="w-8 h-8 text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Monthly Burn</p>
            <h3 className="text-3xl font-black text-white mt-1">{totalMonthlyCals} <span className="text-xs text-gray-600">kcal</span></h3>
          </div>
          <div className="bg-black/40 p-5 rounded-3xl border border-white/5 group hover:border-lime-400/30 transition-all backdrop-blur-sm">
            <Clock className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Training Days</p>
            <h3 className="text-3xl font-black text-white mt-1">{workoutDaysCount} <span className="text-xs text-gray-600">sessions</span></h3>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} className="text-center text-[10px] font-black text-gray-700 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayLogs = getLogsForDay(day);
              const hasWorkout = dayLogs.length > 0;
              const totalDayCals = dayLogs.reduce((a, b) => a + b.caloriesBurned, 0);

              return (
                <div 
                  key={day} 
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center border transition-all group overflow-hidden ${
                    hasWorkout 
                      ? 'bg-white/10 border-lime-400/30 text-white shadow-[0_0_15px_rgba(163,230,53,0.05)]' 
                      : 'bg-white/5 border-white/5 text-gray-600 hover:border-white/20'
                  }`}
                >
                  <span className={`text-xs font-black ${hasWorkout ? 'text-lime-400' : ''}`}>{day}</span>
                  
                  {/* Visual Indicator: Small Dot */}
                  {hasWorkout && (
                    <div className="absolute bottom-2 flex justify-center">
                      <div className="w-1 h-1 bg-lime-400 rounded-full shadow-[0_0_10px_rgba(163,230,53,1)] animate-pulse" />
                    </div>
                  )}

                  {/* Hover Overlay: Show Calories */}
                  {hasWorkout && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-lime-400 transition-opacity">
                      <span className="text-[10px] font-black text-black">{totalDayCals}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarTrack;
