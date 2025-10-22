import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export const crossfitWorkouts = [
  // Girls Benchmark WODs
  {
    name: "Fran",
    description: "One of the most famous CrossFit benchmark workouts. 21-15-9 reps for time.",
    category: "benchmark",
    exercises: [
      { name: "Thrusters", sets: "21-15-9", reps: "95/65 lbs", notes: "For time" },
      { name: "Pull-ups", sets: "21-15-9", reps: "", notes: "Between thruster sets" }
    ]
  },
  {
    name: "Cindy",
    description: "20-minute AMRAP (As Many Rounds As Possible)",
    category: "benchmark",
    exercises: [
      { name: "Pull-ups", sets: "AMRAP", reps: "5", notes: "20 minutes" },
      { name: "Push-ups", sets: "AMRAP", reps: "10", notes: "20 minutes" },
      { name: "Air Squats", sets: "AMRAP", reps: "15", notes: "20 minutes" }
    ]
  },
  {
    name: "Helen",
    description: "Three rounds for time of running and kettlebell movements",
    category: "benchmark",
    exercises: [
      { name: "Run", sets: "3", reps: "400m", notes: "For time" },
      { name: "Kettlebell Swings", sets: "3", reps: "21", notes: "53/35 lbs" },
      { name: "Pull-ups", sets: "3", reps: "12", notes: "" }
    ]
  },
  {
    name: "Annie",
    description: "Double-unders and sit-ups for time",
    category: "benchmark",
    exercises: [
      { name: "Double-unders", sets: "50-40-30-20-10", reps: "", notes: "For time" },
      { name: "Sit-ups", sets: "50-40-30-20-10", reps: "", notes: "Between double-under sets" }
    ]
  },
  {
    name: "Karen",
    description: "150 wall balls for time",
    category: "benchmark",
    exercises: [
      { name: "Wall Ball Shots", sets: "1", reps: "150", notes: "20/14 lbs to 10/9 ft target" }
    ]
  },
  {
    name: "Nancy",
    description: "Five rounds for time of running and overhead squats",
    category: "benchmark",
    exercises: [
      { name: "Run", sets: "5", reps: "400m", notes: "For time" },
      { name: "Overhead Squats", sets: "5", reps: "15", notes: "95/65 lbs" }
    ]
  },
  {
    name: "Grace",
    description: "30 clean and jerks for time",
    category: "benchmark",
    exercises: [
      { name: "Clean and Jerk", sets: "1", reps: "30", notes: "135/95 lbs - For time" }
    ]
  },
  {
    name: "Isabel",
    description: "30 snatches for time",
    category: "benchmark",
    exercises: [
      { name: "Snatch", sets: "1", reps: "30", notes: "135/95 lbs - For time" }
    ]
  },
  {
    name: "Jackie",
    description: "Row, thrusters, and pull-ups for time",
    category: "benchmark",
    exercises: [
      { name: "Row", sets: "1", reps: "1000m", notes: "For time" },
      { name: "Thrusters", sets: "1", reps: "50", notes: "45/35 lbs" },
      { name: "Pull-ups", sets: "1", reps: "30", notes: "" }
    ]
  },
  {
    name: "Kelly",
    description: "Five rounds for time",
    category: "benchmark",
    exercises: [
      { name: "Run", sets: "5", reps: "400m", notes: "For time" },
      { name: "Box Jumps", sets: "5", reps: "30", notes: "24/20 inch" },
      { name: "Wall Ball Shots", sets: "5", reps: "30", notes: "20/14 lbs" }
    ]
  },
  
  // Hero WODs
  {
    name: "Murph",
    description: "Memorial Day tribute WOD. Wear a 20/14 lb vest if possible.",
    category: "hero",
    exercises: [
      { name: "Run", sets: "1", reps: "1 mile", notes: "Start with run" },
      { name: "Pull-ups", sets: "1", reps: "100", notes: "Partition as needed" },
      { name: "Push-ups", sets: "1", reps: "200", notes: "Partition as needed" },
      { name: "Air Squats", sets: "1", reps: "300", notes: "Partition as needed" },
      { name: "Run", sets: "1", reps: "1 mile", notes: "Finish with run" }
    ]
  },
  {
    name: "DT",
    description: "Five rounds for time of barbell complex",
    category: "hero",
    exercises: [
      { name: "Deadlifts", sets: "5", reps: "12", notes: "155/105 lbs" },
      { name: "Hang Power Cleans", sets: "5", reps: "9", notes: "155/105 lbs" },
      { name: "Push Jerks", sets: "5", reps: "6", notes: "155/105 lbs" }
    ]
  },
  {
    name: "JT",
    description: "21-15-9 reps for time of gymnastics movements",
    category: "hero",
    exercises: [
      { name: "Handstand Push-ups", sets: "21-15-9", reps: "", notes: "For time" },
      { name: "Ring Dips", sets: "21-15-9", reps: "", notes: "" },
      { name: "Push-ups", sets: "21-15-9", reps: "", notes: "" }
    ]
  },

  // Strength-Focused CrossFit WODs
  {
    name: "Heavy Fran",
    description: "Like Fran, but heavier. Test your strength endurance.",
    category: "strength",
    exercises: [
      { name: "Thrusters", sets: "21-15-9", reps: "115/85 lbs", notes: "For time" },
      { name: "Chest-to-Bar Pull-ups", sets: "21-15-9", reps: "", notes: "" }
    ]
  },
  {
    name: "King Kong",
    description: "Three rounds for time of heavy lifts",
    category: "strength",
    exercises: [
      { name: "Deadlifts", sets: "3", reps: "1", notes: "455/315 lbs" },
      { name: "Muscle-ups", sets: "3", reps: "2", notes: "" },
      { name: "Squat Cleans", sets: "3", reps: "3", notes: "250/165 lbs" },
      { name: "Handstand Push-ups", sets: "3", reps: "4", notes: "" }
    ]
  },
  {
    name: "Cinco",
    description: "Five rounds for time",
    category: "strength",
    exercises: [
      { name: "Deadlifts", sets: "5", reps: "5", notes: "275/185 lbs" },
      { name: "Handstand Push-ups", sets: "5", reps: "13", notes: "" },
      { name: "Box Jumps", sets: "5", reps: "21", notes: "24/20 inch" }
    ]
  },

  // EMOM Workouts
  {
    name: "Power EMOM",
    description: "Every Minute on the Minute for 12 minutes",
    category: "emom",
    exercises: [
      { name: "Power Cleans", sets: "12", reps: "3", notes: "185/135 lbs - EMOM" },
      { name: "Burpees", sets: "12", reps: "6", notes: "Remaining time in minute" }
    ]
  },
  {
    name: "Thruster Death",
    description: "EMOM for 10 minutes",
    category: "emom",
    exercises: [
      { name: "Thrusters", sets: "10", reps: "5", notes: "135/95 lbs - EMOM" },
      { name: "Rest", sets: "10", reps: "", notes: "Remaining time in minute" }
    ]
  },

  // Cardio/MetCon WODs
  {
    name: "Double Grace",
    description: "60 clean and jerks for time",
    category: "metcon",
    exercises: [
      { name: "Clean and Jerk", sets: "1", reps: "60", notes: "135/95 lbs - For time" }
    ]
  },
  {
    name: "Filthy Fifty",
    description: "50 reps of 10 different exercises for time",
    category: "metcon",
    exercises: [
      { name: "Box Jumps", sets: "1", reps: "50", notes: "24/20 inch" },
      { name: "Jumping Pull-ups", sets: "1", reps: "50", notes: "" },
      { name: "Kettlebell Swings", sets: "1", reps: "50", notes: "35/25 lbs" },
      { name: "Walking Lunges", sets: "1", reps: "50", notes: "" },
      { name: "Knees-to-Elbows", sets: "1", reps: "50", notes: "" },
      { name: "Push Press", sets: "1", reps: "50", notes: "45/35 lbs" },
      { name: "Back Extensions", sets: "1", reps: "50", notes: "" },
      { name: "Wall Ball Shots", sets: "1", reps: "50", notes: "20/14 lbs" },
      { name: "Burpees", sets: "1", reps: "50", notes: "" },
      { name: "Double-unders", sets: "1", reps: "50", notes: "" }
    ]
  },
  {
    name: "Fight Gone Bad",
    description: "Three rounds of 1 minute at each station",
    category: "metcon",
    exercises: [
      { name: "Wall Ball Shots", sets: "3", reps: "Max", notes: "20/14 lbs - 1 min" },
      { name: "Sumo Deadlift High Pulls", sets: "3", reps: "Max", notes: "75/55 lbs - 1 min" },
      { name: "Box Jumps", sets: "3", reps: "Max", notes: "20 inch - 1 min" },
      { name: "Push Press", sets: "3", reps: "Max", notes: "75/55 lbs - 1 min" },
      { name: "Row", sets: "3", reps: "Max cal", notes: "1 min" },
      { name: "Rest", sets: "2", reps: "", notes: "1 min between rounds" }
    ]
  },
  {
    name: "The Seven",
    description: "Seven rounds for time - tribute to the 7 CIA officers",
    category: "hero",
    exercises: [
      { name: "Handstand Push-ups", sets: "7", reps: "7", notes: "For time" },
      { name: "Thrusters", sets: "7", reps: "7", notes: "135/95 lbs" },
      { name: "Knees-to-Elbows", sets: "7", reps: "7", notes: "" },
      { name: "Deadlifts", sets: "7", reps: "7", notes: "245/165 lbs" },
      { name: "Burpees", sets: "7", reps: "7", notes: "" },
      { name: "Kettlebell Swings", sets: "7", reps: "7", notes: "70/53 lbs" },
      { name: "Pull-ups", sets: "7", reps: "7", notes: "" }
    ]
  },

  // Bodyweight WODs
  {
    name: "Angie",
    description: "100 reps each for time - pure bodyweight",
    category: "bodyweight",
    exercises: [
      { name: "Pull-ups", sets: "1", reps: "100", notes: "For time" },
      { name: "Push-ups", sets: "1", reps: "100", notes: "" },
      { name: "Sit-ups", sets: "1", reps: "100", notes: "" },
      { name: "Air Squats", sets: "1", reps: "100", notes: "" }
    ]
  },
  {
    name: "Barbara",
    description: "Five rounds for time with rest",
    category: "bodyweight",
    exercises: [
      { name: "Pull-ups", sets: "5", reps: "20", notes: "For time" },
      { name: "Push-ups", sets: "5", reps: "30", notes: "" },
      { name: "Sit-ups", sets: "5", reps: "40", notes: "" },
      { name: "Air Squats", sets: "5", reps: "50", notes: "" },
      { name: "Rest", sets: "4", reps: "", notes: "3 min between rounds" }
    ]
  },
  {
    name: "Chelsea",
    description: "EMOM for 30 minutes",
    category: "bodyweight",
    exercises: [
      { name: "Pull-ups", sets: "30", reps: "5", notes: "EMOM 30 min" },
      { name: "Push-ups", sets: "30", reps: "10", notes: "" },
      { name: "Air Squats", sets: "30", reps: "15", notes: "" }
    ]
  },
  {
    name: "Mary",
    description: "20-minute AMRAP",
    category: "bodyweight",
    exercises: [
      { name: "Handstand Push-ups", sets: "AMRAP", reps: "5", notes: "20 minutes" },
      { name: "Pistol Squats", sets: "AMRAP", reps: "10", notes: "Alternating legs" },
      { name: "Pull-ups", sets: "AMRAP", reps: "15", notes: "" }
    ]
  },

  // Partner/Team WODs
  {
    name: "Double Murph",
    description: "Partner version of Murph - split work evenly",
    category: "partner",
    exercises: [
      { name: "Run", sets: "1", reps: "2 miles", notes: "Run together" },
      { name: "Pull-ups", sets: "1", reps: "200", notes: "Split with partner" },
      { name: "Push-ups", sets: "1", reps: "400", notes: "Split with partner" },
      { name: "Air Squats", sets: "1", reps: "600", notes: "Split with partner" },
      { name: "Run", sets: "1", reps: "2 miles", notes: "Run together" }
    ]
  },

  // Chipper WODs
  {
    name: "The Chipper",
    description: "Work through the list - one time through for time",
    category: "chipper",
    exercises: [
      { name: "Run", sets: "1", reps: "800m", notes: "For time" },
      { name: "Burpees", sets: "1", reps: "75", notes: "" },
      { name: "Kettlebell Swings", sets: "1", reps: "60", notes: "53/35 lbs" },
      { name: "Box Jumps", sets: "1", reps: "45", notes: "24/20 inch" },
      { name: "Thrusters", sets: "1", reps: "30", notes: "95/65 lbs" },
      { name: "Pull-ups", sets: "1", reps: "15", notes: "" }
    ]
  },
  {
    name: "Naughty Nancy",
    description: "Extended version of Nancy with extra movements",
    category: "chipper",
    exercises: [
      { name: "Run", sets: "5", reps: "400m", notes: "For time" },
      { name: "Overhead Squats", sets: "5", reps: "15", notes: "95/65 lbs" },
      { name: "Burpees", sets: "5", reps: "10", notes: "After each round" }
    ]
  }
];

export const seedCrossfitWorkouts = async (userId) => {
  try {
    console.log('Starting CrossFit workout seeding...');
    
    // Check if workouts already exist to avoid duplicates
    const workoutsRef = collection(db, 'workouts');
    const existingWorkouts = await getDocs(workoutsRef);
    const existingNames = existingWorkouts.docs.map(doc => doc.data().name);
    
    let addedCount = 0;
    let skippedCount = 0;

    for (const workout of crossfitWorkouts) {
      if (existingNames.includes(workout.name)) {
        console.log(`Skipping ${workout.name} - already exists`);
        skippedCount++;
        continue;
      }

      await addDoc(workoutsRef, {
        ...workout,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        source: 'crossfit_seed'
      });
      
      addedCount++;
      console.log(`Added workout: ${workout.name}`);
    }

    console.log(`\nSeeding complete!`);
    console.log(`✅ Added: ${addedCount} workouts`);
    console.log(`⏭️  Skipped: ${skippedCount} workouts (already exist)`);
    
    return { success: true, added: addedCount, skipped: skippedCount };
  } catch (error) {
    console.error('Error seeding workouts:', error);
    return { success: false, error: error.message };
  }
};
