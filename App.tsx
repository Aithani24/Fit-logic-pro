
import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserProfile, 
  HealthMetrics, 
  BMIStatus, 
  DayStatus, 
  DaySchedule, 
  Gender, 
  ActivityLevel,
  WorkoutLog
} from './types';
import { getHealthMetrics, generateRoutine } from './utils/fitLogic';
import { INITIAL_PROFILE } from './constants';
import HealthReport from './components/HealthReport';
import Schedule from './components/Schedule';
import ExerciseLibrary from './components/ExerciseLibrary';
import WorkoutSession from './components/WorkoutSession';
import CalendarTrack from './components/CalendarTrack';
import { 
  User, 
  Settings, 
  LayoutDashboard, 
  BookOpen, 
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  History
} from 'lucide-react';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fitlogic_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [restDays, setRestDays] = useState<number[]>(() => {
    const saved = localStorage.getItem('fitlogic_rest_days');
    return saved ? JSON.parse(saved) : [5, 7];
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(() => {
    const saved = localStorage.getItem('fitlogic_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'exercises' | 'history'>('dashboard');
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

  useEffect(() => {
    localStorage.setItem('fitlogic_logs', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  useEffect(() => {
    setSchedule(generateRoutine(metrics.bmiStatus, restDays));
  }, [metrics.bmiStatus, restDays]);

  const toggleRestDay = (day: number) => {
    setRestDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleWorkoutComplete = (log?: WorkoutLog) => {
    if (log) {
      setWorkoutLogs(prev => [log, ...prev]);
    }
    setActiveWorkout(null);
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
            { name: 'Light Mobility Flow', duration: '15 min', calories: 50, met: 2.3 },
            { name: 'Foam Rolling', duration: '10 min', calories: 30, met: 2.0 }
          ]
        };
      }
      return d;
    }));
    
    alert(`High soreness detected! Day ${nextDay} is now an Active Recovery day.`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Active Workout Overlay */}
      {activeWorkout && (
        <WorkoutSession 
          day={activeWorkout} 
          userWeight={profile.weight}
          onClose={handleWorkoutComplete} 
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
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Adaptive Fitness AI</p>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 bg-[#111] px-4 py-2 rounded-full border border-white/5 hover:border-lime-400/50 transition-all"
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
            <section className="bg-[#111] p-10 rounded-[3rem] border border-white/5">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <Settings className="w-6 h-6 text-lime-400" />
                Physical Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Age</label>
                    <input 
                      type="number"
                      className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 focus:border-lime-400/50 outline-none transition-all text-lg font-bold"
                      value={profile.age}
                      onChange={e => setProfile({...profile, age: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Weight (kg)</label>
                    <input 
                      type="number"
                      className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 focus:border-lime-400/50 outline-none transition-all text-lg font-bold"
                      value={profile.weight}
                      onChange={e => setProfile({...profile, weight: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Height (cm)</label>
                    <input 
                      type="number"
                      className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 focus:border-lime-400/50 outline-none transition-all text-lg font-bold"
                      value={profile.height}
                      onChange={e => setProfile({...profile, height: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Activity Level</label>
                    <select 
                      className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 focus:border-lime-400/50 outline-none transition-all appearance-none text-lg font-bold"
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
                className="mt-12 w-full bg-lime-400 text-black font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(163,230,53,0.3)]"
              >
                Sync with Health Cloud
                <ChevronRight className="w-6 h-6" />
              </button>
            </section>
          </div>
        ) : activeTab === 'dashboard' ? (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-lime-400" />
                Live Biometrics
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
        ) : activeTab === 'history' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CalendarTrack logs={workoutLogs} />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ExerciseLibrary userWeight={profile.weight} />
          </div>
        )}
      </main>

      {/* Bottom Floating Navigation */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#111]/90 backdrop-blur-3xl border border-white/10 px-3 py-3 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] flex gap-2 z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-6 py-4 rounded-3xl transition-all ${
            activeTab === 'dashboard' ? 'bg-lime-400 text-black font-black' : 'text-gray-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="hidden sm:inline">Dash</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-4 rounded-3xl transition-all ${
            activeTab === 'history' ? 'bg-lime-400 text-black font-black' : 'text-gray-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="hidden sm:inline">Activity</span>
        </button>
        <button 
          onClick={() => setActiveTab('exercises')}
          className={`flex items-center gap-2 px-6 py-4 rounded-3xl transition-all ${
            activeTab === 'exercises' ? 'bg-lime-400 text-black font-black' : 'text-gray-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="hidden sm:inline">Library</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-6 py-4 rounded-3xl transition-all ${
            activeTab === 'profile' ? 'bg-lime-400 text-black font-black' : 'text-gray-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="hidden sm:inline">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
