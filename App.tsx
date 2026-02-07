
import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserProfile, 
  HealthMetrics, 
  BMIStatus, 
  DayStatus, 
  DaySchedule, 
  Gender, 
  ActivityLevel 
} from './types';
import { getHealthMetrics, generateRoutine } from './utils/fitLogic';
import { INITIAL_PROFILE } from './constants';
import HealthReport from './components/HealthReport';
import Schedule from './components/Schedule';
import ExerciseLibrary from './components/ExerciseLibrary';
import WorkoutSession from './components/WorkoutSession';
import { 
  User, 
  Settings, 
  LayoutDashboard, 
  BookOpen, 
  ChevronRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fitlogic_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [restDays, setRestDays] = useState<number[]>(() => {
    const saved = localStorage.getItem('fitlogic_rest_days');
    return saved ? JSON.parse(saved) : [5, 7]; // Defaults revised for 4-day push
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'exercises'>('dashboard');
  const [activeWorkout, setActiveWorkout] = useState<DaySchedule | null>(null);

  const metrics = useMemo(() => getHealthMetrics(profile), [profile]);
  
  const [schedule, setSchedule] = useState<DaySchedule[]>(() => 
    generateRoutine(metrics.bmiStatus, restDays)
  );

  // Persistence
  useEffect(() => {
    localStorage.setItem('fitlogic_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('fitlogic_rest_days', JSON.stringify(restDays));
  }, [restDays]);

  // Regenerate routine if BMI status changes or rest days change
  useEffect(() => {
    setSchedule(generateRoutine(metrics.bmiStatus, restDays));
  }, [metrics.bmiStatus, restDays]);

  const toggleRestDay = (day: number) => {
    setRestDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSoreness = () => {
    const today = new Date().getDay() || 7; 
    const nextDay = (today % 7) + 1;
    
    setSchedule(prev => prev.map(d => {
      if (d.day === nextDay && d.status === DayStatus.WORKOUT) {
        return {
          ...d,
          status: DayStatus.REST,
          isSorenessTriggered: true,
          activities: [
            { name: 'Light Mobility Flow', duration: '15 min', calories: 50 },
            { name: 'Foam Rolling', duration: '10 min', calories: 30 }
          ]
        };
      }
      return d;
    }));
    
    alert(`High soreness detected! We've automatically converted Day ${nextDay} to an Active Recovery day to prevent injury.`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Active Workout Overlay */}
      {activeWorkout && (
        <WorkoutSession 
          day={activeWorkout} 
          onClose={() => setActiveWorkout(null)} 
        />
      )}

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-lime-400 p-1.5 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter">FITLOGIC <span className="text-lime-400">PRO</span></h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Adaptive 7-Day System</p>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 bg-[#1a1a1a] px-4 py-2 rounded-full border border-white/5 hover:border-lime-400/50 transition-all"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-none">{profile.weight}kg</p>
            <p className="text-[10px] text-gray-500 font-medium">{metrics.bmiStatus}</p>
          </div>
          <User className="w-5 h-5 text-lime-400" />
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {activeTab === 'profile' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-lime-400" />
                Biometrics Input
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-gray-500 font-bold uppercase block mb-2">Age</label>
                    <input 
                      type="number"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-lime-400/50 outline-none transition-all"
                      value={profile.age}
                      onChange={e => setProfile({...profile, age: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-bold uppercase block mb-2">Weight (kg)</label>
                    <input 
                      type="number"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-lime-400/50 outline-none transition-all"
                      value={profile.weight}
                      onChange={e => setProfile({...profile, weight: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-gray-500 font-bold uppercase block mb-2">Height (cm)</label>
                    <input 
                      type="number"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-lime-400/50 outline-none transition-all"
                      value={profile.height}
                      onChange={e => setProfile({...profile, height: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-bold uppercase block mb-2">Activity Level</label>
                    <select 
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-lime-400/50 outline-none transition-all appearance-none"
                      value={profile.activityLevel}
                      onChange={e => setProfile({...profile, activityLevel: e.target.value as ActivityLevel})}
                    >
                      {Object.values(ActivityLevel).map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="mt-8 w-full bg-lime-400 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Update Health Engine
                <ChevronRight className="w-5 h-5" />
              </button>
            </section>
          </div>
        ) : activeTab === 'dashboard' ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-lime-400" />
                Health Report Card
              </h2>
              <HealthReport metrics={metrics} profile={profile} />
            </div>

            <Schedule 
              schedule={schedule} 
              onToggleRest={toggleRestDay} 
              onLogSoreness={handleSoreness}
              onStartWorkout={(day) => setActiveWorkout(day)}
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ExerciseLibrary userWeight={profile.weight} />
          </div>
        )}
      </main>

      {/* Bottom Floating Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/10 px-2 py-2 rounded-3xl shadow-2xl flex gap-2 z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${
            activeTab === 'dashboard' ? 'bg-lime-400 text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('exercises')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${
            activeTab === 'exercises' ? 'bg-lime-400 text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="hidden sm:inline">Library</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${
            activeTab === 'profile' ? 'bg-lime-400 text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="hidden sm:inline">Stats</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
