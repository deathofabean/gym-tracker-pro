import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Plus, History, TrendingUp, X, Check, Trophy, Clock, ChevronDown, ChevronRight, Trash2, Target, Zap, Heart, Info, BarChart3, Flame, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// COMPREHENSIVE EXERCISE DATABASE with Form Instructions
const EXERCISE_DATABASE = {
  // === CHEST ===
  'Bench Press': { muscle: ['Chest', 'Shoulders', 'Arms'], compound: true, form: 'Lie flat, feet planted. Grip bar slightly wider than shoulders. Lower to mid-chest, elbows at 45°. Press up explosively. Keep shoulder blades retracted.' },
  'Incline Bench Press': { muscle: ['Chest', 'Shoulders'], compound: true, form: 'Set bench 30-45°. Lower to upper chest. Targets upper chest. Keep lower back against bench.' },
  'Decline Bench Press': { muscle: ['Chest', 'Arms'], compound: true, form: 'Set bench 15-30° decline. Secure feet. Lower to lower chest. Targets lower chest.' },
  'Dumbbell Press': { muscle: ['Chest', 'Shoulders'], compound: true, form: 'Lie flat, dumbbells at chest. Press up and slightly together. Greater range than barbell. Control descent.' },
  'Incline Dumbbell Press': { muscle: ['Chest', 'Shoulders'], compound: true, form: '30-45° incline. Start at upper chest. Press up and together. Excellent for upper chest development.' },
  'Dumbbell Flyes': { muscle: ['Chest'], compound: false, form: 'Lie flat, arms in wide arc with slight elbow bend. Deep stretch at bottom, squeeze pecs together at top.' },
  'Cable Crossovers': { muscle: ['Chest'], compound: false, form: 'Stand between cables set high. Bring handles together in front. Squeeze pecs at peak contraction.' },
  'Chest Dips': { muscle: ['Chest', 'Shoulders', 'Arms'], compound: true, form: 'Lean forward 30-45°, elbows out. Lower until chest stretch. Push up explosively.' },
  'Push-ups': { muscle: ['Chest', 'Shoulders', 'Arms', 'Core'], compound: true, form: 'Hands shoulder-width, body straight. Lower to ground, elbows 45°. Push up. Core tight.' },
  'Dips': { muscle: ['Chest', 'Arms'], compound: true, form: 'Parallel bars. Upright = triceps, lean forward = chest. Lower to 90°, push up.' },
  
  // === BACK ===
  'Deadlift': { muscle: ['Back', 'Legs', 'Core'], compound: true, form: 'Feet hip-width, bar over mid-foot. Neutral spine, chest up. Drive through heels. Extend hips and knees. The king of exercises.' },
  'Romanian Deadlift': { muscle: ['Back', 'Legs'], compound: true, form: 'Slight knee bend. Hinge at hips, push hips back, lower bar down legs. Feel hamstring stretch. Back straight.' },
  'Pull-ups': { muscle: ['Back', 'Arms'], compound: true, form: 'Overhand grip. Pull chest to bar, squeeze shoulder blades. Lower with control. Full range.' },
  'Chin-ups': { muscle: ['Back', 'Arms'], compound: true, form: 'Underhand grip. Pull until chin clears bar. More bicep involvement than pullups.' },
  'Barbell Row': { muscle: ['Back', 'Arms'], compound: true, form: 'Bend 45°, slight knee bend. Pull bar to lower chest. Elbows tight. Squeeze shoulder blades.' },
  'T-Bar Row': { muscle: ['Back'], compound: true, form: 'Chest supported. Pull bar to chest. Great for middle back thickness. Keep chest on pad.' },
  'Dumbbell Row': { muscle: ['Back', 'Arms'], compound: true, form: 'One knee on bench. Pull to hip, elbow high. Don\'t rotate torso. Addresses imbalances.' },
  'Lat Pulldown': { muscle: ['Back', 'Arms'], compound: true, form: 'Pull bar to upper chest. Slight lean back. Squeeze lats at bottom. Pull-up alternative.' },
  'Cable Row': { muscle: ['Back'], compound: true, form: 'Seated, pull handle to lower chest. Squeeze shoulder blades. Don\'t rock back excessively.' },
  'Face Pulls': { muscle: ['Back', 'Shoulders'], compound: false, form: 'Rope at face height. Pull to face, spread rope ends. Rear delts and upper back. Posture essential.' },
  'Inverted Row': { muscle: ['Back', 'Arms'], compound: true, form: 'Under bar at hip height. Body straight. Pull chest to bar. Bodyweight row variation.' },
  
  // === SHOULDERS ===
  'Overhead Press': { muscle: ['Shoulders', 'Arms'], compound: true, form: 'Bar at shoulders. Press straight up, lock elbows. Bar path vertical. Core tight. Best shoulder builder.' },
  'Seated Overhead Press': { muscle: ['Shoulders', 'Arms'], compound: true, form: 'Seated with back support. Removes leg drive. More isolated shoulder work.' },
  'Arnold Press': { muscle: ['Shoulders'], compound: true, form: 'Start palms facing you. Press up while rotating palms out. All three delt heads worked.' },
  'Dumbbell Shoulder Press': { muscle: ['Shoulders'], compound: true, form: 'Dumbbells at shoulders. Press overhead. Standing or seated. Greater ROM than barbell.' },
  'Lateral Raises': { muscle: ['Shoulders'], compound: false, form: 'Raise arms to sides to shoulder height. Slight elbow bend. Lead with elbows. Targets side delts.' },
  'Front Raises': { muscle: ['Shoulders'], compound: false, form: 'Raise arms forward to shoulder height. Alternate or together. Targets front delts.' },
  'Rear Delt Flyes': { muscle: ['Shoulders', 'Back'], compound: false, form: 'Bent over 90°. Raise dumbbells to sides. Squeeze shoulder blades. Essential for shoulder health.' },
  'Upright Row': { muscle: ['Shoulders', 'Arms'], compound: true, form: 'Pull bar to chin, elbows high. Caution: can cause impingement. Stop if pinching.' },
  'Shrugs': { muscle: ['Shoulders'], compound: false, form: 'Shrug shoulders straight up. Squeeze at top. Targets traps. Don\'t roll shoulders.' },
  
  // === ARMS ===
  'Barbell Curl': { muscle: ['Arms'], compound: false, form: 'Standing, bar at thighs. Curl to shoulders, elbows stationary. Squeeze at top. Classic bicep builder.' },
  'Dumbbell Curl': { muscle: ['Arms'], compound: false, form: 'Palms forward. Curl together or alternating. Can supinate at top. Full ROM.' },
  'Hammer Curl': { muscle: ['Arms'], compound: false, form: 'Neutral grip throughout. Targets brachialis and forearms. Builds arm thickness.' },
  'Preacher Curl': { muscle: ['Arms'], compound: false, form: 'Arms on preacher bench. Isolates biceps, prevents momentum. Full stretch at bottom.' },
  'Concentration Curl': { muscle: ['Arms'], compound: false, form: 'Sit, elbow inside thigh. Curl to shoulder. Excellent isolation and peak contraction.' },
  'Cable Curl': { muscle: ['Arms'], compound: false, form: 'Low cable. Curl to shoulders. Constant tension unlike free weights.' },
  'Bicep Curls': { muscle: ['Arms'], compound: false, form: 'Generic bicep curl. Barbell, dumbbell, or cable. Curl weight to shoulders with control.' },
  'Tricep Dips': { muscle: ['Arms', 'Chest'], compound: true, form: 'More upright for triceps. Lower to 90°, push up. Can add weight with belt.' },
  'Close Grip Bench Press': { muscle: ['Arms', 'Chest'], compound: true, form: 'Hands shoulder-width, elbows tucked. Excellent tricep mass builder with heavy weight.' },
  'Skull Crushers': { muscle: ['Arms'], compound: false, form: 'Lie flat, lower bar to forehead. Extend back up. Keep upper arms stationary. EZ bar preferred.' },
  'Overhead Tricep Extension': { muscle: ['Arms'], compound: false, form: 'Dumbbell or cable overhead. Lower behind head. Great long head stretch. Elbows forward.' },
  'Tricep Pushdowns': { muscle: ['Arms'], compound: false, form: 'High cable. Push down fully, squeeze at bottom. Elbows at sides. Most popular tricep exercise.' },
  'Rope Pushdown': { muscle: ['Arms'], compound: false, form: 'Push down and spread rope ends at bottom. Better peak contraction than bar.' },
  'Cable Tricep Extension': { muscle: ['Arms'], compound: false, form: 'Cable overhead or pushdown. Extend arms fully. Constant tension on triceps.' },
  
  // === LEGS ===
  'Squat': { muscle: ['Legs', 'Core'], compound: true, form: 'Bar on upper back. Feet shoulder-width. Squat to parallel or below. Drive through heels. King of legs.' },
  'Front Squat': { muscle: ['Legs', 'Core'], compound: true, form: 'Bar on front delts, elbows high. More upright. Quad-dominant. Core extremely tight.' },
  'Leg Press': { muscle: ['Legs'], compound: true, form: 'Seated, push platform up. Don\'t lock knees fully. Lower with control. Can safely go heavy.' },
  'Leg Extension': { muscle: ['Legs'], compound: false, form: 'Seated, extend legs. Squeeze quads at full extension. Pure quad isolation.' },
  'Leg Curls': { muscle: ['Legs'], compound: false, form: 'Lying or seated. Curl legs, contract hamstrings. Squeeze at peak. Hamstring isolation.' },
  'Leg Extensions': { muscle: ['Legs'], compound: false, form: 'Same as Leg Extension. Seated machine. Quad isolation exercise.' },
  'Bulgarian Split Squat': { muscle: ['Legs'], compound: true, form: 'Rear foot elevated. Lower on front leg. Excellent for quads, glutes, single-leg strength.' },
  'Walking Lunges': { muscle: ['Legs', 'Core'], compound: true, form: 'Step forward into lunge. Back knee nearly touches ground. Drive through front heel. Continue walking.' },
  'Lunges': { muscle: ['Legs'], compound: true, form: 'Step forward or backward into lunge. Alternate legs. Great functional strength.' },
  'Calf Raises': { muscle: ['Legs'], compound: false, form: 'Stand on elevated surface. Rise on toes, hold squeeze. Lower below start for stretch.' },
  'Hip Thrust': { muscle: ['Legs'], compound: true, form: 'Upper back on bench, bar on hips. Drive hips up, squeeze glutes hard. Best glute builder.' },
  'Goblet Squat': { muscle: ['Legs'], compound: true, form: 'Hold dumbbell at chest. Squat deep. Great for learning squat pattern.' },
  'Step-ups': { muscle: ['Legs'], compound: true, form: 'Step onto box with one leg. Drive through heel. Step down with control.' },
  
  // === CORE ===
  'Plank': { muscle: ['Core'], compound: false, form: 'Forearms down, body straight. Hold without sagging hips or piking up. Squeeze glutes and abs.' },
  'Side Plank': { muscle: ['Core'], compound: false, form: 'On one forearm, body sideways. Targets obliques. Don\'t let hips drop. Switch sides.' },
  'Ab Wheel Rollout': { muscle: ['Core'], compound: false, form: 'On knees, roll forward keeping core tight. Go far without lower back sagging. Advanced.' },
  'Hanging Leg Raises': { muscle: ['Core'], compound: false, form: 'Hang from bar. Raise legs to 90° or higher. Control descent. Don\'t swing. Advanced.' },
  'Cable Crunches': { muscle: ['Core'], compound: false, form: 'Kneeling, rope behind head. Crunch down, bring ribs to pelvis. Great for weighted ab training.' },
  'Russian Twists': { muscle: ['Core'], compound: false, form: 'Seated, lean back 45°. Hold weight. Rotate side to side. Targets obliques and rotation.' },
  'Mountain Climbers': { muscle: ['Core'], compound: true, form: 'Push-up position. Alternate driving knees to chest rapidly. Cardio and core combined.' },
  'Bicycle Crunches': { muscle: ['Core'], compound: false, form: 'On back. Alternate elbow to opposite knee. Continuous fluid motion. Works entire core.' },
  'Dead Bug': { muscle: ['Core'], compound: false, form: 'On back, alternate extending opposite arm and leg. Keep lower back pressed to floor. Core stability.' },
  'Pallof Press': { muscle: ['Core'], compound: false, form: 'Stand sideways to cable at chest height. Press out, resist rotation. Anti-rotation exercise.' },
  'Woodchoppers': { muscle: ['Core'], compound: false, form: 'Cable high, rotate down across body. Like chopping wood. Targets obliques and rotation.' },
  'Sit-ups': { muscle: ['Core'], compound: false, form: 'Classic ab exercise. Lie down, come all the way up. Can anchor feet.' },
  'Crunches': { muscle: ['Core'], compound: false, form: 'Lie on back, knees bent. Lift shoulder blades off ground. Squeeze abs. Don\'t pull neck.' },
  'L-Sit': { muscle: ['Core'], compound: false, form: 'Support body, legs straight forward. Hold position. Insane core and hip flexor strength required.' },
};

