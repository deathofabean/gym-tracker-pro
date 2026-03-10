import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Plus, History, TrendingUp, X, Check, Trophy, ChevronDown, ChevronRight, Trash2, Target, Zap, Heart, Info, BarChart3, Flame } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// EXERCISE DATABASE with Form Instructions and GIF URLs
const EXERCISE_DATABASE = {
  // === CHEST ===
  'Bench Press': { 
    muscle: ['Chest', 'Shoulders', 'Arms'], 
    compound: true,
    form: 'Lie flat, feet planted. Grip bar slightly wider than shoulders. Lower to mid-chest, elbows at 45°. Press up explosively.',
    gifUrl: 'https://media.giphy.com/media/fV0oSDsZ4UgdW/giphy.gif'
  },
  'Incline Bench Press': { 
    muscle: ['Chest', 'Shoulders'], 
    compound: true,
    form: 'Set bench 30-45°. Lower to upper chest. Targets upper chest. Keep lower back against bench.',
    gifUrl: 'https://media.giphy.com/media/fV0oSDsZ4UgdW/giphy.gif'
  },
  'Dumbbell Press': { 
    muscle: ['Chest', 'Shoulders'], 
    compound: true,
    form: 'Lie flat, dumbbells at chest. Press up and slightly together. Greater range than barbell.',
    gifUrl: 'https://media.giphy.com/media/fV0oSDsZ4UgdW/giphy.gif'
  },
  'Push-ups': { 
    muscle: ['Chest', 'Shoulders', 'Arms', 'Core'], 
    compound: true,
    form: 'Hands shoulder-width, body straight. Lower to ground, elbows 45°. Push up. Core tight.',
    gifUrl: 'https://media.giphy.com/media/ZxrJjHJBRObtKP8tKc/giphy.gif'
  },
  'Dumbbell Flyes': { 
    muscle: ['Chest'], 
    compound: false,
    form: 'Lie flat, arms in wide arc with slight elbow bend. Deep stretch at bottom, squeeze at top.',
    gifUrl: 'https://media.giphy.com/media/fV0oSDsZ4UgdW/giphy.gif'
  },
  
  // === BACK ===
  'Deadlift': { 
    muscle: ['Back', 'Legs', 'Core'], 
    compound: true,
    form: 'Feet hip-width, bar over mid-foot. Neutral spine, chest up. Drive through heels. The king of exercises.',
    gifUrl: 'https://media.giphy.com/media/uA8WItRYSRkfm/giphy.gif'
  },
  'Pull-ups': { 
    muscle: ['Back', 'Arms'], 
    compound: true,
    form: 'Overhand grip. Pull chest to bar, squeeze shoulder blades. Lower with control. Full range.',
    gifUrl: 'https://media.giphy.com/media/QyhZZZXiXeCPu/giphy.gif'
  },
  'Barbell Row': { 
    muscle: ['Back', 'Arms'], 
    compound: true,
    form: 'Bend 45°, slight knee bend. Pull bar to lower chest. Elbows tight. Squeeze shoulder blades.',
    gifUrl: 'https://media.giphy.com/media/uA8WItRYSRkfm/giphy.gif'
  },
  'Lat Pulldown': { 
    muscle: ['Back', 'Arms'], 
    compound: true,
    form: 'Pull bar to upper chest. Slight lean back. Squeeze lats at bottom.',
    gifUrl: 'https://media.giphy.com/media/QyhZZZXiXeCPu/giphy.gif'
  },
  'Romanian Deadlift': { 
    muscle: ['Back', 'Legs'], 
    compound: true,
    form: 'Slight knee bend. Hinge at hips, lower bar down legs. Feel hamstring stretch. Back straight.',
    gifUrl: 'https://media.giphy.com/media/uA8WItRYSRkfm/giphy.gif'
  },
  
  // === LEGS ===
  'Squat': { 
    muscle: ['Legs', 'Core'], 
    compound: true,
    form: 'Bar on upper back. Feet shoulder-width. Squat to parallel or below. Drive through heels.',
    gifUrl: 'https://media.giphy.com/media/brqkBQV1qAFrO/giphy.gif'
  },
  'Leg Press': { 
    muscle: ['Legs'], 
    compound: true,
    form: 'Seated, push platform up. Don\'t lock knees fully. Can safely go heavy.',
    gifUrl: 'https://media.giphy.com/media/brqkBQV1qAFrO/giphy.gif'
  },
  'Leg Extension': { 
    muscle: ['Legs'], 
    compound: false,
    form: 'Seated, extend legs. Squeeze quads at full extension. Pure quad isolation.',
    gifUrl: 'https://media.giphy.com/media/brqkBQV1qAFrO/giphy.gif'
  },
  'Leg Curls': { 
    muscle: ['Legs'], 
    compound: false,
    form: 'Lying or seated. Curl legs, contract hamstrings. Squeeze at peak.',
    gifUrl: 'https://media.giphy.com/media/brqkBQV1qAFrO/giphy.gif'
  },
  'Calf Raises': { 
    muscle: ['Legs'], 
    compound: false,
    form: 'Stand on elevated surface. Rise on toes, hold squeeze. Lower below start for stretch.',
    gifUrl: 'https://media.giphy.com/media/brqkBQV1qAFrO/giphy.gif'
  },
  
  // === SHOULDERS ===
  'Overhead Press': { 
    muscle: ['Shoulders', 'Arms'], 
    compound: true,
    form: 'Bar at shoulders. Press straight up, lock elbows. Core tight. Best shoulder builder.',
    gifUrl: 'https://media.giphy.com/media/aYKmyIbjnasko/giphy.gif'
  },
  'Lateral Raises': { 
    muscle: ['Shoulders'], 
    compound: false,
    form: 'Raise arms to sides to shoulder height. Slight elbow bend. Lead with elbows.',
    gifUrl: 'https://media.giphy.com/media/aYKmyIbjnasko/giphy.gif'
  },
  'Arnold Press': { 
    muscle: ['Shoulders'], 
    compound: true,
    form: 'Start palms facing you. Press up while rotating palms out. All three delt heads worked.',
    gifUrl: 'https://media.giphy.com/media/aYKmyIbjnasko/giphy.gif'
  },
  'Shrugs': { 
    muscle: ['Shoulders'], 
    compound: false,
    form: 'Shrug shoulders straight up. Squeeze at top. Targets traps.',
    gifUrl: 'https://media.giphy.com/media/aYKmyIbjnasko/giphy.gif'
  },
  
  // === ARMS ===
  'Barbell Curl': { 
    muscle: ['Arms'], 
    compound: false,
    form: 'Standing, bar at thighs. Curl to shoulders, elbows stationary. Squeeze at top.',
    gifUrl: 'https://media.giphy.com/media/xUA7b7v2bYztSJBvGg/giphy.gif'
  },
  'Hammer Curl': { 
    muscle: ['Arms'], 
    compound: false,
    form: 'Neutral grip throughout. Targets brachialis and forearms. Builds arm thickness.',
    gifUrl: 'https://media.giphy.com/media/xUA7b7v2bYztSJBvGg/giphy.gif'
  },
  'Tricep Pushdowns': { 
    muscle: ['Arms'], 
    compound: false,
    form: 'High cable. Push down fully, squeeze at bottom. Elbows at sides.',
    gifUrl: 'https://media.giphy.com/media/xUA7b7v2bYztSJBvGg/giphy.gif'
  },
  'Skull Crushers': { 
    muscle: ['Arms'], 
    compound: false,
    form: 'Lie flat, lower bar to forehead. Extend back up. Keep upper arms stationary.',
    gifUrl: 'https://media.giphy.com/media/xUA7b7v2bYztSJBvGg/giphy.gif'
  },
  'Bicep Curls': { 
    muscle: ['Arms'], 
    compound: false,
    form: 'Curl weight to shoulders. Keep elbows locked. Full range of motion.',
    gifUrl: 'https://media.giphy.com/media/xUA7b7v2bYztSJBvGg/giphy.gif'
  },
  
  // === CORE ===
  'Plank': { 
    muscle: ['Core'], 
    compound: false,
    form: 'Forearms down, body straight. Hold without sagging hips. Squeeze glutes and abs.',
    gifUrl: 'https://media.giphy.com/media/gJWJP4U0QL7a0/giphy.gif'
  },
  'Crunches': { 
    muscle: ['Core'], 
    compound: false,
    form: 'Lie on back, knees bent. Lift shoulder blades off ground. Squeeze abs.',
    gifUrl: 'https://media.giphy.com/media/gJWJP4U0QL7a0/giphy.gif'
  },
  'Russian Twists': { 
    muscle: ['Core'], 
    compound: false,
    form: 'Seated, lean back 45°. Hold weight. Rotate side to side. Targets obliques.',
    gifUrl: 'https://media.giphy.com/media/gJWJP4U0QL7a0/giphy.gif'
  },
  'Hanging Leg Raises': { 
    muscle: ['Core'], 
    compound: false,
    form: 'Hang from bar. Raise legs to 90°+. Control descent. Don\'t swing.',
    gifUrl: 'https://media.giphy.com/media/gJWJP4U0QL7a0/giphy.gif'
  },
};

