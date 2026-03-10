import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Plus, History, TrendingUp, X, Check, Trophy, ChevronDown, ChevronRight, Trash2, Target, Heart, Info, BarChart3, Flame, Activity, Link2, Sparkles, MoreVertical } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// NEW PR OR ER LOGO
const PRorERLogo = () => (
  <svg width="140" height="44" viewBox="0 0 140 44">
    <defs>
      <linearGradient id="prGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{stopColor:'#10b981'}}/>
        <stop offset="100%" style={{stopColor:'#059669'}}/>
      </linearGradient>
      <linearGradient id="erGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{stopColor:'#ef4444'}}/>
        <stop offset="100%" style={{stopColor:'#dc2626'}}/>
      </linearGradient>
    </defs>
    <text x="0" y="28" fontSize="32" fontWeight="900" fill="url(#prGrad)" fontFamily="Impact,sans-serif">PR</text>
    <path d="M8,34 L10,32 L12,34 L10,36 Z M16,36 L14,38 L12,36" stroke="#10b981" strokeWidth="2.5" fill="none"/>
    <text x="52" y="28" fontSize="22" fontWeight="700" fill="#64748b">OR</text>
    <text x="92" y="28" fontSize="32" fontWeight="900" fill="url(#erGrad)" fontFamily="Impact,sans-serif">ER</text>
    <path d="M98,34 L103,34 L106,31 L109,37 L112,34 L116,34" stroke="#ef4444" strokeWidth="2.5" fill="none"/>
  </svg>
);