const DEFAULT_TEMPLATES = {
  push: { name: 'Push Day (PPL)', category: 'PPL', exercises: ['Bench Press', 'Overhead Press', 'Incline Dumbbell Press', 'Lateral Raises', 'Tricep Pushdowns', 'Overhead Tricep Extension'] },
  pull: { name: 'Pull Day (PPL)', category: 'PPL', exercises: ['Deadlift', 'Pull-ups', 'Barbell Row', 'Lat Pulldown', 'Face Pulls', 'Barbell Curl', 'Hammer Curl'] },
  legs: { name: 'Leg Day (PPL)', category: 'PPL', exercises: ['Squat', 'Romanian Deadlift', 'Leg Press', 'Leg Curls', 'Leg Extension', 'Calf Raises'] },
  chest: { name: 'Chest Day', category: 'Bro Split', exercises: ['Bench Press', 'Incline Bench Press', 'Dumbbell Flyes', 'Cable Crossovers', 'Chest Dips'] },
  back: { name: 'Back Day', category: 'Bro Split', exercises: ['Deadlift', 'Pull-ups', 'Barbell Row', 'T-Bar Row', 'Lat Pulldown', 'Cable Row'] },
  shoulders: { name: 'Shoulder Day', category: 'Bro Split', exercises: ['Overhead Press', 'Arnold Press', 'Lateral Raises', 'Front Raises', 'Rear Delt Flyes', 'Shrugs'] },
  arms: { name: 'Arms Day', category: 'Bro Split', exercises: ['Barbell Curl', 'Hammer Curl', 'Preacher Curl', 'Tricep Dips', 'Skull Crushers', 'Tricep Pushdowns'] },
  legs2: { name: 'Legs Day', category: 'Bro Split', exercises: ['Squat', 'Romanian Deadlift', 'Leg Press', 'Leg Curls', 'Bulgarian Split Squat', 'Calf Raises'] },
  arnoldChestBack: { name: 'Chest & Back', category: 'Arnold Split', exercises: ['Bench Press', 'Pull-ups', 'Incline Dumbbell Press', 'Barbell Row', 'Dumbbell Flyes', 'Lat Pulldown'] },
  arnoldShouldersArms: { name: 'Shoulders & Arms', category: 'Arnold Split', exercises: ['Overhead Press', 'Barbell Curl', 'Lateral Raises', 'Tricep Dips', 'Front Raises', 'Hammer Curl'] },
  arnoldLegs: { name: 'Legs', category: 'Arnold Split', exercises: ['Squat', 'Romanian Deadlift', 'Leg Press', 'Leg Curls', 'Walking Lunges', 'Hip Thrust'] },
  fullBody: { name: 'Full Body', category: 'Full Body', exercises: ['Squat', 'Bench Press', 'Barbell Row', 'Overhead Press', 'Romanian Deadlift', 'Pull-ups'] },
  upper: { name: 'Upper Body', category: 'Upper/Lower', exercises: ['Bench Press', 'Barbell Row', 'Overhead Press', 'Pull-ups', 'Dips', 'Barbell Curl'] },
  lower: { name: 'Lower Body', category: 'Upper/Lower', exercises: ['Squat', 'Romanian Deadlift', 'Leg Press', 'Leg Curls', 'Walking Lunges', 'Calf Raises'] },
  core: { name: 'Core Focus', category: 'Other', exercises: ['Plank', 'Hanging Leg Raises', 'Cable Crunches', 'Russian Twists', 'Ab Wheel Rollout', 'Mountain Climbers'] }
};