const DEFAULT_TEMPLATES = {
  push: { name: 'Push Day', category: 'PPL', exercises: ['Bench Press', 'Overhead Press', 'Lateral Raises', 'Tricep Pushdowns'] },
  pull: { name: 'Pull Day', category: 'PPL', exercises: ['Deadlift', 'Pull-ups', 'Barbell Row', 'Lat Pulldown', 'Barbell Curl'] },
  legs: { name: 'Leg Day', category: 'PPL', exercises: ['Squat', 'Romanian Deadlift', 'Leg Press', 'Leg Curls', 'Calf Raises'] },
  chest: { name: 'Chest', category: 'Bro Split', exercises: ['Bench Press', 'Dumbbell Press', 'Dumbbell Flyes', 'Push-ups'] },
  back: { name: 'Back', category: 'Bro Split', exercises: ['Deadlift', 'Pull-ups', 'Barbell Row', 'Lat Pulldown'] },
  arms: { name: 'Arms', category: 'Bro Split', exercises: ['Barbell Curl', 'Hammer Curl', 'Tricep Pushdowns', 'Skull Crushers'] },
  core: { name: 'Core', category: 'Other', exercises: ['Plank', 'Crunches', 'Russian Twists', 'Hanging Leg Raises'] }
};

const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
const CARDIO_TYPES = ['Running', 'Cycling', 'Swimming', 'Rowing', 'Elliptical', 'HIIT', 'Walking'];