// CONFETTI COMPONENT
const Confetti = ({ show, type = 'normal' }) => {
  if (!show) return null;
  const colors = type === 'gold' ? ['#fbbf24', '#f59e0b', '#fcd34d'] : ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <div key={i} className="absolute w-2 h-2 rounded-full animate-confetti-fall"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random()}s`
          }}
        />
      ))}
    </div>
  );
};

// SOUND HELPER
const playSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.08;
    
    if (type === 'complete') osc.frequency.value = 800;
    else if (type === 'pr') osc.frequency.value = 1200;
    else if (type === 'finish') osc.frequency.value = 600;
    
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}
};

// FUN COMPARISONS
const getVolumeComparison = (lbs) => {
  if (lbs > 5000) return `${(lbs/5000).toFixed(1)} baby elephants 🐘`;
  if (lbs > 3000) return `${(lbs/3000).toFixed(1)} grand pianos 🎹`;
  if (lbs > 2000) return `${(lbs/2000).toFixed(1)} small cars 🚗`;
  if (lbs > 500) return `${(lbs/150).toFixed(1)} adult humans 🧍`;
  return `${(lbs/15).toFixed(0)} bowling balls 🎳`;
};

// EXERCISE DATABASE
const EXERCISE_DATABASE = {
  'Bench Press': { muscle: ['Chest','Shoulders','Arms'], compound: true, emoji: '💪', form: 'Lie flat. Lower bar to chest, press up explosively.' },
  'Incline Bench Press': { muscle: ['Chest','Shoulders'], compound: true, emoji: '💪', form: '30-45° incline. Targets upper chest.' },
  'Dumbbell Press': { muscle: ['Chest','Shoulders'], compound: true, emoji: '🏋️', form: 'Press dumbbells up and together.' },
  'Push-ups': { muscle: ['Chest','Shoulders','Arms','Core'], compound: true, emoji: '🤸', form: 'Body straight, lower to ground.' },
  'Dumbbell Flyes': { muscle: ['Chest'], compound: false, emoji: '🦅', form: 'Wide arc, deep stretch, squeeze top.' },
  'Chest Dips': { muscle: ['Chest','Arms'], compound: true, emoji: '💪', form: 'Lean forward 30-45°.' },
  
  'Deadlift': { muscle: ['Back','Legs','Core'], compound: true, emoji: '🏋️', form: 'Neutral spine, drive through heels. King of exercises.' },
  'Pull-ups': { muscle: ['Back','Arms'], compound: true, emoji: '🆙', form: 'Pull chest to bar. Full range.' },
  'Barbell Row': { muscle: ['Back','Arms'], compound: true, emoji: '🚣', form: '45° bend. Pull to lower chest.' },
  'Lat Pulldown': { muscle: ['Back','Arms'], compound: true, emoji: '⬇️', form: 'Pull to upper chest. Squeeze lats.' },
  'Dumbbell Row': { muscle: ['Back','Arms'], compound: true, emoji: '🚣', form: 'One knee on bench. Pull to hip.' },
  'Cable Row': { muscle: ['Back'], compound: true, emoji: '🚣', form: 'Pull to chest. Squeeze blades.' },
  'Romanian Deadlift': { muscle: ['Back','Legs'], compound: true, emoji: '🏋️', form: 'Hinge at hips. Hamstring stretch.' },
  
  'Squat': { muscle: ['Legs','Core'], compound: true, emoji: '🦵', form: 'Squat to parallel. Drive through heels.' },
  'Leg Press': { muscle: ['Legs'], compound: true, emoji: '🦵', form: 'Push platform up. Don\'t lock knees.' },
  'Leg Extension': { muscle: ['Legs'], compound: false, emoji: '🦵', form: 'Extend legs. Squeeze quads.' },
  'Leg Curls': { muscle: ['Legs'], compound: false, emoji: '🦵', form: 'Curl legs. Contract hamstrings.' },
  'Calf Raises': { muscle: ['Legs'], compound: false, emoji: '👠', form: 'Rise on toes. Hold squeeze.' },
  'Lunges': { muscle: ['Legs'], compound: true, emoji: '🚶', form: 'Back knee nearly touches ground.' },
  'Bulgarian Split Squat': { muscle: ['Legs'], compound: true, emoji: '🦵', form: 'Rear foot elevated. Deep squat.' },
  
  'Overhead Press': { muscle: ['Shoulders','Arms'], compound: true, emoji: '🏋️', form: 'Press straight up. Core tight.' },
  'Lateral Raises': { muscle: ['Shoulders'], compound: false, emoji: '🙆', form: 'Raise to sides. Lead with elbows.' },
  'Arnold Press': { muscle: ['Shoulders'], compound: true, emoji: '💪', form: 'Rotate palms while pressing.' },
  'Front Raises': { muscle: ['Shoulders'], compound: false, emoji: '🙋', form: 'Raise forward to shoulder height.' },
  'Rear Delt Flyes': { muscle: ['Shoulders','Back'], compound: false, emoji: '🦅', form: 'Bent 90°. Raise to sides.' },
  'Shrugs': { muscle: ['Shoulders'], compound: false, emoji: '🤷', form: 'Shrug straight up. Squeeze traps.' },
  'Face Pulls': { muscle: ['Shoulders','Back'], compound: false, emoji: '😬', form: 'Pull rope to face. Spread ends.' },
  
  'Barbell Curl': { muscle: ['Arms'], compound: false, emoji: '💪', form: 'Curl to shoulders. Elbows still.' },
  'Dumbbell Curl': { muscle: ['Arms'], compound: false, emoji: '💪', form: 'Curl with supination. Full ROM.' },
  'Hammer Curl': { muscle: ['Arms'], compound: false, emoji: '🔨', form: 'Neutral grip. Builds thickness.' },
  'Preacher Curl': { muscle: ['Arms'], compound: false, emoji: '💪', form: 'Arms on bench. No momentum.' },
  'Cable Curl': { muscle: ['Arms'], compound: false, emoji: '💪', form: 'Constant tension.' },
  'Tricep Pushdowns': { muscle: ['Arms'], compound: false, emoji: '⬇️', form: 'Push down fully. Squeeze bottom.' },
  'Skull Crushers': { muscle: ['Arms'], compound: false, emoji: '💀', form: 'Lower to forehead. Arms still.' },
  'Overhead Tricep Extension': { muscle: ['Arms'], compound: false, emoji: '🙌', form: 'Lower behind head.' },
  'Tricep Dips': { muscle: ['Arms','Chest'], compound: true, emoji: '💪', form: 'Upright for triceps. 90° bend.' },
  'Close Grip Bench': { muscle: ['Arms','Chest'], compound: true, emoji: '💪', form: 'Hands close. Elbows tucked.' },
  'Bicep Curls': { muscle: ['Arms'], compound: false, emoji: '💪', form: 'Controlled curl motion.' },
  
  'Plank': { muscle: ['Core'], compound: false, emoji: '🏋️', form: 'Body straight. Hold without sagging.' },
  'Crunches': { muscle: ['Core'], compound: false, emoji: '🔄', form: 'Lift shoulders off ground.' },
  'Russian Twists': { muscle: ['Core'], compound: false, emoji: '🔄', form: 'Lean back 45°. Rotate with weight.' },
  'Hanging Leg Raises': { muscle: ['Core'], compound: false, emoji: '🆙', form: 'Raise legs to 90°+.' },
  'Cable Crunches': { muscle: ['Core'], compound: false, emoji: '⬇️', form: 'Kneeling. Crunch down.' },
  'Mountain Climbers': { muscle: ['Core'], compound: true, emoji: '⛰️', form: 'Drive knees to chest rapidly.' },
};

const DEFAULT_TEMPLATES = {
  push: { name: 'Push', category: 'PPL', exercises: ['Bench Press','Overhead Press','Lateral Raises','Tricep Pushdowns'] },
  pull: { name: 'Pull', category: 'PPL', exercises: ['Deadlift','Pull-ups','Barbell Row','Cable Curl'] },
  legs: { name: 'Legs', category: 'PPL', exercises: ['Squat','Romanian Deadlift','Leg Press','Calf Raises'] },
  chest: { name: 'Chest', category: 'Bro Split', exercises: ['Bench Press','Dumbbell Press','Dumbbell Flyes'] },
  back: { name: 'Back', category: 'Bro Split', exercises: ['Deadlift','Pull-ups','Barbell Row'] },
  arms: { name: 'Arms', category: 'Other', exercises: ['Barbell Curl','Hammer Curl','Tricep Pushdowns'] },
  core: { name: 'Core', category: 'Other', exercises: ['Plank','Crunches','Russian Twists'] }
};

const MUSCLE_GROUPS = ['Chest','Back','Legs','Shoulders','Arms','Core'];
const CARDIO_TYPES = ['Running','Cycling','Swimming','Rowing','Elliptical','HIIT','Walking'];

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
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showPRModal, setShowPRModal] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiType, setConfettiType] = useState('normal');
  
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
  const [progressFilter, setProgressFilter] = useState('All');
  const [progressTimeFilter, setProgressTimeFilter] = useState('3m');
  const [completedWorkoutStats, setCompletedWorkoutStats] = useState(null);
  
  // DROP SET & SUPERSET STATE
  const [showExerciseMenu, setShowExerciseMenu] = useState(null);

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

  // ADD CONFETTI AUTO-DISMISS
  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [showConfetti]);

  const loadData = () => {
    try {
      const w = localStorage.getItem('prer-workouts-v4');
      const c = localStorage.getItem('prer-cardio-v4');
      const g = localStorage.getItem('prer-weekly-goal');
      
      if (w) setWorkouts(JSON.parse(w));
      if (c) setCardioSessions(JSON.parse(c));
      if (g) setWeeklyGoal(parseInt(g));
      
      setTemplates(Object.values(DEFAULT_TEMPLATES));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const saveWorkouts = (updated) => {
    try { localStorage.setItem('prer-workouts-v4', JSON.stringify(updated)); }
    catch (e) { console.error(e); }
  };

  const saveCardio = (updated) => {
    try { localStorage.setItem('prer-cardio-v4', JSON.stringify(updated)); }
    catch (e) { console.error(e); }
  };

  const saveGoal = (goal) => {
    try { localStorage.setItem('prer-weekly-goal', goal.toString()); }
    catch (e) { console.error(e); }
  };

  const calc1RM = (weight, reps) => {
    if (!weight || !reps) return 0;
    if (reps === 1) return parseFloat(weight);
    return Math.round(parseFloat(weight) * (1 + parseInt(reps) / 30) * 10) / 10;
  };

  const getPRForExercise = (exerciseName) => {
    let best = null;
    workouts.forEach(w => {
      const ex = w.exercises.find(e => e.name === exerciseName);
      if (ex) {
        ex.sets.forEach(set => {
          if (set.completed && set.weight && set.reps) {
            const est1RM = calc1RM(set.weight, set.reps);
            if (!best || est1RM > best.est1RM) {
              best = { weight: parseFloat(set.weight), reps: parseInt(set.reps), est1RM };
            }
          }
        });
      }
    });
    return best;
  };

  const startWorkout = (template = null) => {
    let exercises = [];
    if (template) {
      exercises = template.exercises.map(name => ({ id: Date.now() + Math.random(), name, sets: [], isSuperset: false, dropSet: false }));
    }
    setActiveWorkout({ id: Date.now(), exercises, templateName: template?.name || 'Custom' });
    setWorkoutStartTime(Date.now());
    setView('workout');
  };

  const addExerciseToWorkout = (exerciseName, muscles = null) => {
    if (!activeWorkout) return;
    if (muscles && !EXERCISE_DATABASE[exerciseName]) {
      EXERCISE_DATABASE[exerciseName] = { muscle: muscles, compound: false, emoji: '💪', form: 'Custom exercise' };
    }
    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, { id: Date.now() + Math.random(), name: exerciseName, sets: [], isSuperset: false, dropSet: false }]
    });
    setShowExerciseSelect(false);
    setCustomExerciseName('');
  };

  const getPreviousWorkoutForExercise = (exerciseName) => {
    for (let w of workouts) {
      const ex = w.exercises.find(e => e.name === exerciseName);
      if (ex?.sets?.length > 0) {
        const completed = ex.sets.filter(s => s.completed);
        if (completed.length > 0) return completed[completed.length - 1];
      }
    }
    return null;
  };

  const addSetToExercise = (exerciseId) => {
    const ex = activeWorkout.exercises.find(e => e.id === exerciseId);
    const lastSet = ex.sets[ex.sets.length - 1];
    const prevWorkout = getPreviousWorkoutForExercise(ex.name);
    
    let weight = '', reps = '';
    if (lastSet?.completed) { weight = lastSet.weight; reps = lastSet.reps; }
    else if (prevWorkout) { weight = prevWorkout.weight; reps = prevWorkout.reps; }
    
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(e =>
        e.id === exerciseId ? { ...e, sets: [...e.sets, { id: Date.now() + Math.random(), weight, reps, completed: false, isDropSet: false }] } : e
      )
    });
  };

  const updateSet = (exerciseId, setId, field, value) => {
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(e =>
        e.id === exerciseId ? { ...e, sets: e.sets.map(s => s.id === setId ? { ...s, [field]: value } : s) } : e
      )
    });
  };

  const completeSet = (exerciseId, setId) => {
    const ex = activeWorkout.exercises.find(e => e.id === exerciseId);
    const set = ex.sets.find(s => s.id === setId);
    if (!set.weight || !set.reps) return;
    
    playSound('complete');
    
    // CHECK FOR PR
    const current1RM = calc1RM(set.weight, set.reps);
    const pr = getPRForExercise(ex.name);
    
    if (!pr || current1RM > pr.est1RM) {
      const isWeightPR = !pr || parseFloat(set.weight) > pr.weight;
      setShowPRModal({ exercise: ex.name, weight: set.weight, reps: set.reps, est1RM: current1RM, type: isWeightPR ? 'weight' : '1rm' });
      setConfettiType(isWeightPR ? 'normal' : 'gold');
      setShowConfetti(true);
      playSound('pr');
    }
    
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(e =>
        e.id === exerciseId ? { ...e, sets: e.sets.map(s => s.id === setId ? { ...s, completed: true } : s) } : e
      )
    });
    
    setRestTimer(ex.isSuperset ? 30 : 90);
    setRestTimerExercise(ex.name);
    setRestTimerActive(true);
  };

  const deleteSet = (exerciseId, setId) => {
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(e => e.id === exerciseId ? { ...e, sets: e.sets.filter(s => s.id !== setId) } : e)
    });
  };

  const deleteExercise = (exerciseId) => {
    setActiveWorkout({ ...activeWorkout, exercises: activeWorkout.exercises.filter(e => e.id !== exerciseId) });
  };

  const deleteWorkout = (workoutId) => {
    if (confirm('Delete workout?')) {
      const updated = workouts.filter(w => w.id !== workoutId);
      setWorkouts(updated);
      saveWorkouts(updated);
    }
  };

  const toggleSuperset = (exerciseId) => {
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(e => e.id === exerciseId ? { ...e, isSuperset: !e.isSuperset } : e)
    });
    setShowExerciseMenu(null);
  };

  const addDropSet = (exerciseId) => {
    const ex = activeWorkout.exercises.find(e => e.id === exerciseId);
    const lastSet = ex.sets[ex.sets.length - 1];
    if (!lastSet || !lastSet.weight) return;
    
    const dropWeight = Math.round(parseFloat(lastSet.weight) * 0.75);
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(e =>
        e.id === exerciseId ? {
          ...e,
          sets: [...e.sets, { id: Date.now() + Math.random(), weight: dropWeight.toString(), reps: '', completed: false, isDropSet: true }]
        } : e
      )
    });
    setShowExerciseMenu(null);
  };

  const finishWorkout = () => {
    if (!activeWorkout || activeWorkout.exercises.length === 0) return;
    
    const completed = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration: workoutDuration,
      templateName: activeWorkout.templateName,
      exercises: activeWorkout.exercises.filter(e => e.sets.some(s => s.completed))
    };
    
    // CALCULATE STATS
    let totalVolume = 0;
    let prs = 0;
    completed.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.completed && set.weight && set.reps) {
          totalVolume += parseFloat(set.weight) * parseInt(set.reps);
        }
      });
    });
    
    setCompletedWorkoutStats({ totalVolume, exercises: completed.exercises.length, duration: workoutDuration, prs });
    
    const updated = [completed, ...workouts];
    setWorkouts(updated);
    saveWorkouts(updated);
    
    playSound('finish');
    setShowConfetti(true);
    setConfettiType('normal');
    setShowCompletionModal(true);
    
    setTimeout(() => {
      setActiveWorkout(null);
      setWorkoutStartTime(null);
      setWorkoutDuration(0);
      setRestTimerActive(false);
      setRestTimer(0);
      setView('home');
    }, 5000);
  };

  const cancelWorkout = () => {
    if (confirm('Cancel workout?')) {
      setActiveWorkout(null);
      setWorkoutStartTime(null);
      setWorkoutDuration(0);
      setRestTimerActive(false);
      setView('home');
    }
  };

  const logCardio = () => {
    if (!cardioType || !cardioDuration) return;
    const s = { id: Date.now(), date: new Date().toISOString(), type: cardioType, duration: parseInt(cardioDuration), notes: cardioNotes };
    const updated = [s, ...cardioSessions];
    setCardioSessions(updated);
    saveCardio(updated);
    setCardioType('Running');
    setCardioDuration('');
    setCardioNotes('');
    setShowCardioLog(false);
  };

  const deleteCardioSession = (sessionId) => {
    if (confirm('Delete cardio?')) {
      const updated = cardioSessions.filter(s => s.id !== sessionId);
      setCardioSessions(updated);
      saveCardio(updated);
    }
  };

  const getWorkoutsThisWeek = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0,0,0,0);
    return workouts.filter(w => new Date(w.date) >= weekStart).length;
  };

  const getCardioThisWeek = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0,0,0,0);
    return cardioSessions.filter(s => new Date(s.date) >= weekStart).length;
  };

  const getAllPRs = () => {
    const prs = {};
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        ex.sets.forEach(set => {
          if (set.completed && set.weight && set.reps) {
            const w = parseFloat(set.weight);
            const r = parseInt(set.reps);
            const est1RM = calc1RM(w, r);
            const data = EXERCISE_DATABASE[ex.name];
            const muscles = data?.muscle || ['Other'];
            const primaryMuscle = Array.isArray(muscles) ? muscles[0] : muscles;
            if (!prs[ex.name] || est1RM > prs[ex.name].est1RM) {
              prs[ex.name] = { weight: w, reps: r, est1RM, date: w.date, muscle: primaryMuscle };
            }
          }
        });
      });
    });
    return Object.entries(prs).map(([exercise, data]) => ({ exercise, ...data })).sort((a, b) => b.est1RM - a.est1RM);
  };

  const getProgressData = () => {
    const cutoff = new Date();
    if (progressTimeFilter === '1m') cutoff.setMonth(cutoff.getMonth() - 1);
    else if (progressTimeFilter === '3m') cutoff.setMonth(cutoff.getMonth() - 3);
    else if (progressTimeFilter === '6m') cutoff.setMonth(cutoff.getMonth() - 6);
    else cutoff.setFullYear(2000);
    
    const data = [];
    workouts.forEach(w => {
      if (new Date(w.date) < cutoff) return;
      let volume = 0;
      let total1RM = 0;
      let count = 0;
      
      w.exercises.forEach(ex => {
        const data = EXERCISE_DATABASE[ex.name];
        if (data) {
          const muscles = Array.isArray(data.muscle) ? data.muscle : [data.muscle];
          if (progressFilter !== 'All' && !muscles.includes(progressFilter)) return;
          
          let best1RM = 0;
          ex.sets.forEach(set => {
            if (set.completed && set.weight && set.reps) {
              volume += parseFloat(set.weight) * parseInt(set.reps);
              const est1RM = calc1RM(set.weight, set.reps);
              if (est1RM > best1RM) best1RM = est1RM;
            }
          });
          
          if (best1RM > 0) {
            total1RM += best1RM;
            count++;
          }
        }
      });
      
      if (count > 0) {
        data.push({ date: w.date, volume, avg1RM: Math.round(total1RM / count) });
      }
    });
    
    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatShortDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Continue in next part due to file size...

  // HOME VIEW
  if (view === 'home') {
    const recent = workouts.slice(0, 3);
    const workoutsThisWeek = getWorkoutsThisWeek();
    const cardioThisWeek = getCardioThisWeek();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-16 overflow-x-hidden">
        <Confetti show={showConfetti} type={confettiType} />
        
        <div className="bg-slate-900/98 backdrop-blur border-b border-gray-800 sticky top-0 z-10">
          <div className="px-3 py-2.5 flex items-center justify-between max-w-full">
            <PRorERLogo />
            <button onClick={() => setShowGoalSetting(true)} className="p-1.5 hover:bg-slate-800 rounded-lg flex-shrink-0">
              <Target className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        <div className="px-3 py-3 space-y-3 max-w-full overflow-hidden">
          <button onClick={() => setShowTemplateSelect(true)}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
            <Dumbbell className="w-5 h-5" />Start Workout
          </button>

          <button onClick={() => setShowCardioLog(true)}
            className="w-full bg-slate-800 border border-emerald-600/30 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-emerald-400" />Log Cardio
          </button>

          <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm">Weekly Progress</h3>
              <span className="text-xs text-gray-400">Goal: {weeklyGoal}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full ${workoutsThisWeek >= weeklyGoal ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min((workoutsThisWeek / weeklyGoal) * 100, 100)}%` }} />
              </div>
              <span className="text-xl font-bold text-emerald-400 flex-shrink-0">{workoutsThisWeek}/{weeklyGoal}</span>
            </div>
            {cardioThisWeek > 0 && (
              <div className="text-xs text-gray-400"><Heart className="w-3 h-3 inline mr-1 text-red-400" />{cardioThisWeek} cardio</div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-2.5">
              <div className="text-xl font-bold text-emerald-400">{workouts.length}</div>
              <div className="text-xs text-gray-400">Workouts</div>
            </div>
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-2.5">
              <div className="text-xl font-bold text-emerald-400">{getAllPRs().length}</div>
              <div className="text-xs text-gray-400">PRs</div>
            </div>
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-2.5">
              <div className="text-xl font-bold text-emerald-400">{cardioSessions.length}</div>
              <div className="text-xs text-gray-400">Cardio</div>
            </div>
          </div>

          {recent.length > 0 && (
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-3">
              <h3 className="font-semibold mb-2 text-sm">Recent</h3>
              <div className="space-y-2">
                {recent.map(w => (
                  <div key={w.id} className="bg-slate-800/50 rounded-lg p-2 flex justify-between items-center text-sm">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-emerald-400 truncate">{w.templateName}</div>
                      <div className="text-xs text-gray-400">{formatDate(w.date)}</div>
                    </div>
                    <div className="text-right text-xs flex-shrink-0 ml-2">
                      <div className="font-semibold">{w.exercises.length} ex</div>
                      <div className="text-gray-400">{formatDuration(w.duration)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/98 border-t border-gray-800 safe-bottom">
          <div className="px-3 py-1.5 flex justify-around max-w-full">
            <button onClick={() => setView('home')} className="flex flex-col items-center gap-0.5 text-emerald-400 py-1.5 min-w-0">
              <Dumbbell className="w-5 h-5 flex-shrink-0" /><span className="text-xs font-medium">Home</span>
            </button>
            <button onClick={() => setView('history')} className="flex flex-col items-center gap-0.5 text-gray-400 py-1.5 min-w-0">
              <History className="w-5 h-5 flex-shrink-0" /><span className="text-xs">History</span>
            </button>
            <button onClick={() => setView('progress')} className="flex flex-col items-center gap-0.5 text-gray-400 py-1.5 min-w-0">
              <TrendingUp className="w-5 h-5 flex-shrink-0" /><span className="text-xs">Progress</span>
            </button>
            <button onClick={() => setView('prs')} className="flex flex-col items-center gap-0.5 text-gray-400 py-1.5 min-w-0">
              <Trophy className="w-5 h-5 flex-shrink-0" /><span className="text-xs">PRs</span>
            </button>
          </div>
        </div>

        {/* MODALS */}
        {showTemplateSelect && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
            <div className="bg-slate-900 rounded-t-2xl w-full max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-900 border-b border-gray-800 p-3 flex justify-between items-center">
                <h2 className="font-bold">Select Workout</h2>
                <button onClick={() => setShowTemplateSelect(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-3 space-y-2">
                <button onClick={() => { startWorkout(); setShowTemplateSelect(false); }}
                  className="w-full bg-emerald-600 py-2.5 rounded-xl font-medium text-sm">
                  Empty Workout
                </button>
                {['PPL', 'Bro Split', 'Other'].map(cat => {
                  const temps = templates.filter(t => t.category === cat);
                  if (temps.length === 0) return null;
                  return (
                    <div key={cat}>
                      <h3 className="text-xs font-semibold text-gray-400 mb-1.5">{cat}</h3>
                      <div className="space-y-1.5">
                        {temps.map(t => (
                          <button key={t.name} onClick={() => { startWorkout(t); setShowTemplateSelect(false); }}
                            className="w-full bg-slate-800/50 border border-gray-700 p-2.5 rounded-xl text-left">
                            <div className="font-medium text-emerald-400 text-sm">{t.name}</div>
                            <div className="text-xs text-gray-400">{t.exercises.length} exercises</div>
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
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3">
            <div className="bg-slate-900 rounded-2xl w-full max-w-sm">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold">Log Cardio</h2>
                  <button onClick={() => setShowCardioLog(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-2.5">
                  <select value={cardioType} onChange={(e) => setCardioType(e.target.value)}
                    className="w-full bg-slate-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                    {CARDIO_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <input type="number" inputMode="numeric" value={cardioDuration} onChange={(e) => setCardioDuration(e.target.value)}
                    className="w-full bg-slate-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" placeholder="Minutes" />
                  <textarea value={cardioNotes} onChange={(e) => setCardioNotes(e.target.value)}
                    className="w-full bg-slate-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" rows="2" placeholder="Notes" />
                  <button onClick={logCardio} disabled={!cardioType || !cardioDuration}
                    className="w-full bg-emerald-600 disabled:bg-gray-700 py-2 rounded-xl font-medium text-sm">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showGoalSetting && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3">
            <div className="bg-slate-900 rounded-2xl w-full max-w-sm">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold">Weekly Goal</h2>
                  <button onClick={() => setShowGoalSetting(false)}><X className="w-5 h-5" /></button>
                </div>
                <p className="text-xs text-gray-400 mb-3">Workouts per week?</p>
                <input type="number" value={weeklyGoal} onChange={(e) => setWeeklyGoal(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-800 border border-gray-700 rounded-lg px-4 py-2.5 text-xl text-center font-bold mb-3" min="1" max="7" />
                <div className="flex gap-2 mb-3">
                  {[3, 4, 5, 6].map(n => (
                    <button key={n} onClick={() => setWeeklyGoal(n)}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-medium ${weeklyGoal === n ? 'bg-emerald-600' : 'bg-slate-800'}`}>
                      {n}x
                    </button>
                  ))}
                </div>
                <button onClick={() => { saveGoal(weeklyGoal); setShowGoalSetting(false); }}
                  className="w-full bg-emerald-600 py-2 rounded-xl font-medium text-sm">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-16 overflow-x-hidden">
        <Confetti show={showConfetti} type={confettiType} />
        
        {restTimerActive && (
          <div className="fixed top-14 left-0 right-0 z-50 px-3">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-2.5 shadow-2xl">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs font-medium truncate flex-1 min-w-0">Rest - {restTimerExercise}</div>
                <button onClick={() => setRestTimerActive(false)} className="flex-shrink-0"><X className="w-4 h-4" /></button>
              </div>
              <div className="text-2xl font-bold text-center">{formatDuration(restTimer)}</div>
              <div className="mt-1.5 flex gap-1.5">
                <button onClick={() => setRestTimer(prev => prev + 15)} className="flex-1 bg-white/20 py-1 rounded text-xs">+15s</button>
                <button onClick={() => setRestTimer(prev => prev + 30)} className="flex-1 bg-white/20 py-1 rounded text-xs">+30s</button>
                <button onClick={() => setRestTimerActive(false)} className="flex-1 bg-white/20 py-1 rounded text-xs">Skip</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-900/98 backdrop-blur border-b border-gray-800 sticky top-0 z-10">
          <div className="px-3 py-2.5 flex items-center justify-between max-w-full">
            <button onClick={cancelWorkout} className="text-red-400 flex-shrink-0"><X className="w-5 h-5" /></button>
            <div className="text-center flex-1 min-w-0 mx-2">
              <h2 className="font-bold text-sm truncate">{activeWorkout.templateName}</h2>
              <div className="text-xs text-emerald-400 font-semibold">{formatDuration(workoutDuration)}</div>
            </div>
            <button onClick={finishWorkout} className="bg-emerald-600 px-3 py-1.5 rounded-lg text-sm font-medium flex-shrink-0">Finish</button>
          </div>
        </div>

        <div className="px-3 py-3 space-y-2.5 max-w-full overflow-hidden">
          {activeWorkout.exercises.map((ex) => {
            const pr = getPRForExercise(ex.name);
            const prev = getPreviousWorkoutForExercise(ex.name);
            const data = EXERCISE_DATABASE[ex.name];
            
            return (
              <div key={ex.id} className={`bg-slate-900/50 border rounded-xl p-2.5 ${ex.isSuperset ? 'border-blue-500' : 'border-gray-800'}`}>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg flex-shrink-0">{data?.emoji || '💪'}</span>
                      <h3 className="font-semibold text-emerald-400 text-sm truncate">{ex.name}</h3>
                      <button onClick={() => setShowExerciseInfo(ex.name)} className="text-gray-400 flex-shrink-0">
                        <Info className="w-3.5 h-3.5" />
                      </button>
                      {ex.isSuperset && <span className="text-xs bg-blue-600 px-1.5 py-0.5 rounded flex-shrink-0">SS</span>}
                    </div>
                    {pr && (
                      <div className="text-xs text-emerald-400 mt-0.5">PR: {pr.weight} lbs (1RM: {pr.est1RM})</div>
                    )}
                    {prev && (
                      <div className="text-xs text-gray-400">Last: {prev.weight} × {prev.reps}</div>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => setShowExerciseMenu(showExerciseMenu === ex.id ? null : ex.id)} className="text-gray-400 p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteExercise(ex.id)} className="text-gray-400 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {showExerciseMenu === ex.id && (
                  <div className="mb-2 p-2 bg-slate-800 rounded-lg space-y-1">
                    <button onClick={() => toggleSuperset(ex.id)}
                      className="w-full text-left text-xs py-1.5 px-2 hover:bg-slate-700 rounded flex items-center gap-2">
                      <Link2 className="w-3.5 h-3.5" />{ex.isSuperset ? 'Remove Superset' : 'Make Superset'}
                    </button>
                    <button onClick={() => addDropSet(ex.id)}
                      className="w-full text-left text-xs py-1.5 px-2 hover:bg-slate-700 rounded flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5" />Add Drop Set
                    </button>
                  </div>
                )}

                <div className="space-y-1.5 mb-2 max-w-full overflow-hidden">
                  {ex.sets.map((set, idx) => {
                    const current1RM = calc1RM(set.weight, set.reps);
                    const prPercent = pr && current1RM ? Math.round((current1RM / pr.est1RM) * 100) : 0;
                    const isPRAttempt = prPercent >= 95 && !set.completed;
                    
                    return (
                      <div key={set.id}>
                        <div className={`flex items-center gap-1 p-1.5 rounded-lg max-w-full ${
                          set.completed ? 'bg-emerald-900/30 border border-emerald-700/50' : 
                          set.isDropSet ? 'bg-orange-900/20 border border-orange-700/50' :
                          'bg-slate-800/50 border border-gray-700'
                        }`}>
                          <div className="text-xs font-medium text-gray-400 w-7 flex-shrink-0">#{idx + 1}</div>
                          <input type="number" inputMode="decimal" value={set.weight} onChange={(e) => updateSet(ex.id, set.id, 'weight', e.target.value)}
                            placeholder="lbs" disabled={set.completed}
                            className="flex-1 min-w-0 bg-slate-700/50 border-0 rounded px-2 py-1 text-xs text-white disabled:opacity-50" />
                          <span className="text-gray-400 text-xs flex-shrink-0">×</span>
                          <input type="number" inputMode="numeric" value={set.reps} onChange={(e) => updateSet(ex.id, set.id, 'reps', e.target.value)}
                            placeholder="reps" disabled={set.completed}
                            className="flex-1 min-w-0 bg-slate-700/50 border-0 rounded px-2 py-1 text-xs text-white disabled:opacity-50" />
                          {!set.completed ? (
                            <>
                              <button onClick={() => completeSet(ex.id, set.id)} disabled={!set.weight || !set.reps}
                                className="bg-emerald-600 disabled:bg-gray-700 p-1 rounded flex-shrink-0">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteSet(ex.id, set.id)} className="text-gray-400 p-1 flex-shrink-0">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <div className="bg-emerald-600 p-1 rounded flex-shrink-0"><Check className="w-4 h-4" /></div>
                          )}
                        </div>
                        {isPRAttempt && (
                          <div className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1 animate-pulse">
                            <Zap className="w-3 h-3" />You're at {prPercent}% of your PR!
                          </div>
                        )}
                        {set.isDropSet && (
                          <div className="text-xs text-orange-400 mt-0.5">Drop Set</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button onClick={() => addSetToExercise(ex.id)}
                  className="w-full bg-slate-800/50 border border-gray-700 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
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

        {/* Exercise Select Modal */}
        {showExerciseSelect && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
            <div className="bg-slate-900 rounded-t-2xl w-full max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-900 border-b border-gray-800 p-3 flex justify-between items-center">
                <h2 className="font-bold">Add Exercise</h2>
                <button onClick={() => setShowExerciseSelect(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-3">
                <div className="mb-3">
                  <input type="text" value={customExerciseName} onChange={(e) => setCustomExerciseName(e.target.value)}
                    placeholder="Custom exercise..." className="w-full bg-slate-800 border border-gray-700 rounded-lg px-3 py-2 text-sm mb-2" />
                  {customExerciseName && (
                    <div className="mb-2">
                      <label className="text-xs text-gray-400 block mb-1.5">Muscle groups</label>
                      <div className="flex flex-wrap gap-1.5">
                        {MUSCLE_GROUPS.map(m => (
                          <button key={m} onClick={() => {
                            if (customExerciseMuscles.includes(m)) {
                              setCustomExerciseMuscles(customExerciseMuscles.filter(x => x !== m));
                            } else {
                              setCustomExerciseMuscles([...customExerciseMuscles, m]);
                            }
                          }}
                            className={`px-2 py-1 rounded-lg text-xs ${customExerciseMuscles.includes(m) ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                            {m}
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
                  {['All', ...MUSCLE_GROUPS].map(m => (
                    <button key={m} onClick={() => setSelectedMuscleFilter(m)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                        selectedMuscleFilter === m ? 'bg-emerald-600' : 'bg-slate-800'
                      }`}>
                      {m}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  {Object.keys(EXERCISE_DATABASE).filter(name => {
                    if (selectedMuscleFilter === 'All') return true;
                    const data = EXERCISE_DATABASE[name];
                    const muscles = Array.isArray(data.muscle) ? data.muscle : [data.muscle];
                    return muscles.includes(selectedMuscleFilter);
                  }).map(name => {
                    const data = EXERCISE_DATABASE[name];
                    return (
                      <button key={name} onClick={() => addExerciseToWorkout(name)}
                        className="w-full bg-slate-800/50 border border-gray-700 p-2.5 rounded-xl text-left flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-lg flex-shrink-0">{data.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{name}</div>
                            <div className="text-xs text-gray-400 truncate">
                              {Array.isArray(data.muscle) ? data.muscle.join(', ') : data.muscle}
                            </div>
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setShowExerciseInfo(name); }} className="text-gray-400 p-1 flex-shrink-0">
                          <Info className="w-4 h-4" />
                        </button>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercise Info Modal */}
        {showExerciseInfo && EXERCISE_DATABASE[showExerciseInfo] && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3">
            <div className="bg-slate-900 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-3xl flex-shrink-0">{EXERCISE_DATABASE[showExerciseInfo].emoji}</span>
                    <h2 className="font-bold text-emerald-400 truncate">{showExerciseInfo}</h2>
                  </div>
                  <button onClick={() => setShowExerciseInfo(null)} className="flex-shrink-0"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Muscles</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(EXERCISE_DATABASE[showExerciseInfo].muscle) 
                        ? EXERCISE_DATABASE[showExerciseInfo].muscle 
                        : [EXERCISE_DATABASE[showExerciseInfo].muscle]).map(m => (
                        <span key={m} className="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 rounded text-xs">{m}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Type</div>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      EXERCISE_DATABASE[showExerciseInfo].compound ? 'bg-blue-600/20 text-blue-400' : 'bg-purple-600/20 text-purple-400'
                    }`}>
                      {EXERCISE_DATABASE[showExerciseInfo].compound ? 'Compound' : 'Isolation'}
                    </span>
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

        {/* PR Modal */}
        {showPRModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3">
            <div className="bg-gradient-to-br from-emerald-900 to-green-900 border-2 border-emerald-400 rounded-2xl p-6 text-center max-w-sm">
              <div className="text-6xl mb-3">{showPRModal.type === 'weight' ? '💪' : '🏆'}</div>
              <h2 className="text-2xl font-black mb-2">{showPRModal.type === 'weight' ? 'NEW PR!' : 'ALL-TIME BEST!'}</h2>
              <div className="text-lg font-bold mb-1">{showPRModal.exercise}</div>
              <div className="text-xl text-emerald-300 mb-3">{showPRModal.weight} lbs × {showPRModal.reps} reps</div>
              <div className="text-sm text-emerald-200">1RM: {showPRModal.est1RM} lbs</div>
              <button onClick={() => setShowPRModal(null)} className="mt-4 bg-white text-emerald-900 px-6 py-2 rounded-xl font-bold">
                AMAZING!
              </button>
            </div>
          </div>
        )}

        {/* Completion Modal */}
        {showCompletionModal && completedWorkoutStats && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-3">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-emerald-500 rounded-2xl p-6 text-center max-w-sm">
              <div className="text-6xl mb-3">🎉</div>
              <h2 className="text-2xl font-black mb-4">GREAT JOB!</h2>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-400">Total Volume</div>
                <div className="text-2xl font-bold text-emerald-400">{completedWorkoutStats.totalVolume.toLocaleString()} lbs</div>
                <div className="text-sm text-emerald-300">{getVolumeComparison(completedWorkoutStats.totalVolume)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="text-xl font-bold text-emerald-400">{completedWorkoutStats.exercises}</div>
                  <div className="text-xs text-gray-400">Exercises</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="text-xl font-bold text-emerald-400">{formatDuration(completedWorkoutStats.duration)}</div>
                  <div className="text-xs text-gray-400">Duration</div>
                </div>
              </div>
              <button onClick={() => setShowCompletionModal(false)} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold w-full">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // HISTORY VIEW
  if (view === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-16 overflow-x-hidden">
        <div className="bg-slate-900/98 backdrop-blur border-b border-gray-800 sticky top-0 z-10">
          <div className="px-3 py-2.5"><h1 className="font-bold">History</h1></div>
        </div>

        <div className="px-3 py-3 max-w-full">
          {workouts.length > 0 ? (
            <div className="space-y-2">
              {workouts.map(w => (
                <div key={w.id} className="bg-slate-900/50 border border-gray-800 rounded-xl overflow-hidden">
                  <button onClick={() => setExpandedWorkout(expandedWorkout === w.id ? null : w.id)}
                    className="w-full p-2.5 flex justify-between items-center gap-2">
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="font-semibold text-emerald-400 text-sm truncate">{w.templateName}</h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                        <span>{formatDate(w.date)}</span>
                        <span>{formatDuration(w.duration)}</span>
                        <span className="text-emerald-400">{w.exercises.length} ex</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); deleteWorkout(w.id); }} className="text-gray-400 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {expandedWorkout === w.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>

                  {expandedWorkout === w.id && (
                    <div className="px-2.5 pb-2.5 space-y-1.5 border-t border-gray-800 pt-2">
                      {w.exercises.map(ex => (
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
              <p className="text-gray-400 text-sm">No history</p>
            </div>
          )}

          {cardioSessions.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold mb-2">Cardio</h2>
              <div className="space-y-2">
                {cardioSessions.map(s => (
                  <div key={s.id} className="bg-slate-900/50 border border-gray-800 rounded-xl p-2.5 flex justify-between items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-red-400 text-sm truncate">{s.type}</div>
                      <div className="text-xs text-gray-400">{formatDate(s.date)}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-right">
                        <div className="font-semibold text-sm">{s.duration}min</div>
                      </div>
                      <button onClick={() => deleteCardioSession(s.id)} className="text-gray-400 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/98 border-t border-gray-800">
          <div className="px-3 py-1.5 flex justify-around">
            <button onClick={() => setView('home')} className="flex flex-col items-center gap-0.5 text-gray-400 py-1.5 min-w-0">
              <Dumbbell className="w-5 h-5" /><span className="text-xs">Home</span>
            </button>
            <button onClick={() => setView('history')} className="flex flex-col items-center gap-0.5 text-emerald-400 py-1.5 min-w-0">
              <History className="w-5 h-5" /><span className="text-xs font-medium">History</span>
            </button>
            <button onClick={() => setView('progress')} className="flex flex-col items-center gap-0.5 text-gray-400 py-1.5 min-w-0">
              <TrendingUp className="w-5 h-5" /><span className="text-xs">Progress</span>
            </button>
            <button onClick={() => setView('prs')} className="flex flex-col items-center gap-0.5 text-gray-400 py-1.5 min-w-0">
              <Trophy className="w-5 h-5" /><span className="text-xs">PRs</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PROGRESS VIEW
  if (view === 'progress') {
    const progressData = getProgressData();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-16 overflow-x-hidden">
        <div className="bg-slate-900/98 backdrop-blur border-b border-gray-800 sticky top-0 z-10">
          <div className="px-3 py-2.5"><h1 className="font-bold">Progress</h1></div>
        </div>

        <div className="px-3 py-3 space-y-3 max-w-full">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['All', ...MUSCLE_GROUPS].map(m => (
              <button key={m} onClick={() => setProgressFilter(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                  progressFilter === m ? 'bg-emerald-600' : 'bg-slate-800'
                }`}>
                {m}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {['1m', '3m', '6m', 'All'].map(t => (
              <button key={t} onClick={() => setProgressTimeFilter(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${
                  progressTimeFilter === t ? 'bg-emerald-600' : 'bg-slate-800'
                }`}>
                {t === '1m' ? '1 Month' : t === '3m' ? '3 Months' : t === '6m' ? '6 Months' : 'All Time'}
              </button>
            ))}
          </div>

          {progressData.length > 0 ? (
            <>
              <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-3">
                <h3 className="font-semibold mb-2 text-sm">Volume Trend</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressData}>
                      <defs>
                        <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" tick={{fontSize: 10}} tickFormatter={formatShortDate} stroke="#6b7280" />
                      <YAxis tick={{fontSize: 10}} stroke="#6b7280" />
                      <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px'}} />
                      <Area type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} fill="url(#volumeGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-3">
                <h3 className="font-semibold mb-2 text-sm">Strength Trend (Avg 1RM)</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" tick={{fontSize: 10}} tickFormatter={formatShortDate} stroke="#6b7280" />
                      <YAxis tick={{fontSize: 10}} stroke="#6b7280" />
                      <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px'}} />
                      <Line type="monotone" dataKey="avg1RM" stroke="#3b82f6" strokeWidth={2} dot={{fill: '#3b82f6', r: 3}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-700" />
              <p className="text-gray-400 text-sm">No data yet</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/98 border-t border-gray-800">
          <div className="px-3 py-1.5 flex justify-around">
            <button onClick={() => setView('home')} className="flex flex-col items-center gap-0.5 text-gray-400 py-1.5 min-w-0">
              <Dumbbell className="w-5 h-5" /><span className="text-xs">Home</span>
            </button>
            <button onClick={() => setView('history')} className="flex flex-col items-center gap-0.5 text-gray-400 py-1.5 min-w-0">
              <History className="w-5 h-5" /><span className="text-xs">History</span>
            </button>
            <button onClick={() => setView('progress')} className="flex flex-col items-center gap-0.5 text-emerald-400 py-1.5 min-w-0">
              <TrendingUp className="w-5 h-5" /><span className="text-xs font-medium">Progress</span>
            </button>
            <button onClick={() => setView('prs')} className="flex flex-col items-center gap-0.5 text-gray-400 py-1.5 min-w-0">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-16 overflow-x-hidden">
        <div className="bg-slate-900/98 backdrop-blur border-b border-gray-800 sticky top-0 z-10">
          <div className="px-3 py-2.5">
            <h1 className="font-bold flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />Hall of Pain
            </h1>
          </div>
        </div>

        <div className="px-3 py-3 max-w-full">
          {prs.length > 0 ? (
            <div className="space-y-2">
              {prs.map((pr, i) => (
                <div key={pr.exercise} className="bg-slate-900/50 border border-gray-800 rounded-xl p-2.5 flex justify-between items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {i < 3 && <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                      <h3 className="font-semibold text-emerald-400 text-sm truncate">{pr.exercise}</h3>
                    </div>
                    <div className="text-xs text-gray-300 mt-0.5">{pr.weight} lbs × {pr.reps} reps</div>
                    <div className="text-xs text-gray-500 mt-0.5">{formatDate(pr.date)} • {pr.muscle}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
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

        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/98 border-t border-gray-800">
          <div className="px-3 py-1.5 flex justify-around">
            <button onClick={() => setView('home')} className="flex flex-col items-center gap-0.5 text-gray-400 py-1.5 min-w-0">
              <Dumbbell className="w-5 h-5" /><span className="text-xs">Home</span>
            </button>
            <button onClick={() => setView('history')} className="flex flex-col items-center gap-0.5 text-gray-400 py-1.5 min-w-0">
              <History className="w-5 h-5" /><span className="text-xs">History</span>
            </button>
            <button onClick={() => setView('progress')} className="flex flex-col items-center gap-0.5 text-gray-400 py-1.5 min-w-0">
              <TrendingUp className="w-5 h-5" /><span className="text-xs">Progress</span>
            </button>
            <button onClick={() => setView('prs')} className="flex flex-col items-center gap-0.5 text-emerald-400 py-1.5 min-w-0">
              <Trophy className="w-5 h-5" /><span className="text-xs font-medium">PRs</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
