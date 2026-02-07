
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
import { ACTIVITY_MULTIPLIERS } from '../constants';

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
  
  // Determine dynamic set count based on BMI
  let dynamicSets = 3; // Default for Normal
  if (bmiStatus === BMIStatus.OVERWEIGHT || bmiStatus === BMIStatus.OBESE) {
    dynamicSets = 4;
  } else if (bmiStatus === BMIStatus.UNDERWEIGHT) {
    dynamicSets = 2; // Focus on high-intensity low-volume to minimize calorie depletion while stimulating growth
  }

  for (let i = 1; i <= 7; i++) {
    const isRest = restDays.includes(i);
    const dayStatus = isRest ? DayStatus.REST : DayStatus.WORKOUT;
    
    let activities: Activity[] = [];
    if (isRest) {
      activities = [
        { name: 'Light Stretching', duration: '10 min', calories: 40, met: 2.3 },
        { name: 'Active Mobility', duration: '15 min', calories: 60, met: 3.0 }
      ];
    } else {
      if (i === 1) { // Chest and Triceps
        activities = [
          { name: 'Bench Press', sets: dynamicSets, reps: '8-10 reps', duration: `${dynamicSets} sets x 8-10`, met: 8.0 },
          { name: 'Incline Dumbbell Press', sets: dynamicSets, reps: '10-12 reps', duration: `${dynamicSets} sets x 10-12`, met: 6.0 },
          { name: 'Chest Flyes', sets: Math.max(2, dynamicSets - 1), reps: '12-15 reps', duration: `${Math.max(2, dynamicSets - 1)} sets x 12-15`, met: 5.0 },
          { name: 'Tricep Dips', sets: dynamicSets, reps: '8-10 reps', duration: `${dynamicSets} sets x 8-10`, met: 6.0 },
          { name: 'Tricep Pushdowns', sets: Math.max(2, dynamicSets - 1), reps: '10-12 reps', duration: `${Math.max(2, dynamicSets - 1)} sets x 10-12`, met: 4.0 },
          { name: 'Skull Crushers', sets: Math.max(2, dynamicSets - 1), reps: '10-12 reps', duration: `${Math.max(2, dynamicSets - 1)} sets x 10-12`, met: 4.0 }
        ];
      } else if (i === 2) { // Back and Biceps
        activities = [
          { name: 'Deadlifts', sets: dynamicSets, reps: '6-8 reps', duration: `${dynamicSets} sets x 6-8`, met: 9.0 },
          { name: 'Pull-Ups/Assisted Pull-Ups', sets: dynamicSets, reps: '8-10 reps', duration: `${dynamicSets} sets x 8-10`, met: 8.0 },
          { name: 'Bent Over Rows', sets: dynamicSets, reps: '10-12 reps', duration: `${dynamicSets} sets x 10-12`, met: 6.0 },
          { name: 'Lat Pulldowns', sets: Math.max(2, dynamicSets - 1), reps: '10-12 reps', duration: `${Math.max(2, dynamicSets - 1)} sets x 10-12`, met: 5.0 },
          { name: 'Barbell Curls', sets: dynamicSets, reps: '8-10 reps', duration: `${dynamicSets} sets x 8-10`, met: 4.0 },
          { name: 'Hammer Curls', sets: Math.max(2, dynamicSets - 1), reps: '10-12 reps', duration: `${Math.max(2, dynamicSets - 1)} sets x 10-12`, met: 3.5 }
        ];
      } else if (i === 3) { // Legs
        activities = [
          { name: 'Squats', sets: dynamicSets, reps: '8-10 reps', duration: `${dynamicSets} sets x 8-10`, met: 8.0 },
          { name: 'Lunges', sets: dynamicSets, reps: '10-12 reps per leg', duration: `${dynamicSets} sets x 10-12`, met: 6.0 },
          { name: 'Leg Press', sets: Math.max(2, dynamicSets - 1), reps: '10-12 reps', duration: `${Math.max(2, dynamicSets - 1)} sets x 10-12`, met: 5.0 },
          { name: 'Leg Curls', sets: Math.max(2, dynamicSets - 1), reps: '10-12 reps', duration: `${Math.max(2, dynamicSets - 1)} sets x 10-12`, met: 4.0 },
          { name: 'Calf Raises', sets: dynamicSets, reps: '12-15 reps', duration: `${dynamicSets} sets x 12-15`, met: 3.5 },
          { name: 'Seated Calf Raises', sets: Math.max(2, dynamicSets - 1), reps: '12-15 reps', duration: `${Math.max(2, dynamicSets - 1)} sets x 12-15`, met: 3.5 }
        ];
      } else if (i === 4) { // Shoulders and Abs
        activities = [
          { name: 'Overhead Press', sets: dynamicSets, reps: '8-10 reps', duration: `${dynamicSets} sets x 8-10`, met: 7.0 },
          { name: 'Lateral Raises', sets: dynamicSets, reps: '10-12 reps', duration: `${dynamicSets} sets x 10-12`, met: 4.0 },
          { name: 'Front Raises', sets: Math.max(2, dynamicSets - 1), reps: '10-12 reps', duration: `${Math.max(2, dynamicSets - 1)} sets x 10-12`, met: 4.0 },
          { name: 'Face Pulls', sets: Math.max(2, dynamicSets - 1), reps: '10-12 reps', duration: `${Math.max(2, dynamicSets - 1)} sets x 10-12`, met: 3.5 },
          { name: 'Planks', sets: dynamicSets, reps: '30-60 seconds', duration: `${dynamicSets} sets x 30-60s`, met: 3.5 },
          { name: 'Russian Twists', sets: Math.max(2, dynamicSets - 1), reps: '15-20 reps per side', duration: `${Math.max(2, dynamicSets - 1)} sets x 15-20`, met: 3.5 }
        ];
      } else {
        if (bmiStatus === BMIStatus.UNDERWEIGHT) {
          activities = [{ name: 'Bodyweight Squats', duration: `${dynamicSets} sets x 12`, sets: dynamicSets, met: 5.0 }];
        } else if (bmiStatus === BMIStatus.NORMAL) {
          activities = [{ name: 'Compound Lifting', duration: '45 min', sets: dynamicSets, met: 6.0 }];
        } else {
          activities = [{ name: 'LISS: Fast Walking', duration: '45 min', met: 3.5 }];
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
