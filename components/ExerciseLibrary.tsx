
import React, { useState } from 'react';
import { Exercise } from '../types';
import { DEFAULT_EXERCISES } from '../constants';
import { Plus, Trash2, Search, Calculator } from 'lucide-react';
import { calculateCaloriesBurned } from '../utils/fitLogic';

interface Props {
  userWeight: number;
}

const ExerciseLibrary: React.FC<Props> = ({ userWeight }) => {
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newEx, setNewEx] = useState({ name: '', category: '', met: 3.5 });
  const [calcDuration, setCalcDuration] = useState(30);

  const addExercise = () => {
    if (!newEx.name) return;
    const item: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      ...newEx
    };
    setExercises([...exercises, item]);
    setShowAdd(false);
    setNewEx({ name: '', category: '', met: 3.5 });
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
  };

  const filtered = exercises.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-lime-400" />
          Exercise Library
        </h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 bg-lime-400 rounded-lg text-black hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          type="text"
          placeholder="Search by name or category..."
          className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-lime-400/50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showAdd && (
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-lime-400/20 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" placeholder="Name"
              className="bg-black/50 border border-white/10 rounded-lg p-2 text-sm"
              value={newEx.name}
              onChange={e => setNewEx({...newEx, name: e.target.value})}
            />
            <input 
              type="text" placeholder="Category (e.g. HIIT)"
              className="bg-black/50 border border-white/10 rounded-lg p-2 text-sm"
              value={newEx.category}
              onChange={e => setNewEx({...newEx, category: e.target.value})}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-bold">MET:</span>
              <input 
                type="number" step="0.1"
                className="bg-black/50 border border-white/10 rounded-lg p-2 text-sm w-full"
                value={newEx.met}
                onChange={e => setNewEx({...newEx, met: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <button 
            onClick={addExercise}
            className="w-full py-2 bg-lime-400 text-black font-bold rounded-lg text-sm"
          >
            Create Exercise
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(ex => (
          <div key={ex.id} className="group bg-[#1a1a1a] p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-white">{ex.name}</h4>
                <span className="text-[10px] uppercase tracking-wider font-black text-gray-500">{ex.category}</span>
              </div>
              <button 
                onClick={() => removeExercise(ex.id)}
                className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-400 rounded-md transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Calculator className="w-3.5 h-3.5 text-lime-400" />
                <span className="text-xs text-gray-400">Burn Rate (MET: {ex.met})</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-lime-400">
                  ~{calculateCaloriesBurned(ex.met, userWeight, calcDuration)} kcal
                </span>
                <span className="text-[10px] text-gray-500 block">per {calcDuration} min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/5">
        <span className="text-xs text-gray-500 whitespace-nowrap">Calorie Calc for</span>
        <input 
          type="range" min="5" max="120" step="5"
          className="w-full accent-lime-400"
          value={calcDuration}
          onChange={(e) => setCalcDuration(parseInt(e.target.value))}
        />
        <span className="text-xs font-bold text-white whitespace-nowrap">{calcDuration} min</span>
      </div>
    </div>
  );
};

export default ExerciseLibrary;
import { Dumbbell } from 'lucide-react';