// RIPPED CHICKEN LOGO SVG
const RippedChickenLogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="23" fill="#10b981" stroke="#059669" strokeWidth="2"/>
    <path d="M24 10C19 10 16 13 16 17C16 19 17 20 18 21C18 21 18 22 19 23C19 23 18 26 18 28C18 32 20 36 24 36C28 36 30 32 30 28C30 26 29 23 29 23C30 22 30 21 30 21C31 20 32 19 32 17C32 13 29 10 24 10Z" fill="#fbbf24"/>
    <circle cx="21" cy="18" r="2" fill="#000"/>
    <circle cx="27" cy="18" r="2" fill="#000"/>
    <path d="M24 22L24 24" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 28C20 28 22 30 24 30C26 30 28 28 28 28" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 24C16 24 15 26 15 27L16 28C17 28 18 27 18 26Z" fill="#ef4444"/>
    <path d="M30 24C32 24 33 26 33 27L32 28C31 28 30 27 30 26Z" fill="#ef4444"/>
    <ellipse cx="20" cy="26" rx="3" ry="4" fill="#374151" opacity="0.3"/>
    <ellipse cx="28" cy="26" rx="3" ry="4" fill="#374151" opacity="0.3"/>
  </svg>
);

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
  
  const [expandedWorkout, setExpandedWorkout] = useState(null);

  // FIXED: Using localStorage instead of window.storage
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

  const loadData = () => {
    try {
      const workoutsData = localStorage.getItem('prer-workouts-v3');
      const cardioData = localStorage.getItem('prer-cardio-v3');
      const goalData = localStorage.getItem('prer-weekly-goal');
      
      if (workoutsData) setWorkouts(JSON.parse(workoutsData));
      if (cardioData) setCardioSessions(JSON.parse(cardioData));
      if (goalData) setWeeklyGoal(parseInt(goalData));
      
      const defaultTemplatesList = Object.values(DEFAULT_TEMPLATES);
      setTemplates(defaultTemplatesList);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const saveWorkouts = (updated) => {
    try {
      localStorage.setItem('prer-workouts-v3', JSON.stringify(updated));
      console.log('Workouts saved successfully');
    } catch (e) { console.error('Save error:', e); }
  };

  const saveCardio = (updated) => {
    try { localStorage.setItem('prer-cardio-v3', JSON.stringify(updated)); }
    catch (e) { console.error(e); }
  };

  const saveGoal = (goal) => {
    try { localStorage.setItem('prer-weekly-goal', goal.toString()); }
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
      EXERCISE_DATABASE[exerciseName] = { muscle: muscles, compound: false, form: 'Custom exercise', gifUrl: '' };
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
    if (confirm('Delete this workout?')) {
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
    if (confirm('Cancel workout?')) {
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
    if (confirm('Delete cardio?')) {
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
    const workoutsThisWeek = getWorkoutsThisWeek();
    const cardioThisWeek = getCardioThisWeek();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-20">
        <div className="bg-slate-900/95 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RippedChickenLogo />
                <div>
                  <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 bg-clip-text text-transparent" 
                      style={{ fontFamily: 'Impact, "Arial Black", sans-serif', letterSpacing: '0.05em' }}>
                    PR OR ER
                  </h1>
                </div>
              </div>
              <button onClick={() => setShowGoalSetting(true)} className="p-2 hover:bg-slate-800 rounded-lg">
                <Target className="w-5 h-5 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          <button onClick={() => setShowTemplateSelect(true)}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2">
            <Dumbbell className="w-5 h-5" />Start Workout
          </button>

          <button onClick={() => setShowCardioLog(true)}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-emerald-600/30 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-emerald-400" />Log Cardio
          </button>

          <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm">Weekly Progress</h3>
              <span className="text-xs text-gray-400">Goal: {weeklyGoal}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full ${workoutsThisWeek >= weeklyGoal ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min((workoutsThisWeek / weeklyGoal) * 100, 100)}%` }} />
              </div>
              <span className="text-xl font-bold text-emerald-400">{workoutsThisWeek}/{weeklyGoal}</span>
            </div>
            {cardioThisWeek > 0 && (
              <div className="text-xs text-gray-400"><Heart className="w-3 h-3 inline mr-1 text-red-400" />{cardioThisWeek} cardio this week</div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-3">
              <div className="text-xl font-bold text-emerald-400">{workouts.length}</div>
              <div className="text-xs text-gray-400">Workouts</div>
            </div>
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-3">
              <div className="text-xl font-bold text-emerald-400">{getAllPRs().length}</div>
              <div className="text-xs text-gray-400">PRs</div>
            </div>
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-3">
              <div className="text-xl font-bold text-emerald-400">{cardioSessions.length}</div>
              <div className="text-xs text-gray-400">Cardio</div>
            </div>
          </div>

          {recentWorkouts.length > 0 && (
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4">
              <h3 className="font-semibold mb-3 text-sm">Recent</h3>
              <div className="space-y-2">
                {recentWorkouts.map(workout => (
                  <div key={workout.id} className="bg-slate-800/50 rounded-lg p-2.5 flex justify-between items-center text-sm">
                    <div>
                      <div className="font-medium text-emerald-400">{workout.templateName}</div>
                      <div className="text-xs text-gray-400">{formatDate(workout.date)}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-semibold">{workout.exercises.length} exercises</div>
                      <div className="text-gray-400">{formatDuration(workout.duration)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {workouts.length === 0 && (
            <div className="text-center py-8">
              <Dumbbell className="w-12 h-12 mx-auto mb-3 text-gray-700" />
              <p className="text-gray-400 text-sm">No workouts yet</p>
              <p className="text-xs text-gray-500 mt-1">Start your first workout!</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/98 backdrop-blur-lg border-t border-gray-800 safe-bottom">
          <div className="px-4 py-2 flex justify-around">
            <button onClick={() => setView('home')} className="flex flex-col items-center gap-0.5 text-emerald-400 py-2">
              <Dumbbell className="w-5 h-5" /><span className="text-xs font-medium">Home</span>
            </button>
            <button onClick={() => setView('history')} className="flex flex-col items-center gap-0.5 text-gray-400 py-2">
              <History className="w-5 h-5" /><span className="text-xs">History</span>
            </button>
            <button onClick={() => setView('prs')} className="flex flex-col items-center gap-0.5 text-gray-400 py-2">
              <Trophy className="w-5 h-5" /><span className="text-xs">PRs</span>
            </button>
          </div>
        </div>

        {/* MODALS */}
        {showTemplateSelect && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
            <div className="bg-slate-900 rounded-t-2xl w-full max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-900 border-b border-gray-800 p-4 flex justify-between items-center">
                <h2 className="text-lg font-bold">Select Workout</h2>
                <button onClick={() => setShowTemplateSelect(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-3">
                <button onClick={() => { startWorkout(); setShowTemplateSelect(false); }}
                  className="w-full bg-emerald-600 py-3 rounded-xl font-medium">
                  Empty Workout
                </button>
                {['PPL', 'Bro Split', 'Other'].map(category => {
                  const categoryTemplates = templates.filter(t => t.category === category);
                  if (categoryTemplates.length === 0) return null;
                  return (
                    <div key={category}>
                      <h3 className="text-xs font-semibold text-gray-400 mb-2">{category}</h3>
                      <div className="space-y-2">
                        {categoryTemplates.map(template => (
                          <button key={template.name} onClick={() => { startWorkout(template); setShowTemplateSelect(false); }}
                            className="w-full bg-slate-800/50 border border-gray-700 p-3 rounded-xl text-left">
                            <div className="font-medium text-emerald-400 text-sm">{template.name}</div>
                            <div className="text-xs text-gray-400">{template.exercises.length} exercises</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {showCardioLog && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl w-full max-w-sm">
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Log Cardio</h2>
                  <button onClick={() => setShowCardioLog(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-3">
                  <select value={cardioType} onChange={(e) => setCardioType(e.target.value)}
                    className="w-full bg-slate-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm">
                    {CARDIO_TYPES.map(type => <option key={type}>{type}</option>)}
                  </select>
                  <input type="number" value={cardioDuration} onChange={(e) => setCardioDuration(e.target.value)}
                    className="w-full bg-slate-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm" placeholder="Minutes" />
                  <textarea value={cardioNotes} onChange={(e) => setCardioNotes(e.target.value)}
                    className="w-full bg-slate-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm" rows="2" placeholder="Notes" />
                  <button onClick={logCardio} disabled={!cardioType || !cardioDuration}
                    className="w-full bg-emerald-600 disabled:bg-gray-700 py-2.5 rounded-xl font-medium text-sm">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showGoalSetting && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl w-full max-w-sm">
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Weekly Goal</h2>
                  <button onClick={() => setShowGoalSetting(false)}><X className="w-5 h-5" /></button>
                </div>
                <p className="text-xs text-gray-400 mb-4">Workouts per week?</p>
                <input type="number" value={weeklyGoal} onChange={(e) => setWeeklyGoal(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-800 border border-gray-700 rounded-lg px-4 py-3 text-xl text-center font-bold mb-3" min="1" max="7" />
                <div className="flex gap-2 mb-4">
                  {[3, 4, 5, 6].map(num => (
                    <button key={num} onClick={() => setWeeklyGoal(num)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium ${weeklyGoal === num ? 'bg-emerald-600' : 'bg-slate-800'}`}>
                      {num}x
                    </button>
                  ))}
                </div>
                <button onClick={() => { saveGoal(weeklyGoal); setShowGoalSetting(false); }}
                  className="w-full bg-emerald-600 py-2.5 rounded-xl font-medium text-sm">
                  Save
                </button>
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
          <div className="fixed top-16 left-0 right-0 z-50 px-4">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-3 shadow-2xl">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs font-medium">Rest - {restTimerExercise}</div>
                <button onClick={() => setRestTimerActive(false)}><X className="w-4 h-4" /></button>
              </div>
              <div className="text-3xl font-bold text-center">{formatDuration(restTimer)}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => setRestTimer(prev => prev + 15)} className="flex-1 bg-white/20 py-1.5 rounded-lg text-xs">+15s</button>
                <button onClick={() => setRestTimer(prev => prev + 30)} className="flex-1 bg-white/20 py-1.5 rounded-lg text-xs">+30s</button>
                <button onClick={() => setRestTimerActive(false)} className="flex-1 bg-white/20 py-1.5 rounded-lg text-xs">Skip</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-900/95 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={cancelWorkout} className="text-red-400"><X className="w-5 h-5" /></button>
            <div className="text-center">
              <h2 className="font-bold text-sm">{activeWorkout.templateName}</h2>
              <div className="text-xs text-emerald-400 font-semibold">{formatDuration(workoutDuration)}</div>
            </div>
            <button onClick={finishWorkout} className="bg-emerald-600 px-3 py-1.5 rounded-lg text-sm font-medium">Finish</button>
          </div>
        </div>

        <div className="px-4 py-4 space-y-3">
          {activeWorkout.exercises.map((exercise) => {
            const previousWorkout = getPreviousWorkoutForExercise(exercise.name);
            return (
              <div key={exercise.id} className="bg-slate-900/50 border border-gray-800 rounded-xl p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-emerald-400 text-sm">{exercise.name}</h3>
                      <button onClick={() => setShowExerciseInfo(exercise.name)} className="text-gray-400">
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {previousWorkout && (
                      <div className="text-xs text-gray-400 mt-0.5">Last: {previousWorkout.weight} × {previousWorkout.reps}</div>
                    )}
                  </div>
                  <button onClick={() => deleteExercise(exercise.id)} className="text-gray-400 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 mb-2">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={set.id} className={`flex items-center gap-1.5 p-2 rounded-lg ${
                      set.completed ? 'bg-emerald-900/30 border border-emerald-700/50' : 'bg-slate-800/50 border border-gray-700'
                    }`}>
                      <div className="text-xs font-medium text-gray-400 w-6">#{setIndex + 1}</div>
                      <input type="number" inputMode="decimal" value={set.weight} onChange={(e) => updateSet(exercise.id, set.id, 'weight', e.target.value)}
                        placeholder="lbs" disabled={set.completed}
                        className="flex-1 bg-slate-700/50 border-0 rounded px-2 py-1.5 text-sm text-white disabled:opacity-50" />
                      <span className="text-gray-400 text-xs">×</span>
                      <input type="number" inputMode="numeric" value={set.reps} onChange={(e) => updateSet(exercise.id, set.id, 'reps', e.target.value)}
                        placeholder="reps" disabled={set.completed}
                        className="flex-1 bg-slate-700/50 border-0 rounded px-2 py-1.5 text-sm text-white disabled:opacity-50" />
                      {!set.completed ? (
                        <>
                          <button onClick={() => completeSet(exercise.id, set.id)} disabled={!set.weight || !set.reps}
                            className="bg-emerald-600 disabled:bg-gray-700 p-1.5 rounded">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteSet(exercise.id, set.id)} className="text-gray-400 p-1.5">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="bg-emerald-600 p-1.5 rounded"><Check className="w-4 h-4" /></div>
                      )}
                    </div>
                  ))}
                </div>

                <button onClick={() => addSetToExercise(exercise.id)}
                  className="w-full bg-slate-800/50 border border-gray-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                  <Plus className="w-3.5 h-3.5" />Add Set
                </button>
              </div>
            );
          })}

          <button onClick={() => setShowExerciseSelect(true)}
            className="w-full bg-emerald-600 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />Add Exercise
          </button>
        </div>

        {/* Exercise Selection Modal */}
        {showExerciseSelect && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
            <div className="bg-slate-900 rounded-t-2xl w-full max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-900 border-b border-gray-800 p-4 flex justify-between items-center">
                <h2 className="text-lg font-bold">Add Exercise</h2>
                <button onClick={() => setShowExerciseSelect(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <input type="text" value={customExerciseName} onChange={(e) => setCustomExerciseName(e.target.value)}
                    placeholder="Custom exercise..." className="w-full bg-slate-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm mb-2" />
                  {customExerciseName && (
                    <div className="mb-2">
                      <label className="text-xs text-gray-400 block mb-2">Muscle groups</label>
                      <div className="flex flex-wrap gap-1.5">
                        {MUSCLE_GROUPS.map(muscle => (
                          <button key={muscle} onClick={() => {
                            if (customExerciseMuscles.includes(muscle)) {
                              setCustomExerciseMuscles(customExerciseMuscles.filter(m => m !== muscle));
                            } else {
                              setCustomExerciseMuscles([...customExerciseMuscles, muscle]);
                            }
                          }}
                            className={`px-2.5 py-1 rounded-lg text-xs ${customExerciseMuscles.includes(muscle) ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                            {muscle}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <button onClick={() => { if (customExerciseName.trim()) addExerciseToWorkout(customExerciseName.trim(), customExerciseMuscles); }}
                    disabled={!customExerciseName.trim()} className="w-full bg-emerald-600 disabled:bg-gray-700 py-2 rounded-lg text-sm font-medium">
                    Add Custom
                  </button>
                </div>

                <div className="flex gap-1.5 mb-3 overflow-x-auto pb-2">
                  {['All', ...MUSCLE_GROUPS].map(muscle => (
                    <button key={muscle} onClick={() => setSelectedMuscleFilter(muscle)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
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
                      className="w-full bg-slate-800/50 border border-gray-700 p-3 rounded-xl text-left flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">{name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {Array.isArray(EXERCISE_DATABASE[name].muscle) ? EXERCISE_DATABASE[name].muscle.join(', ') : EXERCISE_DATABASE[name].muscle}
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setShowExerciseInfo(name); }} className="text-gray-400 p-1">
                        <Info className="w-4 h-4" />
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
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-bold text-emerald-400">{showExerciseInfo}</h2>
                  <button onClick={() => setShowExerciseInfo(null)}><X className="w-5 h-5" /></button>
                </div>
                
                {EXERCISE_DATABASE[showExerciseInfo].gifUrl && (
                  <div className="mb-4 bg-slate-800 rounded-xl overflow-hidden">
                    <img src={EXERCISE_DATABASE[showExerciseInfo].gifUrl} alt={showExerciseInfo} 
                      className="w-full h-48 object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Muscles</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(EXERCISE_DATABASE[showExerciseInfo].muscle) 
                        ? EXERCISE_DATABASE[showExerciseInfo].muscle 
                        : [EXERCISE_DATABASE[showExerciseInfo].muscle]).map(muscle => (
                        <span key={muscle} className="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 rounded text-xs">{muscle}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Form</div>
                    <p className="text-xs text-gray-300 leading-relaxed">{EXERCISE_DATABASE[showExerciseInfo].form}</p>
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
        <div className="bg-slate-900/95 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
          <div className="px-4 py-3"><h1 className="text-xl font-bold">History</h1></div>
        </div>

        <div className="px-4 py-4">
          {workouts.length > 0 ? (
            <div className="space-y-2">
              {workouts.map(workout => (
                <div key={workout.id} className="bg-slate-900/50 border border-gray-800 rounded-xl overflow-hidden">
                  <button onClick={() => setExpandedWorkout(expandedWorkout === workout.id ? null : workout.id)}
                    className="w-full p-3 flex justify-between items-center">
                    <div className="text-left flex-1">
                      <h3 className="font-semibold text-emerald-400 text-sm">{workout.templateName}</h3>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                        <span>{formatDate(workout.date)}</span>
                        <span>{formatDuration(workout.duration)}</span>
                        <span className="text-emerald-400">{workout.exercises.length} ex</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); deleteWorkout(workout.id); }}
                        className="text-gray-400 p-1"><Trash2 className="w-4 h-4" /></button>
                      {expandedWorkout === workout.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>

                  {expandedWorkout === workout.id && (
                    <div className="px-3 pb-3 space-y-1.5 border-t border-gray-800 pt-2">
                      {workout.exercises.map(ex => (
                        <div key={ex.id} className="bg-slate-800/50 rounded-lg p-2">
                          <div className="font-medium text-emerald-400 text-xs mb-1">{ex.name}</div>
                          <div className="space-y-0.5">
                            {ex.sets.filter(s => s.completed).map((set, idx) => (
                              <div key={idx} className="text-xs text-gray-300">Set {idx + 1}: {set.weight} × {set.reps}</div>
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
            <div className="text-center py-8">
              <History className="w-12 h-12 mx-auto mb-3 text-gray-700" />
              <p className="text-gray-400 text-sm">No history yet</p>
            </div>
          )}

          {cardioSessions.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold mb-2">Cardio</h2>
              <div className="space-y-2">
                {cardioSessions.map(session => (
                  <div key={session.id} className="bg-slate-900/50 border border-gray-800 rounded-xl p-3 flex justify-between items-center">
                    <div className="flex-1">
                      <div className="font-medium text-red-400 text-sm">{session.type}</div>
                      <div className="text-xs text-gray-400">{formatDate(session.date)}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold text-sm">{session.duration}min</div>
                      </div>
                      <button onClick={() => deleteCardioSession(session.id)} className="text-gray-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/98 backdrop-blur-lg border-t border-gray-800">
          <div className="px-4 py-2 flex justify-around">
            <button onClick={() => setView('home')} className="flex flex-col items-center gap-0.5 text-gray-400 py-2">
              <Dumbbell className="w-5 h-5" /><span className="text-xs">Home</span>
            </button>
            <button onClick={() => setView('history')} className="flex flex-col items-center gap-0.5 text-emerald-400 py-2">
              <History className="w-5 h-5" /><span className="text-xs font-medium">History</span>
            </button>
            <button onClick={() => setView('prs')} className="flex flex-col items-center gap-0.5 text-gray-400 py-2">
              <Trophy className="w-5 h-5" /><span className="text-xs">PRs</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PRS VIEW
  if (view === 'prs') {
    const prs = getAllPRs();
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-20">
        <div className="bg-slate-900/95 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />Hall of Pain
            </h1>
          </div>
        </div>

        <div className="px-4 py-4">
          {prs.length > 0 ? (
            <div className="space-y-2">
              {prs.map((pr, index) => (
                <div key={pr.exercise} className="bg-slate-900/50 border border-gray-800 rounded-xl p-3 flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {index < 3 && <Trophy className="w-4 h-4 text-yellow-500" />}
                      <h3 className="font-semibold text-emerald-400 text-sm">{pr.exercise}</h3>
                    </div>
                    <div className="text-xs text-gray-300 mt-0.5">{pr.weight} lbs × {pr.reps} reps</div>
                    <div className="text-xs text-gray-500 mt-0.5">{formatDate(pr.date)} • {pr.muscle}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-emerald-400">{pr.est1RM}</div>
                    <div className="text-xs text-gray-400">1RM</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-700" />
              <p className="text-gray-400 text-sm">No PRs yet</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/98 backdrop-blur-lg border-t border-gray-800">
          <div className="px-4 py-2 flex justify-around">
            <button onClick={() => setView('home')} className="flex flex-col items-center gap-0.5 text-gray-400 py-2">
              <Dumbbell className="w-5 h-5" /><span className="text-xs">Home</span>
            </button>
            <button onClick={() => setView('history')} className="flex flex-col items-center gap-0.5 text-gray-400 py-2">
              <History className="w-5 h-5" /><span className="text-xs">History</span>
            </button>
            <button onClick={() => setView('prs')} className="flex flex-col items-center gap-0.5 text-emerald-400 py-2">
              <Trophy className="w-5 h-5" /><span className="text-xs font-medium">PRs</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
