
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female'
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentary',
  LIGHT = 'Lightly Active',
  MODERATE = 'Moderately Active',
  VERY = 'Very Active',
  ATHLETE = 'Extra Active'
}

export enum BMIStatus {
  UNDERWEIGHT = 'Underweight',
  NORMAL = 'Normal',
  OVERWEIGHT = 'Overweight',
  OBESE = 'Obese'
}

export enum DayStatus {
  WORKOUT = 'Workout',
  REST = 'Rest'
}

export interface UserProfile {
  age: number;
  gender: Gender;
  weight: number; // kg
  height: number; // cm
  activityLevel: ActivityLevel;
}

export interface HealthMetrics {
  bmi: number;
  bmiStatus: BMIStatus;
  bmr: number;
  tdee: number;
  proteinTarget: number;
  vitaminD: number;
  vitaminB12: number;
  iron: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  met: number;
}

export interface Activity {
  name: string;
  duration?: string;
  calories?: number;
  target?: string;
  sets?: number;
  reps?: string;
  met?: number; // Added MET for precise calculation per exercise
}

export interface DaySchedule {
  day: number;
  status: DayStatus;
  activities: Activity[];
  isSorenessTriggered?: boolean;
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO String
  dayNumber: number;
  caloriesBurned: number;
  durationMinutes: number;
  exercisesCompleted: string[];
}

export interface SorenessLog {
  level: number; // 1-10
  date: string;
}
