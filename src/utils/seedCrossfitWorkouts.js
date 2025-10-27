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
      { name: "Double-unders", sets: "1", reps: "50-40-30-20-10", notes: "For time" },
      { name: "Sit-ups", sets: "1", reps: "50-40-30-20-10", notes: "Between double-under sets" }
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
  },

  // More Girls Benchmark WODs
  {
    name: "Diane",
    description: "Deadlifts and handstand push-ups in decreasing reps",
    category: "benchmark",
    exercises: [
      { name: "Deadlifts", sets: "21-15-9", reps: "225/155 lbs", notes: "For time" },
      { name: "Handstand Push-ups", sets: "21-15-9", reps: "", notes: "Between deadlift sets" }
    ]
  },
  {
    name: "Elizabeth",
    description: "Cleans and ring dips for time",
    category: "benchmark",
    exercises: [
      { name: "Clean", sets: "21-15-9", reps: "135/95 lbs", notes: "For time" },
      { name: "Ring Dips", sets: "21-15-9", reps: "", notes: "Between clean sets" }
    ]
  },
  {
    name: "Amanda",
    description: "Muscle-ups and snatches in descending reps",
    category: "benchmark",
    exercises: [
      { name: "Muscle-ups", sets: "9-7-5", reps: "", notes: "For time" },
      { name: "Squat Snatches", sets: "9-7-5", reps: "135/95 lbs", notes: "Between muscle-up sets" }
    ]
  },
  {
    name: "Linda",
    description: "Also known as '3 Bars of Death' - 10/9/8/7/6/5/4/3/2/1 reps",
    category: "benchmark",
    exercises: [
      { name: "Deadlifts", sets: "10-9-8-7-6-5-4-3-2-1", reps: "1.5x bodyweight", notes: "For time" },
      { name: "Bench Press", sets: "10-9-8-7-6-5-4-3-2-1", reps: "Bodyweight", notes: "" },
      { name: "Clean", sets: "10-9-8-7-6-5-4-3-2-1", reps: "0.75x bodyweight", notes: "" }
    ]
  },
  {
    name: "Nicole",
    description: "20-minute AMRAP of running and pull-ups",
    category: "benchmark",
    exercises: [
      { name: "Run", sets: "AMRAP", reps: "400m", notes: "20 minutes" },
      { name: "Pull-ups", sets: "AMRAP", reps: "Max reps", notes: "After each run" }
    ]
  },

  // More Hero WODs
  {
    name: "Griff",
    description: "In honor of USAF Staff Sgt Travis L. Griffin",
    category: "hero",
    exercises: [
      { name: "Run", sets: "1", reps: "800m", notes: "For time" },
      { name: "Run", sets: "1", reps: "400m backwards", notes: "" },
      { name: "Run", sets: "1", reps: "800m", notes: "" },
      { name: "Run", sets: "1", reps: "400m backwards", notes: "" }
    ]
  },
  {
    name: "McGhee",
    description: "In honor of Army Sgt. 1st Class James F. McGhee Jr.",
    category: "hero",
    exercises: [
      { name: "Deadlifts", sets: "5", reps: "5", notes: "275/185 lbs" },
      { name: "Pull-ups", sets: "5", reps: "13", notes: "" },
      { name: "Box Jumps", sets: "5", reps: "21", notes: "24/20 inch - For time" }
    ]
  },
  {
    name: "Nate",
    description: "In honor of Army Chief Warrant Officer 3 Nate Hardy - 20 min AMRAP",
    category: "hero",
    exercises: [
      { name: "Muscle-ups", sets: "AMRAP", reps: "2", notes: "20 minutes" },
      { name: "Handstand Push-ups", sets: "AMRAP", reps: "4", notes: "" },
      { name: "Kettlebell Swings", sets: "AMRAP", reps: "8", notes: "70/53 lbs" }
    ]
  },
  {
    name: "Michael",
    description: "In honor of Navy Lieutenant Michael McGreevy",
    category: "hero",
    exercises: [
      { name: "Run", sets: "3", reps: "800m", notes: "For time" },
      { name: "Pull-ups", sets: "3", reps: "50", notes: "" },
      { name: "Back Extensions", sets: "3", reps: "50", notes: "" },
      { name: "Sit-ups", sets: "3", reps: "50", notes: "" }
    ]
  },
  {
    name: "Daniel",
    description: "In honor of Army Sgt. 1st Class Daniel Crabtree",
    category: "hero",
    exercises: [
      { name: "Deadlifts", sets: "50", reps: "", notes: "225/155 lbs" },
      { name: "Wall Ball Shots", sets: "50", reps: "", notes: "20/14 lbs" },
      { name: "Box Jumps", sets: "50", reps: "", notes: "24/20 inch" },
      { name: "Kettlebell Swings", sets: "50", reps: "", notes: "53/35 lbs" },
      { name: "Pull-ups", sets: "50", reps: "", notes: "For time" }
    ]
  },
  {
    name: "Tommy V",
    description: "In honor of SEAL Team 10 Thomas J. Valentine",
    category: "hero",
    exercises: [
      { name: "Thrusters", sets: "21", reps: "", notes: "115/80 lbs" },
      { name: "Pull-ups", sets: "21", reps: "", notes: "" },
      { name: "Thrusters", sets: "18", reps: "", notes: "115/80 lbs" },
      { name: "Pull-ups", sets: "18", reps: "", notes: "" },
      { name: "Thrusters", sets: "15", reps: "", notes: "115/80 lbs" },
      { name: "Pull-ups", sets: "15", reps: "", notes: "" },
      { name: "Thrusters", sets: "12", reps: "", notes: "115/80 lbs" },
      { name: "Pull-ups", sets: "12", reps: "", notes: "For time" }
    ]
  },

  // More Strength WODs
  {
    name: "Bear Complex",
    description: "7 sets of the bear complex - no rest between exercises",
    category: "strength",
    exercises: [
      { name: "Power Clean", sets: "7", reps: "1", notes: "Build to max - no rest between reps" },
      { name: "Front Squat", sets: "7", reps: "1", notes: "" },
      { name: "Push Press", sets: "7", reps: "1", notes: "" },
      { name: "Back Squat", sets: "7", reps: "1", notes: "" },
      { name: "Push Press", sets: "7", reps: "1", notes: "Behind neck" }
    ]
  },
  {
    name: "Strict Cindy",
    description: "20-minute AMRAP - all movements strict",
    category: "strength",
    exercises: [
      { name: "Strict Pull-ups", sets: "AMRAP", reps: "5", notes: "20 minutes" },
      { name: "Strict Push-ups", sets: "AMRAP", reps: "10", notes: "" },
      { name: "Air Squats", sets: "AMRAP", reps: "15", notes: "" }
    ]
  },

  // More MetCon WODs
  {
    name: "Eva",
    description: "Five rounds for time",
    category: "metcon",
    exercises: [
      { name: "Run", sets: "5", reps: "800m", notes: "For time" },
      { name: "Kettlebell Swings", sets: "5", reps: "30", notes: "70/53 lbs" },
      { name: "Pull-ups", sets: "5", reps: "30", notes: "" }
    ]
  },
  {
    name: "Lynne",
    description: "5 rounds of max reps bench press and pull-ups",
    category: "metcon",
    exercises: [
      { name: "Bench Press", sets: "5", reps: "Max", notes: "Bodyweight" },
      { name: "Pull-ups", sets: "5", reps: "Max", notes: "" },
      { name: "Rest", sets: "4", reps: "", notes: "Between rounds" }
    ]
  },
  {
    name: "The Don",
    description: "Named after Don Payne",
    category: "metcon",
    exercises: [
      { name: "Burpees", sets: "66", reps: "", notes: "For time" },
      { name: "Dead Hang Pull-ups", sets: "66", reps: "", notes: "" },
      { name: "Kettlebell Swings", sets: "66", reps: "", notes: "53/35 lbs" },
      { name: "Box Jumps", sets: "66", reps: "", notes: "24/20 inch" }
    ]
  },

  // More Chipper WODs
  {
    name: "Badger",
    description: "Three rounds for time",
    category: "chipper",
    exercises: [
      { name: "Squat Cleans", sets: "3", reps: "30", notes: "95/65 lbs - For time" },
      { name: "Pull-ups", sets: "3", reps: "30", notes: "" },
      { name: "Run", sets: "3", reps: "800m", notes: "" }
    ]
  },
  {
    name: "Severin",
    description: "In honor of Army Chief Warrant Officer 2 Severin W. Summers",
    category: "hero",
    exercises: [
      { name: "Run", sets: "1", reps: "1 mile", notes: "For time" },
      { name: "Thrusters", sets: "50", reps: "", notes: "135/95 lbs" },
      { name: "Dumbbell Step-ups", sets: "50", reps: "", notes: "24/20 inch, 50/35 lb DBs" },
      { name: "Burpees", sets: "50", reps: "", notes: "" }
    ]
  },

  // More EMOM WODs
  {
    name: "Snatch EMOM",
    description: "12 rounds of snatches every minute",
    category: "emom",
    exercises: [
      { name: "Power Snatch", sets: "12", reps: "2", notes: "155/105 lbs - EMOM" },
      { name: "Rest", sets: "12", reps: "", notes: "Remaining time in minute" }
    ]
  },
  {
    name: "Tabata This",
    description: "Tabata intervals (20s work / 10s rest) x 8 rounds each",
    category: "emom",
    exercises: [
      { name: "Pull-ups", sets: "8", reps: "Max", notes: "20s on / 10s off" },
      { name: "Push-ups", sets: "8", reps: "Max", notes: "20s on / 10s off" },
      { name: "Sit-ups", sets: "8", reps: "Max", notes: "20s on / 10s off" },
      { name: "Air Squats", sets: "8", reps: "Max", notes: "20s on / 10s off" }
    ]
  },

  // More Bodyweight WODs
  {
    name: "Annie's Cousin",
    description: "Double-unders and GHD sit-ups for time",
    category: "bodyweight",
    exercises: [
      { name: "Double-unders", sets: "50-40-30-20-10", reps: "", notes: "For time" },
      { name: "GHD Sit-ups", sets: "50-40-30-20-10", reps: "", notes: "Between double-under sets" }
    ]
  },
  {
    name: "Randy",
    description: "75 snatches for time",
    category: "strength",
    exercises: [
      { name: "Power Snatch", sets: "1", reps: "75", notes: "75/55 lbs - For time" }
    ]
  },
  {
    name: "31 Heroes",
    description: "In honor of 31 American and allied soldiers - Partition work as needed",
    category: "hero",
    exercises: [
      { name: "Run", sets: "1", reps: "8 x 400m", notes: "With body armor" },
      { name: "Body Armor", sets: "8", reps: "", notes: "Between runs:" },
      { name: "Pull-ups", sets: "1", reps: "31", notes: "Total" },
      { name: "Push-ups", sets: "1", reps: "31", notes: "Total" },
      { name: "Air Squats", sets: "1", reps: "31", notes: "Total" }
    ]
  },
  {
    name: "Kalsu",
    description: "In honor of Army 1st Lt. James Robert Kalsu - 100 thrusters, 5 burpees EMOM",
    category: "hero",
    exercises: [
      { name: "Thrusters", sets: "1", reps: "100", notes: "135/95 lbs - For time" },
      { name: "Burpees", sets: "EMOM", reps: "5", notes: "Start of every minute including minute 0" }
    ]
  },

  // More Hero WODs
  {
    name: "Blake",
    description: "In honor of Navy Petty Officer 2nd Class Blake Mullins",
    category: "hero",
    exercises: [
      { name: "Run", sets: "4", reps: "800m", notes: "For time" },
      { name: "Back Squats", sets: "4", reps: "30", notes: "185/135 lbs" },
      { name: "Front Squats", sets: "4", reps: "30", notes: "135/95 lbs" }
    ]
  },
  {
    name: "Braeden",
    description: "In honor of Navy SEAL Braeden Daniels",
    category: "hero",
    exercises: [
      { name: "Run", sets: "3", reps: "800m", notes: "For time" },
      { name: "Overhead Squats", sets: "3", reps: "30", notes: "135/95 lbs" },
      { name: "Row", sets: "3", reps: "30 cal", notes: "" }
    ]
  },
  {
    name: "Chad",
    description: "In honor of Navy SEAL Lt. Chad Wilkinson - 1000 step-ups",
    category: "hero",
    exercises: [
      { name: "Box Step-ups", sets: "1", reps: "1000", notes: "24/20 inch box with 45/35 lb ruck - For time" }
    ]
  },
  {
    name: "Clovis",
    description: "In honor of Army Sgt. 1st Class Clovis T. Ray",
    category: "hero",
    exercises: [
      { name: "Burpees", sets: "10", reps: "10", notes: "For time" },
      { name: "Walking Lunge", sets: "10", reps: "10", notes: "50 feet" },
      { name: "Run", sets: "1", reps: "1 mile", notes: "After all rounds" }
    ]
  },
  {
    name: "Danny",
    description: "In honor of Army Sgt. 1st Class Daniel Crabtree",
    category: "hero",
    exercises: [
      { name: "Run", sets: "1", reps: "1.5 miles", notes: "For time" },
      { name: "Thrusters", sets: "50", reps: "", notes: "135/95 lbs" },
      { name: "Pull-ups", sets: "50", reps: "", notes: "" },
      { name: "Run", sets: "1", reps: "1.5 miles", notes: "" }
    ]
  },
  {
    name: "Garrett",
    description: "In honor of Army 1st Lt. Garrison Avery",
    category: "hero",
    exercises: [
      { name: "Run", sets: "1", reps: "1 mile", notes: "For time" },
      { name: "Back Squats", sets: "75", reps: "", notes: "165/110 lbs" },
      { name: "Run", sets: "1", reps: "1 mile", notes: "" }
    ]
  },
  {
    name: "Glen",
    description: "In honor of Navy SEAL Glen Doherty",
    category: "hero",
    exercises: [
      { name: "Clean and Jerk", sets: "30", reps: "", notes: "135/95 lbs" },
      { name: "Run", sets: "1", reps: "1 mile", notes: "" },
      { name: "Burpees", sets: "10", reps: "10", notes: "" },
      { name: "Run", sets: "1", reps: "1 mile", notes: "For time" }
    ]
  },
  {
    name: "Holbrook",
    description: "In honor of Army Master Sgt. Shawn Holbrook",
    category: "hero",
    exercises: [
      { name: "Run", sets: "10", reps: "200m", notes: "For time" },
      { name: "Burpees", sets: "10", reps: "5", notes: "After each run" }
    ]
  },
  {
    name: "Jack",
    description: "In honor of Army Staff Sgt. Jack Martin",
    category: "hero",
    exercises: [
      { name: "Push Press", sets: "10", reps: "10", notes: "115/80 lbs" },
      { name: "Kettlebell Swings", sets: "10", reps: "10", notes: "53/35 lbs" },
      { name: "Box Jumps", sets: "10", reps: "10", notes: "24/20 inch - For time" }
    ]
  },
  {
    name: "Jerry",
    description: "In honor of Army Sgt. Jerry Dwayne Patton",
    category: "hero",
    exercises: [
      { name: "Run", sets: "1", reps: "1 mile", notes: "For time" },
      { name: "Row", sets: "1", reps: "2000m", notes: "" },
      { name: "Run", sets: "1", reps: "1 mile", notes: "" }
    ]
  },
  {
    name: "Josh",
    description: "In honor of Army Sgt. Joshua Hager",
    category: "hero",
    exercises: [
      { name: "Overhead Squats", sets: "21", reps: "", notes: "95/65 lbs" },
      { name: "Pull-ups", sets: "42", reps: "", notes: "" },
      { name: "Overhead Squats", sets: "15", reps: "", notes: "95/65 lbs" },
      { name: "Pull-ups", sets: "30", reps: "", notes: "" },
      { name: "Overhead Squats", sets: "9", reps: "", notes: "95/65 lbs" },
      { name: "Pull-ups", sets: "18", reps: "", notes: "For time" }
    ]
  },
  {
    name: "Luce",
    description: "In honor of Army Spc. Christopher Luce",
    category: "hero",
    exercises: [
      { name: "Run", sets: "1", reps: "1 mile", notes: "For time" },
      { name: "Front Squats", sets: "3", reps: "10", notes: "225/155 lbs" },
      { name: "Run", sets: "1", reps: "1 mile", notes: "" },
      { name: "Shoulder-to-Overhead", sets: "3", reps: "10", notes: "225/155 lbs" },
      { name: "Run", sets: "1", reps: "1 mile", notes: "" }
    ]
  },
  {
    name: "Ryan",
    description: "In honor of Army Sgt. Ryan Pitts - Congressional Medal of Honor recipient",
    category: "hero",
    exercises: [
      { name: "Box Jumps", sets: "5", reps: "7", notes: "24/20 inch" },
      { name: "Thrusters", sets: "5", reps: "10", notes: "115/75 lbs" },
      { name: "Weighted Pull-ups", sets: "5", reps: "13", notes: "1 pood/0.75 pood - For time" }
    ]
  },
  {
    name: "Small",
    description: "In honor of Army Staff Sgt. Marc Small",
    category: "hero",
    exercises: [
      { name: "Row", sets: "3", reps: "1000m", notes: "For time" },
      { name: "Face down", sets: "3", reps: "3 min", notes: "Rest face down" },
      { name: "Run", sets: "3", reps: "800m", notes: "" },
      { name: "Face down", sets: "3", reps: "3 min", notes: "Rest face down" }
    ]
  },

  // More Girls Benchmark WODs
  {
    name: "Christine",
    description: "Three rounds for time",
    category: "benchmark",
    exercises: [
      { name: "Row", sets: "3", reps: "500m", notes: "For time" },
      { name: "Bodyweight Deadlifts", sets: "3", reps: "12", notes: "" },
      { name: "Bodyweight Bench Press", sets: "3", reps: "21", notes: "" }
    ]
  },
  {
    name: "Eva",
    description: "Five rounds for time - also classified as a Girl",
    category: "benchmark",
    exercises: [
      { name: "Run", sets: "5", reps: "800m", notes: "For time" },
      { name: "Kettlebell Swings", sets: "5", reps: "30", notes: "70/53 lbs" },
      { name: "Pull-ups", sets: "5", reps: "30", notes: "" }
    ]
  },

  // Classic Benchmark WODs
  {
    name: "The 300",
    description: "Spartan workout - 300 total reps for time",
    category: "benchmark",
    exercises: [
      { name: "Pull-ups", sets: "1", reps: "25", notes: "For time" },
      { name: "Deadlifts", sets: "1", reps: "50", notes: "135 lbs" },
      { name: "Push-ups", sets: "1", reps: "50", notes: "" },
      { name: "Box Jumps", sets: "1", reps: "50", notes: "24 inch" },
      { name: "Floor Wipers", sets: "1", reps: "50", notes: "135 lbs" },
      { name: "Single-arm Clean and Press", sets: "1", reps: "50", notes: "36 lb KB" },
      { name: "Pull-ups", sets: "1", reps: "25", notes: "" }
    ]
  },
  {
    name: "Death by Burpees",
    description: "EMOM until failure - add 1 burpee each minute",
    category: "emom",
    exercises: [
      { name: "Burpees", sets: "EMOM", reps: "1, 2, 3...", notes: "Minute 1: 1 burpee, Minute 2: 2 burpees, etc." }
    ]
  },
  {
    name: "Helen (Hero)",
    description: "Three rounds for time - named variation",
    category: "hero",
    exercises: [
      { name: "Run", sets: "3", reps: "400m", notes: "For time" },
      { name: "Kettlebell Swings", sets: "3", reps: "21", notes: "53/35 lbs" },
      { name: "Pull-ups", sets: "3", reps: "12", notes: "" }
    ]
  },

  // More MetCon/Chipper WODs
  {
    name: "The Big Nasty",
    description: "Brutal chipper for time",
    category: "chipper",
    exercises: [
      { name: "Squat Cleans", sets: "50", reps: "", notes: "135/95 lbs" },
      { name: "Deadlifts", sets: "40", reps: "", notes: "185/125 lbs" },
      { name: "Burpees", sets: "30", reps: "", notes: "" },
      { name: "Wall Ball Shots", sets: "20", reps: "", notes: "20/14 lbs" },
      { name: "Chest-to-Bar Pull-ups", sets: "10", reps: "", notes: "For time" }
    ]
  },
  {
    name: "Nasty Girls",
    description: "Three rounds for time - classic benchmark",
    category: "benchmark",
    exercises: [
      { name: "Air Squats", sets: "3", reps: "50", notes: "For time" },
      { name: "Muscle-ups", sets: "3", reps: "7", notes: "" },
      { name: "Hang Power Cleans", sets: "3", reps: "10", notes: "135/95 lbs" }
    ]
  },
  {
    name: "Seven",
    description: "Seven rounds for time - different from The Seven",
    category: "metcon",
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
  {
    name: "Rocket",
    description: "Three rounds for time",
    category: "metcon",
    exercises: [
      { name: "Box Jumps", sets: "3", reps: "50", notes: "24/20 inch" },
      { name: "Burpees", sets: "3", reps: "25", notes: "" },
      { name: "Overhead Walking Lunge", sets: "3", reps: "50", notes: "45/25 lbs plate - For time" }
    ]
  },
  {
    name: "Ronin",
    description: "In honor of the movie - five rounds for time",
    category: "metcon",
    exercises: [
      { name: "Run", sets: "5", reps: "400m", notes: "For time" },
      { name: "Thrusters", sets: "5", reps: "21", notes: "95/65 lbs" },
      { name: "Pull-ups", sets: "5", reps: "21", notes: "" }
    ]
  },

  // Bodyweight Classics
  {
    name: "Air Force WOD",
    description: "20-minute AMRAP bodyweight",
    category: "bodyweight",
    exercises: [
      { name: "Thrusters", sets: "AMRAP", reps: "4", notes: "95/65 lbs - 20 minutes" },
      { name: "Push-ups", sets: "AMRAP", reps: "8", notes: "" },
      { name: "Walking Lunge", sets: "AMRAP", reps: "12", notes: "Steps" }
    ]
  },
  {
    name: "Body Armor",
    description: "For time bodyweight chipper",
    category: "bodyweight",
    exercises: [
      { name: "Run", sets: "1", reps: "1 mile", notes: "For time" },
      { name: "Push-ups", sets: "100", reps: "", notes: "" },
      { name: "Sit-ups", sets: "200", reps: "", notes: "" },
      { name: "Air Squats", sets: "300", reps: "", notes: "" },
      { name: "Run", sets: "1", reps: "1 mile", notes: "" }
    ]
  },

  // Open-Style WODs
  {
    name: "Open WOD 11.1",
    description: "10-minute AMRAP classic",
    category: "metcon",
    exercises: [
      { name: "Power Snatch", sets: "AMRAP", reps: "30", notes: "75/55 lbs - 10 minutes" },
      { name: "Bar-Facing Burpees", sets: "AMRAP", reps: "30", notes: "" }
    ]
  },
  {
    name: "Open WOD 14.5",
    description: "Famous thrusters and bar-facing burpees",
    category: "metcon",
    exercises: [
      { name: "Thrusters", sets: "21-18-15-12-9-6-3", reps: "", notes: "95/65 lbs" },
      { name: "Bar-Facing Burpees", sets: "21-18-15-12-9-6-3", reps: "", notes: "For time" }
    ]
  },

  // More Strength WODs
  {
    name: "CrossFit Total",
    description: "Find 1RM of three lifts",
    category: "strength",
    exercises: [
      { name: "Back Squat", sets: "1", reps: "1RM", notes: "Max weight" },
      { name: "Shoulder Press", sets: "1", reps: "1RM", notes: "Max weight" },
      { name: "Deadlift", sets: "1", reps: "1RM", notes: "Max weight - Total all three" }
    ]
  },
  {
    name: "The Chief",
    description: "5 rounds of 3-minute AMRAP",
    category: "metcon",
    exercises: [
      { name: "Power Cleans", sets: "5", reps: "3", notes: "135/95 lbs - 3 min AMRAP" },
      { name: "Push-ups", sets: "5", reps: "6", notes: "" },
      { name: "Air Squats", sets: "5", reps: "9", notes: "" },
      { name: "Rest", sets: "4", reps: "1 min", notes: "Between rounds" }
    ]
  }
];

// Extract all unique exercise names from all workouts
export const getAllExerciseNames = () => {
  const exerciseNames = new Set();
  
  crossfitWorkouts.forEach(workout => {
    if (workout.exercises && Array.isArray(workout.exercises)) {
      workout.exercises.forEach(exercise => {
        if (exercise.name) {
          exerciseNames.add(exercise.name);
        }
      });
    }
  });
  
  return Array.from(exerciseNames).sort();
};

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
