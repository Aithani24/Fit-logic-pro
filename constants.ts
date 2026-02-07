
import { Exercise, ActivityLevel, Gender } from './types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHT]: 1.375,
  [ActivityLevel.MODERATE]: 1.55,
  [ActivityLevel.VERY]: 1.725,
  [ActivityLevel.ATHLETE]: 1.9
};

export const DEFAULT_EXERCISES: Exercise[] = [
  { id: '1', name: 'Walking', category: 'LISS', met: 3.5 },
  { id: '2', name: 'Pushups', category: 'Strength', met: 8.0 },
  { id: '3', name: 'Squats', category: 'Strength', met: 5.0 },
  { id: '4', name: 'Running (Moderate)', category: 'Cardio', met: 10.0 },
  { id: '5', name: 'Swimming', category: 'Cardio', met: 7.0 },
  { id: '6', name: 'Stretching', category: 'Mobility', met: 2.3 },
  { id: '7', name: 'Plank', category: 'Core', met: 3.5 }
];

export const MICRONUTRIENT_GOALS = {
  VITAMIN_D: '600-800 IU',
  VITAMIN_B12: '2.4 mcg',
  IRON_MALE: '8 mg',
  IRON_FEMALE: '18 mg'
};

export const INITIAL_PROFILE = {
  age: 25,
  gender: Gender.MALE,
  weight: 70,
  height: 175,
  activityLevel: ActivityLevel.MODERATE
};
