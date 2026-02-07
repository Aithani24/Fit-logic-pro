
import React from 'react';
import { HealthMetrics, UserProfile, BMIStatus } from '../types';
import { Activity, Flame, Droplets, Zap, ShieldAlert } from 'lucide-react';

interface Props {
  metrics: HealthMetrics;
  profile: UserProfile;
}

const HealthReport: React.FC<Props> = ({ metrics, profile }) => {
  const getStatusColor = (status: BMIStatus) => {
    switch (status) {
      case BMIStatus.NORMAL: return 'text-lime-400';
      case BMIStatus.UNDERWEIGHT: return 'text-blue-400';
      case BMIStatus.OVERWEIGHT: return 'text-amber-400';
      case BMIStatus.OBESE: return 'text-red-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* BMI Card */}
        <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 hover:border-lime-400/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-lime-400/10 rounded-lg">
              <Activity className="w-5 h-5 text-lime-400" />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-black/40 ${getStatusColor(metrics.bmiStatus)}`}>
              {metrics.bmiStatus}
            </span>
          </div>
          <p className="text-gray-400 text-sm font-medium">Body Mass Index</p>
          <h3 className="text-2xl font-bold mt-1">{metrics.bmi} <span className="text-xs text-gray-500">kg/m²</span></h3>
          <p className="text-[10px] text-gray-500 mt-2">Defines exercise intensity thresholds.</p>
        </div>

        {/* TDEE Card */}
        <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 hover:border-lime-400/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-400/10 rounded-lg">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-black/40 text-amber-400">
              Maintenance
            </span>
          </div>
          <p className="text-gray-400 text-sm font-medium">Daily Energy Expenditure</p>
          <h3 className="text-2xl font-bold mt-1">{metrics.tdee} <span className="text-xs text-gray-500">kcal/day</span></h3>
          <p className="text-[10px] text-gray-500 mt-2">Mifflin-St Jeor equation baseline.</p>
        </div>

        {/* Protein Card */}
        <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 hover:border-lime-400/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-400/10 rounded-lg">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium">Protein Target</p>
          <h3 className="text-2xl font-bold mt-1">{metrics.proteinTarget}g <span className="text-xs text-gray-500">daily</span></h3>
          <p className="text-[10px] text-gray-500 mt-2">Calculated as 1.8g x {profile.weight}kg weight.</p>
        </div>

        {/* Micros Card */}
        <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 hover:border-lime-400/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-400/10 rounded-lg">
              <Droplets className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium">Micronutrient Baseline</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Vitamin D</span>
              <span className="text-white">600-800 IU</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Vitamin B12</span>
              <span className="text-white">2.4 mcg</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Iron</span>
              <span className="text-white">{metrics.iron} mg</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logic Explanation Box */}
      <div className="bg-lime-400/5 border border-lime-400/20 p-4 rounded-xl flex gap-4 items-center">
        <ShieldAlert className="w-8 h-8 text-lime-400 shrink-0" />
        <p className="text-sm text-lime-100/80">
          Based on your <span className="text-lime-400 font-bold">{metrics.bmiStatus}</span> status, your 7-day routine will prioritize 
          {metrics.bmiStatus === BMIStatus.UNDERWEIGHT ? " hypertrophy and compound movements" : 
           metrics.bmiStatus === BMIStatus.NORMAL ? " cardiovascular endurance and mixed strength" : 
           " low-impact steady-state (LISS) training"} to optimize metabolic health.
        </p>
      </div>
    </div>
  );
};

export default HealthReport;
