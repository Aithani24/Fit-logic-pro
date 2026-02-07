
import { 
  UserProfile, 
  HealthMetrics, 
  BMIStatus, 
  Gender, 
  ActivityLevel,
  DayStatus,
  DaySchedule,
  Activity
} from '../types';
import { ACTIVITY_MULTIPLIERS, MICRONUTRIENT_GOALS } from '../constants';

export const calculateBMI = (weight: number, height: number): { bmi: number; status: BMIStatus } => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let status = BMIStatus.NORMAL;
  if (bmi < 18.5) status = BMIStatus.UNDERWEIGHT;
  else if (bmi >= 18.5 && bmi < 25) status = BMIStatus.NORMAL;
  else if (bmi >= 25 && bmi < 30) status = BMIStatus.OVERWEIGHT;
  else status = BMIStatus.OBESE;

  return { bmi: parseFloat(bmi.toFixed(1)), status };
};

export const calculateMifflinStJeor = (profile: UserProfile): number => {
  const { weight, height, age, gender } = profile;
  if (gender === Gender.MALE) {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
};

export const getHealthMetrics = (profile: UserProfile): HealthMetrics => {
  const { bmi, status: bmiStatus } = calculateBMI(profile.weight, profile.height);
  const bmr = calculateMifflinStJeor(profile);
  const tdee = bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel];
  const proteinTarget = profile.weight * 1.8;

  return {
    bmi,
    bmiStatus,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    proteinTarget: Math.round(proteinTarget),
    vitaminD: 700, 
    vitaminB12: 2.4,
    iron: profile.gender === Gender.MALE ? 8 : 18
  };
};

export const calculateCaloriesBurned = (met: number, weight: number, durationMinutes: number): number => {
  return Math.round(met * weight * (durationMinutes / 60));
};

export const generateRoutine = (bmiStatus: BMIStatus, restDays: number[]): DaySchedule[] => {
  const routine: DaySchedule[] = [];
  
  for (let i = 1; i <= 7; i++) {
    const isRest = restDays.includes(i);
    const dayStatus = isRest ? DayStatus.REST : DayStatus.WORKOUT;
    
    let activities: Activity[] = [];
    if (isRest) {
      activities = [
        { name: 'Light Stretching', duration: '10 min', calories: 40 },
        { name: 'Active Mobility', duration: '15 min', calories: 60 }
      ];
    } else {
      // Hardcoded routines from images
      if (i === 1) { // Day 1: Chest and Triceps
        activities = [
          { name: 'Bench Press', sets: 4, reps: '8-10 reps', duration: '4 sets x 8-10' },
          { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12 reps', duration: '4 sets x 10-12' },
          { name: 'Chest Flyes', sets: 3, reps: '12-15 reps', duration: '3 sets x 12-15' },
          { name: 'Tricep Dips', sets: 4, reps: '8-10 reps', duration: '4 sets x 8-10' },
          { name: 'Tricep Pushdowns', sets: 3, reps: '10-12 reps', duration: '3 sets x 10-12' },
          { name: 'Skull Crushers', sets: 3, reps: '10-12 reps', duration: '3 sets x 10-12' }
        ];
      } else if (i === 2) { // Day 2: Back and Biceps
        activities = [
          { name: 'Deadlifts', sets: 4, reps: '6-8 reps', duration: '4 sets x 6-8' },
          { name: 'Pull-Ups/Assisted Pull-Ups', sets: 4, reps: '8-10 reps', duration: '4 sets x 8-10' },
          { name: 'Bent Over Rows', sets: 4, reps: '10-12 reps', duration: '4 sets x 10-12' },
          { name: 'Lat Pulldowns', sets: 3, reps: '10-12 reps', duration: '3 sets x 10-12' },
          { name: 'Barbell Curls', sets: 4, reps: '8-10 reps', duration: '4 sets x 8-10' },
          { name: 'Hammer Curls', sets: 3, reps: '10-12 reps', duration: '3 sets x 10-12' }
        ];
      } else if (i === 3) { // Day 3: Legs
        activities = [
          { name: 'Squats', sets: 4, reps: '8-10 reps', duration: '4 sets x 8-10' },
          { name: 'Lunges', sets: 4, reps: '10-12 reps per leg', duration: '4 sets x 10-12' },
          { name: 'Leg Press', sets: 3, reps: '10-12 reps', duration: '3 sets x 10-12' },
          { name: 'Leg Curls', sets: 3, reps: '10-12 reps', duration: '3 sets x 10-12' },
          { name: 'Calf Raises', sets: 4, reps: '12-15 reps', duration: '4 sets x 12-15' },
          { name: 'Seated or Standing Calf Raises', sets: 3, reps: '12-15 reps', duration: '3 sets x 12-15' }
        ];
      } else if (i === 4) { // Day 4: Shoulders and Abs
        activities = [
          { name: 'Overhead Press', sets: 4, reps: '8-10 reps', duration: '4 sets x 8-10' },
          { name: 'Lateral Raises', sets: 4, reps: '10-12 reps', duration: '4 sets x 10-12' },
          { name: 'Front Raises', sets: 3, reps: '10-12 reps', duration: '3 sets x 10-12' },
          { name: 'Face Pulls', sets: 3, reps: '10-12 reps', duration: '3 sets x 10-12' },
          { name: 'Planks', sets: 4, reps: '30-60 seconds', duration: '4 sets x 30-60s' },
          { name: 'Russian Twists', sets: 3, reps: '15-20 reps per side', duration: '3 sets x 15-20' }
        ];
      } else {
        // Dynamic routine based on BMI for remaining days
        if (bmiStatus === BMIStatus.UNDERWEIGHT) {
          activities = [{ name: 'Bodyweight Squats', duration: '3 sets x 12', sets: 3 }];
        } else if (bmiStatus === BMIStatus.NORMAL) {
          activities = [{ name: 'Compound Lifting', duration: '45 min', calories: 300, sets: 4 }];
        } else {
          activities = [{ name: 'LISS: Fast Walking', duration: '45 min', calories: 180 }];
        }
      }
    }

    routine.push({
      day: i,
      status: dayStatus,
      activities
    });
  }

  return routine;
};