const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
const CARDIO_TYPES = ['Running', 'Cycling', 'Swimming', 'Rowing', 'Elliptical', 'Stairmaster', 'Jump Rope', 'Boxing', 'HIIT', 'Walking', 'Sports'];

export default function PRorER() {
  const [view, setView] = useState('home');
  const [workouts, setWorkouts] = useState([]);
  const [cardioSessions, setCardioSessions] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [weeklyGoal, setWeeklyGoal] = useState(4);
  
  const [showTemplateSelect, setShowTemplateSelect] = useState(false);
  const [showExerciseSelect, setShowExerciseSelect] = useState(false);
  const [showExerciseInfo, setShowExerciseInfo] = useState(null);
  const [showCardioLog, setShowCardioLog] = useState(false);
  const [showGoalSetting, setShowGoalSetting] = useState(false);
  const [customExerciseName, setCustomExerciseName] = useState('');
  const [customExerciseMuscles, setCustomExerciseMuscles] = useState(['Chest']);
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState('All');
  
  const [cardioType, setCardioType] = useState('Running');
  const [cardioDuration, setCardioDuration] = useState('');
  const [cardioNotes, setCardioNotes] = useState('');
  
  const [restTimer, setRestTimer] = useState(0);
  const [restTimerActive, setRestTimerActive] = useState(false);
  const [restTimerExercise, setRestTimerExercise] = useState('');
  const restTimerInterval = useRef(null);
  
  const [progressMuscleFilter, setProgressMuscleFilter] = useState('All');
  const [progressTimeFilter, setProgressTimeFilter] = useState('3months');
  const [expandedWorkout, setExpandedWorkout] = useState(null);

  useEffect(() => { loadData(); }, []);
  
  useEffect(() => {
    let interval;
    if (workoutStartTime && activeWorkout) {
      interval = setInterval(() => {
        setWorkoutDuration(Math.floor((Date.now() - workoutStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutStartTime, activeWorkout]);

  useEffect(() => {
    if (restTimerActive && restTimer > 0) {
      restTimerInterval.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) { setRestTimerActive(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(restTimerInterval.current);
    }
    return () => clearInterval(restTimerInterval.current);
  }, [restTimerActive, restTimer]);

  const loadData = async () => {
    try {
      const workoutsResult = await window.storage.get('prer-workouts-v2', false);
      const cardioResult = await window.storage.get('prer-cardio', false);
      const templatesResult = await window.storage.get('prer-templates-v2', false);
      const goalResult = await window.storage.get('prer-weekly-goal', false);
      
      if (workoutsResult?.value) setWorkouts(JSON.parse(workoutsResult.value));
      if (cardioResult?.value) setCardioSessions(JSON.parse(cardioResult.value));
      if (goalResult?.value) setWeeklyGoal(parseInt(goalResult.value));
      
      if (templatesResult?.value) {
        setTemplates(JSON.parse(templatesResult.value));
      } else {
        const defaultTemplatesList = Object.values(DEFAULT_TEMPLATES);
        setTemplates(defaultTemplatesList);
        await window.storage.set('prer-templates-v2', JSON.stringify(defaultTemplatesList), false);
      }
    } catch (error) {
      const defaultTemplatesList = Object.values(DEFAULT_TEMPLATES);
      setTemplates(defaultTemplatesList);
    }
    setLoading(false);
  };

  const saveWorkouts = async (updated) => {
    try { await window.storage.set('prer-workouts-v2', JSON.stringify(updated), false); }
    catch (e) { console.error(e); }
  };

  const saveCardio = async (updated) => {
    try { await window.storage.set('prer-cardio', JSON.stringify(updated), false); }
    catch (e) { console.error(e); }
  };

  const saveGoal = async (goal) => {
    try { await window.storage.set('prer-weekly-goal', goal.toString(), false); }
    catch (e) { console.error(e); }
  };

  const startWorkout = (template = null) => {
    let exercises = [];
    if (template) {
      exercises = template.exercises.map(name => ({ id: Date.now() + Math.random(), name, sets: [] }));
    }
    setActiveWorkout({ id: Date.now(), exercises, templateName: template?.name || 'Custom Workout' });
    setWorkoutStartTime(Date.now());
    setView('workout');
  };

  const addExerciseToWorkout = (exerciseName, muscles = null) => {
    if (!activeWorkout) return;
    if (muscles && !EXERCISE_DATABASE[exerciseName]) {
      EXERCISE_DATABASE[exerciseName] = { muscle: muscles, compound: false, form: 'Custom exercise - track your form!' };
    }
    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, { id: Date.now() + Math.random(), name: exerciseName, sets: [] }]
    });
    setShowExerciseSelect(false);
    setCustomExerciseName('');
  };

  const addSetToExercise = (exerciseId) => {
    const exercise = activeWorkout.exercises.find(ex => ex.id === exerciseId);
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const previousWorkout = getPreviousWorkoutForExercise(exercise.name);
    
    let weight = '', reps = '';
    if (lastSet?.completed) { weight = lastSet.weight; reps = lastSet.reps; }
    else if (previousWorkout) { weight = previousWorkout.weight; reps = previousWorkout.reps; }
    
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, sets: [...ex.sets, { id: Date.now() + Math.random(), weight, reps, completed: false }] } : ex
      )
    });
  };

  const updateSet = (exerciseId, setId, field, value) => {
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, sets: ex.sets.map(set => set.id === setId ? { ...set, [field]: value } : set) } : ex
      )
    });
  };

  const completeSet = (exerciseId, setId) => {
    const exercise = activeWorkout.exercises.find(ex => ex.id === exerciseId);
    const set = exercise.sets.find(s => s.id === setId);
    if (!set.weight || !set.reps) return;
    
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, sets: ex.sets.map(s => s.id === setId ? { ...s, completed: true } : s) } : ex
      )
    });
    setRestTimer(90); setRestTimerExercise(exercise.name); setRestTimerActive(true);
  };

  const deleteSet = (exerciseId, setId) => {
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex => ex.id === exerciseId ? { ...ex, sets: ex.sets.filter(s => s.id !== setId) } : ex)
    });
  };

  const deleteExercise = (exerciseId) => {
    setActiveWorkout({ ...activeWorkout, exercises: activeWorkout.exercises.filter(ex => ex.id !== exerciseId) });
  };

  const deleteWorkout = (workoutId) => {
    if (confirm('Delete this workout? This cannot be undone.')) {
      const updated = workouts.filter(w => w.id !== workoutId);
      setWorkouts(updated); saveWorkouts(updated);
    }
  };

  const finishWorkout = () => {
    if (!activeWorkout || activeWorkout.exercises.length === 0) return;
    const completedWorkout = {
      id: Date.now(), date: new Date().toISOString(), duration: workoutDuration,
      templateName: activeWorkout.templateName,
      exercises: activeWorkout.exercises.filter(ex => ex.sets.some(set => set.completed))
    };
    const updated = [completedWorkout, ...workouts];
    setWorkouts(updated); saveWorkouts(updated);
    setActiveWorkout(null); setWorkoutStartTime(null); setWorkoutDuration(0);
    setRestTimerActive(false); setRestTimer(0); setView('home');
  };

  const cancelWorkout = () => {
    if (confirm('Cancel workout? All progress will be lost.')) {
      setActiveWorkout(null); setWorkoutStartTime(null); setWorkoutDuration(0);
      setRestTimerActive(false); setView('home');
    }
  };

  const logCardio = () => {
    if (!cardioType || !cardioDuration) return;
    const session = { id: Date.now(), date: new Date().toISOString(), type: cardioType, duration: parseInt(cardioDuration), notes: cardioNotes };
    const updated = [session, ...cardioSessions];
    setCardioSessions(updated); saveCardio(updated);
    setCardioType('Running'); setCardioDuration(''); setCardioNotes(''); setShowCardioLog(false);
  };

  const deleteCardioSession = (sessionId) => {
    if (confirm('Delete this cardio session?')) {
      const updated = cardioSessions.filter(s => s.id !== sessionId);
      setCardioSessions(updated); saveCardio(updated);
    }
  };

  const getPreviousWorkoutForExercise = (exerciseName) => {
    for (let workout of workouts) {
      const exercise = workout.exercises.find(ex => ex.name === exerciseName);
      if (exercise?.sets?.length > 0) {
        const completed = exercise.sets.filter(set => set.completed);
        if (completed.length > 0) return completed[completed.length - 1];
      }
    }
    return null;
  };

  const getWorkoutsThisWeek = () => {
    const now = new Date(); const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); weekStart.setHours(0, 0, 0, 0);
    return workouts.filter(w => new Date(w.date) >= weekStart).length;
  };

  const getCardioThisWeek = () => {
    const now = new Date(); const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); weekStart.setHours(0, 0, 0, 0);
    return cardioSessions.filter(s => new Date(s.date) >= weekStart).length;
  };

  const getFrequencyByMuscle = () => {
    const now = new Date(); const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const freq = {}; MUSCLE_GROUPS.forEach(m => freq[m] = 0);
    
    workouts.forEach(workout => {
      if (new Date(workout.date) < weekStart) return;
      const hit = new Set();
      workout.exercises.forEach(ex => {
        const data = EXERCISE_DATABASE[ex.name];
        if (data) {
          const muscles = Array.isArray(data.muscle) ? data.muscle : [data.muscle];
          muscles.forEach(m => { if (MUSCLE_GROUPS.includes(m)) hit.add(m); });
        }
      });
      hit.forEach(m => freq[m]++);
    });
    
    return Object.entries(freq).map(([muscle, count]) => ({ muscle, count }))
      .filter(d => d.count > 0).sort((a, b) => b.count - a.count);
  };

  const getSetsPerMuscle = () => {
    const now = new Date(); const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const sets = {}; MUSCLE_GROUPS.forEach(m => sets[m] = 0);
    
    workouts.forEach(workout => {
      if (new Date(workout.date) < weekStart) return;
      workout.exercises.forEach(ex => {
        const data = EXERCISE_DATABASE[ex.name];
        if (data) {
          const completedSets = ex.sets.filter(s => s.completed).length;
          const muscles = Array.isArray(data.muscle) ? data.muscle : [data.muscle];
          muscles.forEach(m => { if (MUSCLE_GROUPS.includes(m)) sets[m] += completedSets; });
        }
      });
    });
    
    return Object.entries(sets).map(([muscle, count]) => ({ muscle, sets: count }))
      .filter(d => d.sets > 0).sort((a, b) => b.sets - a.sets);
  };

  const getAllPRs = () => {
    const prs = {};
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        ex.sets.forEach(set => {
          if (set.completed && set.weight && set.reps) {
            const weight = parseFloat(set.weight); const reps = parseInt(set.reps);
            const est1RM = reps === 1 ? weight : Math.round(weight * (1 + reps / 30) * 10) / 10;
            const data = EXERCISE_DATABASE[ex.name];
            const muscles = data?.muscle || ['Other'];
            const primaryMuscle = Array.isArray(muscles) ? muscles[0] : muscles;
            if (!prs[ex.name] || est1RM > prs[ex.name].est1RM) {
              prs[ex.name] = { weight, reps, est1RM, date: workout.date, muscle: primaryMuscle };
            }
          }
        });
      });
    });
    return Object.entries(prs).map(([exercise, data]) => ({ exercise, ...data })).sort((a, b) => b.est1RM - a.est1RM);
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600); const mins = Math.floor((seconds % 3600) / 60); const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString); const today = new Date(); const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTotalWorkouts = () => workouts.length;
  const getTotalVolume = () => {
    let volume = 0;
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        ex.sets.forEach(set => {
          if (set.completed && set.weight && set.reps) volume += parseFloat(set.weight) * parseInt(set.reps);
        });
      });
    });
    return Math.round(volume);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // HOME VIEW
  if (view === 'home') {
    const recentWorkouts = workouts.slice(0, 3);
    const frequencyData = getFrequencyByMuscle();
    const setsData = getSetsPerMuscle();
    const workoutsThisWeek = getWorkoutsThisWeek();
    const cardioThisWeek = getCardioThisWeek();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-20">
        <div className="bg-slate-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">PR or ER</h1>
                <p className="text-xs text-gray-400 mt-0.5">Personal Record or Emergency Room</p>
              </div>
              <button onClick={() => setShowGoalSetting(true)} className="p-2 hover:bg-slate-800 rounded-lg transition">
                <Target className="w-6 h-6 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <button onClick={() => setShowTemplateSelect(true)}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 py-5 rounded-2xl font-bold text-lg mb-4 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-3 transition-all">
            <Dumbbell className="w-6 h-6" />Start New Workout
          </button>

          <button onClick={() => setShowCardioLog(true)}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-emerald-600/30 py-3 rounded-xl font-medium mb-6 flex items-center justify-center gap-2 transition">
            <Heart className="w-5 h-5 text-emerald-400" />Log Cardio
          </button>

          <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">This Week's Progress</h3>
              <span className="text-sm text-gray-400">Goal: {weeklyGoal} workouts</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                <div className={`h-full rounded-full transition-all ${workoutsThisWeek >= weeklyGoal ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min((workoutsThisWeek / weeklyGoal) * 100, 100)}%` }} />
              </div>
              <span className="text-2xl font-bold text-emerald-400">{workoutsThisWeek}/{weeklyGoal}</span>
            </div>
            {cardioThisWeek > 0 && (
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />{cardioThisWeek} cardio session{cardioThisWeek !== 1 ? 's' : ''} this week
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-emerald-400">{getTotalWorkouts()}</div>
              <div className="text-xs text-gray-400 mt-1">Total Workouts</div>
            </div>
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-emerald-400">{(getTotalVolume() / 1000).toFixed(1)}K</div>
              <div className="text-xs text-gray-400 mt-1">Total Volume</div>
            </div>
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-emerald-400">{getAllPRs().length}</div>
              <div className="text-xs text-gray-400 mt-1">PRs Set</div>
            </div>
          </div>

          {frequencyData.length > 0 && (
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />Frequency This Week
              </h3>
              <div className="space-y-2">
                {frequencyData.map(item => (
                  <div key={item.muscle} className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">{item.muscle}</span>
                    <span className="text-sm font-semibold text-emerald-400">{item.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {setsData.length > 0 && (
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />Sets This Week
              </h3>
              <div className="space-y-2">
                {setsData.map(item => (
                  <div key={item.muscle} className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">{item.muscle}</span>
                    <span className="text-sm font-semibold text-emerald-400">{item.sets} sets</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentWorkouts.length > 0 && (
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />Recent Activity
              </h3>
              <div className="space-y-2">
                {recentWorkouts.map(workout => (
                  <div key={workout.id} className="bg-slate-800/50 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-emerald-400">{workout.templateName}</div>
                      <div className="text-xs text-gray-400">{formatDate(workout.date)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{workout.exercises.length} exercises</div>
                      <div className="text-xs text-gray-400">{formatDuration(workout.duration)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {workouts.length === 0 && (
            <div className="text-center py-12">
              <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-700" />
              <p className="text-gray-400 mb-2">No workouts yet</p>
              <p className="text-sm text-gray-500">Start your first workout to track your progress!</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
            <button onClick={() => setView('home')} className="flex flex-col items-center gap-1 text-emerald-400">
              <Dumbbell className="w-6 h-6" /><span className="text-xs font-medium">Home</span>
            </button>
            <button onClick={() => setView('history')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
              <History className="w-6 h-6" /><span className="text-xs">History</span>
            </button>
            <button onClick={() => setView('progress')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
              <TrendingUp className="w-6 h-6" /><span className="text-xs">Progress</span>
            </button>
            <button onClick={() => setView('prs')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
              <Trophy className="w-6 h-6" /><span className="text-xs">PRs</span>
            </button>
          </div>
        </div>

        {/* Template Selection Modal */}
        {showTemplateSelect && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
            <div className="bg-slate-900 rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-900 border-b border-gray-800 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Select Workout</h2>
                <button onClick={() => setShowTemplateSelect(false)}><X className="w-6 h-6" /></button>
              </div>
              <div className="p-4">
                <button onClick={() => { startWorkout(); setShowTemplateSelect(false); }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-medium mb-4">
                  Empty Workout (Build Your Own)
                </button>
                <div className="space-y-4">
                  {['PPL', 'Bro Split', 'Arnold Split', 'Full Body', 'Upper/Lower', 'Other'].map(category => {
                    const categoryTemplates = templates.filter(t => t.category === category);
                    if (categoryTemplates.length === 0) return null;
                    return (
                      <div key={category}>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">{category}</h3>
                        <div className="space-y-2">
                          {categoryTemplates.map(template => (
                            <button key={template.name} onClick={() => { startWorkout(template); setShowTemplateSelect(false); }}
                              className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-gray-700 p-3 rounded-xl text-left transition">
                              <div className="font-medium text-emerald-400">{template.name}</div>
                              <div className="text-xs text-gray-400 mt-1">{template.exercises.length} exercises</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cardio Log Modal */}
        {showCardioLog && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Log Cardio</h2>
                  <button onClick={() => setShowCardioLog(false)}><X className="w-6 h-6" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Type</label>
                    <select value={cardioType} onChange={(e) => setCardioType(e.target.value)}
                      className="w-full bg-slate-800 border border-gray-700 rounded-lg px-4 py-3">
                      {CARDIO_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Duration (minutes)</label>
                    <input type="number" value={cardioDuration} onChange={(e) => setCardioDuration(e.target.value)}
                      className="w-full bg-slate-800 border border-gray-700 rounded-lg px-4 py-3" placeholder="30" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Notes (optional)</label>
                    <textarea value={cardioNotes} onChange={(e) => setCardioNotes(e.target.value)}
                      className="w-full bg-slate-800 border border-gray-700 rounded-lg px-4 py-3" rows="3" placeholder="How did it go?" />
                  </div>
                  <button onClick={logCardio} disabled={!cardioType || !cardioDuration}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 py-3 rounded-xl font-medium">
                    Save Cardio Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goal Setting Modal */}
        {showGoalSetting && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Weekly Goal</h2>
                  <button onClick={() => setShowGoalSetting(false)}><X className="w-6 h-6" /></button>
                </div>
                <p className="text-sm text-gray-400 mb-4">How many workouts per week do you want to complete?</p>
                <div className="space-y-4">
                  <input type="number" value={weeklyGoal} onChange={(e) => setWeeklyGoal(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-800 border border-gray-700 rounded-lg px-4 py-3 text-2xl text-center font-bold" min="1" max="7" />
                  <div className="flex gap-2">
                    {[3, 4, 5, 6].map(num => (
                      <button key={num} onClick={() => setWeeklyGoal(num)}
                        className={`flex-1 py-2 rounded-lg ${weeklyGoal === num ? 'bg-emerald-600' : 'bg-slate-800'}`}>
                        {num}x
                      </button>
                    ))}
                  </div>
                  <button onClick={() => { saveGoal(weeklyGoal); setShowGoalSetting(false); }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-medium">
                    Save Goal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // WORKOUT VIEW
  if (view === 'workout' && activeWorkout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-20">
        {restTimerActive && (
          <div className="fixed top-20 left-0 right-0 z-50 mx-4">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-4 shadow-2xl border border-emerald-400">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium">Rest - {restTimerExercise}</div>
                <button onClick={() => setRestTimerActive(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="text-4xl font-bold text-center">{formatDuration(restTimer)}</div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setRestTimer(prev => prev + 15)} className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium">+15s</button>
                <button onClick={() => setRestTimer(prev => prev + 30)} className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium">+30s</button>
                <button onClick={() => setRestTimerActive(false)} className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium">Skip</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button onClick={cancelWorkout} className="text-red-400 hover:text-red-300"><X className="w-6 h-6" /></button>
              <div className="text-center">
                <h2 className="font-bold text-lg">{activeWorkout.templateName}</h2>
                <div className="text-sm text-emerald-400 font-semibold">{formatDuration(workoutDuration)}</div>
              </div>
              <button onClick={finishWorkout} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-medium">Finish</button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {activeWorkout.exercises.map((exercise) => {
            const previousWorkout = getPreviousWorkoutForExercise(exercise.name);
            return (
              <div key={exercise.id} className="bg-slate-900/50 border border-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-emerald-400">{exercise.name}</h3>
                      <button onClick={() => setShowExerciseInfo(exercise.name)} className="text-gray-400 hover:text-emerald-400">
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                    {previousWorkout && (
                      <div className="text-xs text-gray-400 mt-1">Last: {previousWorkout.weight} lbs × {previousWorkout.reps} reps</div>
                    )}
                  </div>
                  <button onClick={() => deleteExercise(exercise.id)} className="text-gray-400 hover:text-red-400">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={set.id} className={`flex items-center gap-2 p-2 rounded-lg ${
                      set.completed ? 'bg-emerald-900/30 border border-emerald-700/50' : 'bg-slate-800/50 border border-gray-700'
                    }`}>
                      <div className="text-sm font-medium text-gray-400 w-8">#{setIndex + 1}</div>
                      <input type="number" value={set.weight} onChange={(e) => updateSet(exercise.id, set.id, 'weight', e.target.value)}
                        placeholder="Weight" disabled={set.completed}
                        className="flex-1 bg-slate-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50 disabled:bg-slate-800/50" />
                      <span className="text-gray-400">×</span>
                      <input type="number" value={set.reps} onChange={(e) => updateSet(exercise.id, set.id, 'reps', e.target.value)}
                        placeholder="Reps" disabled={set.completed}
                        className="flex-1 bg-slate-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50 disabled:bg-slate-800/50" />
                      {!set.completed ? (
                        <>
                          <button onClick={() => completeSet(exercise.id, set.id)} disabled={!set.weight || !set.reps}
                            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed p-2 rounded-lg">
                            <Check className="w-5 h-5" />
                          </button>
                          <button onClick={() => deleteSet(exercise.id, set.id)} className="text-gray-400 hover:text-red-400 p-2">
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <div className="bg-emerald-600 p-2 rounded-lg"><Check className="w-5 h-5" /></div>
                      )}
                    </div>
                  ))}
                </div>

                <button onClick={() => addSetToExercise(exercise.id)}
                  className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-gray-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />Add Set
                </button>
              </div>
            );
          })}

          <button onClick={() => setShowExerciseSelect(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-medium flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />Add Exercise
          </button>
        </div>

        {/* Exercise Selection Modal */}
        {showExerciseSelect && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
            <div className="bg-slate-900 rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-900 border-b border-gray-800 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Add Exercise</h2>
                <button onClick={() => setShowExerciseSelect(false)}><X className="w-6 h-6" /></button>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <input type="text" value={customExerciseName} onChange={(e) => setCustomExerciseName(e.target.value)}
                    placeholder="Custom exercise name..." className="w-full bg-slate-800 border border-gray-700 rounded-lg px-4 py-3 mb-2" />
                  {customExerciseName && (
                    <div className="mb-2">
                      <label className="text-sm text-gray-400 block mb-2">Select muscle groups (can select multiple)</label>
                      <div className="flex flex-wrap gap-2">
                        {MUSCLE_GROUPS.map(muscle => (
                          <button key={muscle} onClick={() => {
                            if (customExerciseMuscles.includes(muscle)) {
                              setCustomExerciseMuscles(customExerciseMuscles.filter(m => m !== muscle));
                            } else {
                              setCustomExerciseMuscles([...customExerciseMuscles, muscle]);
                            }
                          }}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              customExerciseMuscles.includes(muscle) ? 'bg-emerald-600' : 'bg-slate-700'
                            }`}>
                            {muscle}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <button onClick={() => { if (customExerciseName.trim()) addExerciseToWorkout(customExerciseName.trim(), customExerciseMuscles); }}
                    disabled={!customExerciseName.trim()} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 py-2 rounded-lg font-medium">
                    Add Custom Exercise
                  </button>
                </div>

                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {['All', ...MUSCLE_GROUPS].map(muscle => (
                    <button key={muscle} onClick={() => setSelectedMuscleFilter(muscle)}
                      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                        selectedMuscleFilter === muscle ? 'bg-emerald-600' : 'bg-slate-800'
                      }`}>
                      {muscle}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {Object.keys(EXERCISE_DATABASE).filter(name => {
                    if (selectedMuscleFilter === 'All') return true;
                    const data = EXERCISE_DATABASE[name];
                    const muscles = Array.isArray(data.muscle) ? data.muscle : [data.muscle];
                    return muscles.includes(selectedMuscleFilter);
                  }).map(name => (
                    <button key={name} onClick={() => addExerciseToWorkout(name)}
                      className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-gray-700 p-3 rounded-xl text-left flex justify-between items-center">
                      <div>
                        <div className="font-medium">{name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {Array.isArray(EXERCISE_DATABASE[name].muscle) ? EXERCISE_DATABASE[name].muscle.join(', ') : EXERCISE_DATABASE[name].muscle}
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setShowExerciseInfo(name); }} className="text-gray-400 hover:text-emerald-400 p-2">
                        <Info className="w-5 h-5" />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercise Info Modal */}
        {showExerciseInfo && EXERCISE_DATABASE[showExerciseInfo] && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-emerald-400">{showExerciseInfo}</h2>
                  <button onClick={() => setShowExerciseInfo(null)}><X className="w-6 h-6" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Muscle Groups</div>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(EXERCISE_DATABASE[showExerciseInfo].muscle) 
                        ? EXERCISE_DATABASE[showExerciseInfo].muscle 
                        : [EXERCISE_DATABASE[showExerciseInfo].muscle]).map(muscle => (
                        <span key={muscle} className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-lg text-sm">{muscle}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Type</div>
                    <span className={`px-3 py-1 rounded-lg text-sm ${
                      EXERCISE_DATABASE[showExerciseInfo].compound ? 'bg-blue-600/20 text-blue-400' : 'bg-purple-600/20 text-purple-400'
                    }`}>
                      {EXERCISE_DATABASE[showExerciseInfo].compound ? 'Compound' : 'Isolation'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Proper Form</div>
                    <p className="text-sm text-gray-300 leading-relaxed">{EXERCISE_DATABASE[showExerciseInfo].form}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // HISTORY VIEW
  if (view === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-20">
        <div className="bg-slate-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Workout History</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {workouts.length > 0 ? (
            <div className="space-y-3">
              {workouts.map(workout => (
                <div key={workout.id} className="bg-slate-900/50 border border-gray-800 rounded-xl overflow-hidden">
                  <button onClick={() => setExpandedWorkout(expandedWorkout === workout.id ? null : workout.id)}
                    className="w-full p-4 flex justify-between items-center hover:bg-slate-800/30">
                    <div className="text-left">
                      <h3 className="font-semibold text-lg text-emerald-400">{workout.templateName}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-400">{formatDate(workout.date)}</p>
                        <p className="text-xs text-gray-500">{formatDuration(workout.duration)}</p>
                        <p className="text-xs text-emerald-400">{workout.exercises.length} exercises</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); deleteWorkout(workout.id); }}
                        className="text-gray-400 hover:text-red-400 p-2">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {expandedWorkout === workout.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </button>

                  {expandedWorkout === workout.id && (
                    <div className="px-4 pb-4 space-y-2 border-t border-gray-800 pt-3">
                      {workout.exercises.map(ex => (
                        <div key={ex.id} className="bg-slate-800/50 rounded-lg p-3">
                          <div className="font-medium text-emerald-400 mb-2">{ex.name}</div>
                          <div className="space-y-1">
                            {ex.sets.filter(s => s.completed).map((set, idx) => (
                              <div key={idx} className="text-sm text-gray-300">Set {idx + 1}: {set.weight} lbs × {set.reps} reps</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <History className="w-16 h-16 mx-auto mb-4 text-gray-700" />
              <p className="text-gray-400">No workout history yet</p>
            </div>
          )}

          {cardioSessions.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />Cardio Sessions
              </h2>
              <div className="space-y-2">
                {cardioSessions.map(session => (
                  <div key={session.id} className="bg-slate-900/50 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-red-400">{session.type}</div>
                      <div className="text-sm text-gray-400">{formatDate(session.date)}</div>
                      {session.notes && <div className="text-xs text-gray-500 mt-1">{session.notes}</div>}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-semibold">{session.duration}</div>
                        <div className="text-xs text-gray-400">minutes</div>
                      </div>
                      <button onClick={() => deleteCardioSession(session.id)} className="text-gray-400 hover:text-red-400">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
            <button onClick={() => setView('home')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
              <Dumbbell className="w-6 h-6" /><span className="text-xs">Home</span>
            </button>
            <button onClick={() => setView('history')} className="flex flex-col items-center gap-1 text-emerald-400">
              <History className="w-6 h-6" /><span className="text-xs font-medium">History</span>
            </button>
            <button onClick={() => setView('progress')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
              <TrendingUp className="w-6 h-6" /><span className="text-xs">Progress</span>
            </button>
            <button onClick={() => setView('prs')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
              <Trophy className="w-6 h-6" /><span className="text-xs">PRs</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PROGRESS VIEW
  if (view === 'progress') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-20">
        <div className="bg-slate-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Progress</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4 mb-6">
            <h3 className="font-semibold mb-3">Muscle Group Frequency</h3>
            <p className="text-sm text-gray-400 mb-4">Track how often you train each muscle group per week</p>
            {getFrequencyByMuscle().length > 0 ? (
              <div className="space-y-3">
                {getFrequencyByMuscle().map(item => (
                  <div key={item.muscle} className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-300">{item.muscle}</div>
                    <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"
                        style={{ width: `${(item.count / Math.max(...getFrequencyByMuscle().map(d => d.count))) * 100}%` }} />
                    </div>
                    <div className="w-12 text-right text-emerald-400 font-semibold">{item.count}x</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No workout data yet</p>
            )}
          </div>

          <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Sets Per Muscle Group (This Week)</h3>
            {getSetsPerMuscle().length > 0 ? (
              <div className="space-y-2">
                {getSetsPerMuscle().map(item => (
                  <div key={item.muscle} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <span className="font-medium">{item.muscle}</span>
                    <span className="text-emerald-400 font-semibold">{item.sets} sets</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No workout data yet</p>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
            <button onClick={() => setView('home')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
              <Dumbbell className="w-6 h-6" /><span className="text-xs">Home</span>
            </button>
            <button onClick={() => setView('history')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
              <History className="w-6 h-6" /><span className="text-xs">History</span>
            </button>
            <button onClick={() => setView('progress')} className="flex flex-col items-center gap-1 text-emerald-400">
              <TrendingUp className="w-6 h-6" /><span className="text-xs font-medium">Progress</span>
            </button>
            <button onClick={() => setView('prs')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
              <Trophy className="w-6 h-6" /><span className="text-xs">PRs</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PRS VIEW (Hall of Pain)
  if (view === 'prs') {
    const prs = getAllPRs();
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-20">
        <div className="bg-slate-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Flame className="w-7 h-7 text-orange-500" />Hall of Pain
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {prs.length > 0 ? (
            <div className="space-y-3">
              {prs.map((pr, index) => (
                <div key={pr.exercise} className="bg-slate-900/50 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      {index < 3 && <Trophy className="w-5 h-5 text-yellow-500" />}
                      <h3 className="font-semibold text-lg text-emerald-400">{pr.exercise}</h3>
                    </div>
                    <div className="text-sm text-gray-300 mt-1">{pr.weight} lbs × {pr.reps} reps</div>
                    <div className="text-xs text-gray-500 mt-1">{formatDate(pr.date)} • {pr.muscle}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">{pr.est1RM}</div>
                    <div className="text-xs text-gray-400">Est. 1RM</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-700" />
              <p className="text-gray-400">No PRs yet</p>
              <p className="text-sm text-gray-500 mt-2">Start working out to set your first records!</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
            <button onClick={() => setView('home')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
              <Dumbbell className="w-6 h-6" /><span className="text-xs">Home</span>
            </button>
            <button onClick={() => setView('history')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
              <History className="w-6 h-6" /><span className="text-xs">History</span>
            </button>
            <button onClick={() => setView('progress')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
              <TrendingUp className="w-6 h-6" /><span className="text-xs">Progress</span>
            </button>
            <button onClick={() => setView('prs')} className="flex flex-col items-center gap-1 text-emerald-400">
              <Trophy className="w-6 h-6" /><span className="text-xs font-medium">PRs</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
