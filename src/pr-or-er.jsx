import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Plus, History, TrendingUp, X, Check, Trophy, Clock, Play, Pause, ChevronDown, ChevronRight, Copy, Save, Trash2, Edit2, Filter, Calendar, BarChart3, Flame, Target, Zap } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Default workout templates
const DEFAULT_TEMPLATES = {
  push: {
    name: 'Push Day',
    category: 'PPL',
    exercises: ['Bench Press', 'Overhead Press', 'Incline Dumbbell Press', 'Lateral Raises', 'Tricep Pushdowns', 'Overhead Tricep Extension']
  },
  pull: {
    name: 'Pull Day',
    category: 'PPL',
    exercises: ['Deadlift', 'Pull-ups', 'Barbell Row', 'Lat Pulldown', 'Face Pulls', 'Bicep Curls', 'Hammer Curls']
  },
  legs: {
    name: 'Leg Day',
    category: 'PPL',
    exercises: ['Squat', 'Romanian Deadlift', 'Leg Press', 'Leg Curls', 'Leg Extensions', 'Calf Raises']
  },
  chest: {
    name: 'Chest Day',
    category: 'Bro Split',
    exercises: ['Bench Press', 'Incline Bench Press', 'Dumbbell Flyes', 'Cable Crossovers', 'Dips']
  },
  back: {
    name: 'Back Day',
    category: 'Bro Split',
    exercises: ['Deadlift', 'Pull-ups', 'Barbell Row', 'T-Bar Row', 'Lat Pulldown', 'Cable Row']
  },
  shoulders: {
    name: 'Shoulder Day',
    category: 'Bro Split',
    exercises: ['Overhead Press', 'Arnold Press', 'Lateral Raises', 'Front Raises', 'Rear Delt Flyes', 'Shrugs']
  },
  arms: {
    name: 'Arms Day',
    category: 'Bro Split',
    exercises: ['Barbell Curl', 'Hammer Curl', 'Preacher Curl', 'Tricep Dips', 'Skull Crushers', 'Cable Tricep Extension']
  },
  arnoldChestBack: {
    name: 'Chest & Back',
    category: 'Arnold Split',
    exercises: ['Bench Press', 'Pull-ups', 'Incline Dumbbell Press', 'Barbell Row', 'Dumbbell Flyes', 'Lat Pulldown']
  },
  arnoldShouldersArms: {
    name: 'Shoulders & Arms',
    category: 'Arnold Split',
    exercises: ['Overhead Press', 'Barbell Curl', 'Lateral Raises', 'Tricep Dips', 'Front Raises', 'Hammer Curl']
  },
  arnoldLegs: {
    name: 'Legs',
    category: 'Arnold Split',
    exercises: ['Squat', 'Romanian Deadlift', 'Leg Press', 'Leg Curls', 'Lunges', 'Calf Raises']
  },
  fullBody: {
    name: 'Full Body',
    category: 'Full Body',
    exercises: ['Squat', 'Bench Press', 'Barbell Row', 'Overhead Press', 'Romanian Deadlift', 'Pull-ups']
  },
  upper: {
    name: 'Upper Body',
    category: 'Upper/Lower',
    exercises: ['Bench Press', 'Barbell Row', 'Overhead Press', 'Pull-ups', 'Dips', 'Bicep Curls']
  },
  lower: {
    name: 'Lower Body',
    category: 'Upper/Lower',
    exercises: ['Squat', 'Romanian Deadlift', 'Leg Press', 'Leg Curls', 'Lunges', 'Calf Raises']
  }
};

// Exercise database with muscle groups
const EXERCISE_DATABASE = {
  // Chest
  'Bench Press': { muscle: 'Chest', compound: true },
  'Incline Bench Press': { muscle: 'Chest', compound: true },
  'Decline Bench Press': { muscle: 'Chest', compound: true },
  'Dumbbell Press': { muscle: 'Chest', compound: true },
  'Incline Dumbbell Press': { muscle: 'Chest', compound: true },
  'Dumbbell Flyes': { muscle: 'Chest', compound: false },
  'Cable Crossovers': { muscle: 'Chest', compound: false },
  'Dips': { muscle: 'Chest', compound: true },
  'Push-ups': { muscle: 'Chest', compound: true },
  
  // Back
  'Deadlift': { muscle: 'Back', compound: true },
  'Pull-ups': { muscle: 'Back', compound: true },
  'Chin-ups': { muscle: 'Back', compound: true },
  'Barbell Row': { muscle: 'Back', compound: true },
  'T-Bar Row': { muscle: 'Back', compound: true },
  'Dumbbell Row': { muscle: 'Back', compound: true },
  'Lat Pulldown': { muscle: 'Back', compound: true },
  'Cable Row': { muscle: 'Back', compound: true },
  'Face Pulls': { muscle: 'Back', compound: false },
  
  // Legs
  'Squat': { muscle: 'Legs', compound: true },
  'Front Squat': { muscle: 'Legs', compound: true },
  'Romanian Deadlift': { muscle: 'Legs', compound: true },
  'Leg Press': { muscle: 'Legs', compound: true },
  'Leg Curls': { muscle: 'Legs', compound: false },
  'Leg Extensions': { muscle: 'Legs', compound: false },
  'Lunges': { muscle: 'Legs', compound: true },
  'Bulgarian Split Squat': { muscle: 'Legs', compound: true },
  'Calf Raises': { muscle: 'Legs', compound: false },
  
  // Shoulders
  'Overhead Press': { muscle: 'Shoulders', compound: true },
  'Arnold Press': { muscle: 'Shoulders', compound: true },
  'Dumbbell Shoulder Press': { muscle: 'Shoulders', compound: true },
  'Lateral Raises': { muscle: 'Shoulders', compound: false },
  'Front Raises': { muscle: 'Shoulders', compound: false },
  'Rear Delt Flyes': { muscle: 'Shoulders', compound: false },
  'Shrugs': { muscle: 'Shoulders', compound: false },
  
  // Arms
  'Barbell Curl': { muscle: 'Arms', compound: false },
  'Dumbbell Curl': { muscle: 'Arms', compound: false },
  'Hammer Curl': { muscle: 'Arms', compound: false },
  'Preacher Curl': { muscle: 'Arms', compound: false },
  'Cable Curl': { muscle: 'Arms', compound: false },
  'Tricep Dips': { muscle: 'Arms', compound: true },
  'Skull Crushers': { muscle: 'Arms', compound: false },
  'Tricep Pushdowns': { muscle: 'Arms', compound: false },
  'Overhead Tricep Extension': { muscle: 'Arms', compound: false },
  'Close Grip Bench Press': { muscle: 'Arms', compound: true },
};

export default function PRorER() {
  const [view, setView] = useState('home');
  const [workouts, setWorkouts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Template/Exercise Selection
  const [showTemplateSelect, setShowTemplateSelect] = useState(false);
  const [showExerciseSelect, setShowExerciseSelect] = useState(false);
  const [customExerciseName, setCustomExerciseName] = useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState('All');
  
  // Rest Timer
  const [restTimer, setRestTimer] = useState(0);
  const [restTimerActive, setRestTimerActive] = useState(false);
  const [restTimerExercise, setRestTimerExercise] = useState('');
  const restTimerInterval = useRef(null);
  
  // Progress Tracking
  const [progressMuscleFilter, setProgressMuscleFilter] = useState('All');
  const [progressTimeFilter, setProgressTimeFilter] = useState('3months');
  
  // History
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  
  // Bodyweight tracking
  const [bodyweight, setBodyweight] = useState([]);
  const [showBodyweightInput, setShowBodyweightInput] = useState(false);
  const [newBodyweight, setNewBodyweight] = useState('');

  // Template management
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateName, setTemplateName] = useState('');

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  // Workout duration timer
  useEffect(() => {
    let interval;
    if (workoutStartTime && activeWorkout) {
      interval = setInterval(() => {
        setWorkoutDuration(Math.floor((Date.now() - workoutStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutStartTime, activeWorkout]);

  // Rest timer countdown
  useEffect(() => {
    if (restTimerActive && restTimer > 0) {
      restTimerInterval.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setRestTimerActive(false);
            return 0;
          }
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
      const workoutsResult = await window.storage.get('prer-workouts', false);
      const templatesResult = await window.storage.get('prer-templates', false);
      const bodyweightResult = await window.storage.get('prer-bodyweight', false);
      
      if (workoutsResult?.value) {
        setWorkouts(JSON.parse(workoutsResult.value));
      }
      if (templatesResult?.value) {
        setTemplates(JSON.parse(templatesResult.value));
      } else {
        // Initialize with default templates
        const defaultTemplatesList = Object.values(DEFAULT_TEMPLATES);
        setTemplates(defaultTemplatesList);
        saveTemplates(defaultTemplatesList);
      }
      if (bodyweightResult?.value) {
        setBodyweight(JSON.parse(bodyweightResult.value));
      }
    } catch (error) {
      console.log('No existing data found, starting fresh');
      const defaultTemplatesList = Object.values(DEFAULT_TEMPLATES);
      setTemplates(defaultTemplatesList);
      saveTemplates(defaultTemplatesList);
    }
    setLoading(false);
  };

  const saveWorkouts = async (updatedWorkouts) => {
    try {
      await window.storage.set('prer-workouts', JSON.stringify(updatedWorkouts), false);
    } catch (error) {
      console.error('Failed to save workouts:', error);
    }
  };

  const saveTemplates = async (updatedTemplates) => {
    try {
      await window.storage.set('prer-templates', JSON.stringify(updatedTemplates), false);
    } catch (error) {
      console.error('Failed to save templates:', error);
    }
  };

  const saveBodyweight = async (updatedBodyweight) => {
    try {
      await window.storage.set('prer-bodyweight', JSON.stringify(updatedBodyweight), false);
    } catch (error) {
      console.error('Failed to save bodyweight:', error);
    }
  };

  const startWorkout = (template = null) => {
    let exercises = [];
    if (template) {
      exercises = template.exercises.map(name => ({
        id: Date.now() + Math.random(),
        name,
        sets: [],
        notes: ''
      }));
    }
    
    setActiveWorkout({
      id: Date.now(),
      exercises,
      templateName: template?.name || 'Custom Workout'
    });
    setWorkoutStartTime(Date.now());
    setView('workout');
  };

  const addExerciseToWorkout = (exerciseName) => {
    if (!activeWorkout) return;
    
    const newExercise = {
      id: Date.now() + Math.random(),
      name: exerciseName,
      sets: [],
      notes: ''
    };
    
    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, newExercise]
    });
    setShowExerciseSelect(false);
    setCustomExerciseName('');
  };

  const addSetToExercise = (exerciseId) => {
    const exercise = activeWorkout.exercises.find(ex => ex.id === exerciseId);
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const previousWorkout = getPreviousWorkoutForExercise(exercise.name);
    
    let weight = '';
    let reps = '';
    
    if (lastSet && lastSet.completed) {
      // Use last completed set's data
      weight = lastSet.weight;
      reps = lastSet.reps;
    } else if (previousWorkout) {
      // Use previous workout's data
      weight = previousWorkout.weight;
      reps = previousWorkout.reps;
    }
    
    const newSet = {
      id: Date.now() + Math.random(),
      weight,
      reps,
      completed: false
    };
    
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex =>
        ex.id === exerciseId
          ? { ...ex, sets: [...ex.sets, newSet] }
          : ex
      )
    });
  };

  const updateSet = (exerciseId, setId, field, value) => {
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map(set =>
                set.id === setId ? { ...set, [field]: value } : set
              )
            }
          : ex
      )
    });
  };

  const completeSet = (exerciseId, setId) => {
    const exercise = activeWorkout.exercises.find(ex => ex.id === exerciseId);
    const setToComplete = exercise.sets.find(s => s.id === setId);
    
    if (!setToComplete.weight || !setToComplete.reps) return;
    
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map(set =>
                set.id === setId ? { ...set, completed: true } : set
              )
            }
          : ex
      )
    });
    
    // Start rest timer
    startRestTimer(exercise.name, 90);
  };

  const deleteSet = (exerciseId, setId) => {
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.filter(set => set.id !== setId) }
          : ex
      )
    });
  };

  const deleteExercise = (exerciseId) => {
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.filter(ex => ex.id !== exerciseId)
    });
  };

  const finishWorkout = () => {
    if (!activeWorkout || activeWorkout.exercises.length === 0) return;
    
    // Check if there's a PR
    const prs = checkForPRs(activeWorkout);
    
    const completedWorkout = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration: workoutDuration,
      templateName: activeWorkout.templateName,
      exercises: activeWorkout.exercises.filter(ex => ex.sets.some(set => set.completed)),
      prs: prs
    };
    
    const updatedWorkouts = [completedWorkout, ...workouts];
    setWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);
    
    // Show PR alert if any
    if (prs.length > 0) {
      // Could add a modal/toast here
    }
    
    setActiveWorkout(null);
    setWorkoutStartTime(null);
    setWorkoutDuration(0);
    stopRestTimer();
    setView('home');
  };

  const checkForPRs = (workout) => {
    const prs = [];
    workout.exercises.forEach(exercise => {
      const completedSets = exercise.sets.filter(set => set.completed);
      if (completedSets.length === 0) return;
      
      // Find best set (highest estimated 1RM)
      let bestSet = completedSets[0];
      let bestEstimated1RM = calculateOneRepMax(parseFloat(bestSet.weight), parseInt(bestSet.reps));
      
      completedSets.forEach(set => {
        const estimated1RM = calculateOneRepMax(parseFloat(set.weight), parseInt(set.reps));
        if (estimated1RM > bestEstimated1RM) {
          bestSet = set;
          bestEstimated1RM = estimated1RM;
        }
      });
      
      // Check if it's a PR
      const previousBest = getPersonalRecordForExercise(exercise.name);
      if (!previousBest || bestEstimated1RM > previousBest.estimated1RM) {
        prs.push({
          exercise: exercise.name,
          weight: bestSet.weight,
          reps: bestSet.reps,
          estimated1RM: bestEstimated1RM
        });
      }
    });
    return prs;
  };

  const cancelWorkout = () => {
    if (confirm('Are you sure you want to cancel this workout? All progress will be lost.')) {
      setActiveWorkout(null);
      setWorkoutStartTime(null);
      setWorkoutDuration(0);
      stopRestTimer();
      setView('home');
    }
  };

  const getPreviousWorkoutForExercise = (exerciseName) => {
    for (let workout of workouts) {
      const exercise = workout.exercises.find(ex => ex.name === exerciseName);
      if (exercise && exercise.sets.length > 0) {
        const completedSets = exercise.sets.filter(set => set.completed);
        if (completedSets.length > 0) {
          return completedSets[completedSets.length - 1];
        }
      }
    }
    return null;
  };

  const getPersonalRecordForExercise = (exerciseName) => {
    let best = null;
    workouts.forEach(workout => {
      const exercise = workout.exercises.find(ex => ex.name === exerciseName);
      if (exercise) {
        exercise.sets.forEach(set => {
          if (set.completed && set.weight && set.reps) {
            const estimated1RM = calculateOneRepMax(parseFloat(set.weight), parseInt(set.reps));
            if (!best || estimated1RM > best.estimated1RM) {
              best = {
                weight: parseFloat(set.weight),
                reps: parseInt(set.reps),
                estimated1RM,
                date: workout.date
              };
            }
          }
        });
      }
    });
    return best;
  };

  const getAllPersonalRecords = () => {
    const prs = {};
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          if (set.completed && set.weight && set.reps) {
            const weight = parseFloat(set.weight);
            const reps = parseInt(set.reps);
            const estimated1RM = calculateOneRepMax(weight, reps);
            
            if (!prs[exercise.name] || estimated1RM > prs[exercise.name].estimated1RM) {
              prs[exercise.name] = {
                weight,
                reps,
                estimated1RM,
                date: workout.date,
                muscle: EXERCISE_DATABASE[exercise.name]?.muscle || 'Other'
              };
            }
          }
        });
      });
    });
    
    return Object.entries(prs)
      .map(([exercise, data]) => ({ exercise, ...data }))
      .sort((a, b) => b.estimated1RM - a.estimated1RM);
  };

  const calculateOneRepMax = (weight, reps) => {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30) * 10) / 10;
  };

  const startRestTimer = (exercise, seconds = 90) => {
    setRestTimer(seconds);
    setRestTimerExercise(exercise);
    setRestTimerActive(true);
  };

  const stopRestTimer = () => {
    setRestTimerActive(false);
    setRestTimer(0);
  };

  const addBodyweight = () => {
    if (!newBodyweight) return;
    const entry = {
      date: new Date().toISOString(),
      weight: parseFloat(newBodyweight)
    };
    const updated = [entry, ...bodyweight];
    setBodyweight(updated);
    saveBodyweight(updated);
    setNewBodyweight('');
    setShowBodyweightInput(false);
  };

  const getVolumeByMuscleGroup = (timeFilter = '1week') => {
    const now = new Date();
    const cutoff = new Date();
    
    switch(timeFilter) {
      case '1week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case '1month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        cutoff.setMonth(now.getMonth() - 3);
        break;
      default:
        cutoff.setFullYear(2000);
    }
    
    const volumeByMuscle = {};
    
    workouts.forEach(workout => {
      if (new Date(workout.date) < cutoff) return;
      
      workout.exercises.forEach(exercise => {
        const muscle = EXERCISE_DATABASE[exercise.name]?.muscle || 'Other';
        if (!volumeByMuscle[muscle]) volumeByMuscle[muscle] = 0;
        
        exercise.sets.forEach(set => {
          if (set.completed && set.weight && set.reps) {
            volumeByMuscle[muscle] += parseFloat(set.weight) * parseInt(set.reps);
          }
        });
      });
    });
    
    return Object.entries(volumeByMuscle)
      .map(([muscle, volume]) => ({ muscle, volume: Math.round(volume) }))
      .sort((a, b) => b.volume - a.volume);
  };

  const getProgressData = (muscleFilter, timeFilter) => {
    const now = new Date();
    const cutoff = new Date();
    
    switch(timeFilter) {
      case '1month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        cutoff.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        cutoff.setMonth(now.getMonth() - 6);
        break;
      default:
        cutoff.setFullYear(2000);
    }
    
    const data = [];
    
    workouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      if (workoutDate < cutoff) return;
      
      let totalVolume = 0;
      let total1RM = 0;
      let exerciseCount = 0;
      
      workout.exercises.forEach(exercise => {
        const muscle = EXERCISE_DATABASE[exercise.name]?.muscle || 'Other';
        if (muscleFilter !== 'All' && muscle !== muscleFilter) return;
        
        let best1RM = 0;
        exercise.sets.forEach(set => {
          if (set.completed && set.weight && set.reps) {
            totalVolume += parseFloat(set.weight) * parseInt(set.reps);
            const estimated1RM = calculateOneRepMax(parseFloat(set.weight), parseInt(set.reps));
            if (estimated1RM > best1RM) best1RM = estimated1RM;
          }
        });
        
        if (best1RM > 0) {
          total1RM += best1RM;
          exerciseCount++;
        }
      });
      
      if (exerciseCount > 0) {
        data.push({
          date: workout.date,
          volume: totalVolume,
          avg1RM: Math.round(total1RM / exerciseCount)
        });
      }
    });
    
    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const formatShortDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTotalWorkouts = () => workouts.length;
  const getTotalVolume = () => {
    let volume = 0;
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        ex.sets.forEach(set => {
          if (set.completed && set.weight && set.reps) {
            volume += parseFloat(set.weight) * parseInt(set.reps);
          }
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
    const volumeData = getVolumeByMuscleGroup('1week');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-20">
        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  PR or ER
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">Personal Record or Emergency Room</p>
              </div>
              <Zap className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Start Workout Button */}
          <button
            onClick={() => setShowTemplateSelect(true)}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 py-5 rounded-2xl font-bold text-lg mb-6 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-3 transition-all"
          >
            <Dumbbell className="w-6 h-6" />
            Start New Workout
          </button>

          {/* Quick Stats */}
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
              <div className="text-2xl font-bold text-emerald-400">{getAllPersonalRecords().length}</div>
              <div className="text-xs text-gray-400 mt-1">PRs Set</div>
            </div>
          </div>

          {/* Volume by Muscle Group */}
          {volumeData.length > 0 && (
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Volume This Week
              </h3>
              <div className="space-y-2">
                {volumeData.map(item => (
                  <div key={item.muscle} className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">{item.muscle}</span>
                    <span className="text-sm font-semibold text-emerald-400">{(item.volume / 1000).toFixed(1)}K lbs</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {recentWorkouts.length > 0 && (
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                Recent Activity
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
            <button
              onClick={() => setView('home')}
              className="flex flex-col items-center gap-1 text-emerald-400"
            >
              <Dumbbell className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button
              onClick={() => setView('history')}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300"
            >
              <History className="w-6 h-6" />
              <span className="text-xs">History</span>
            </button>
            <button
              onClick={() => setView('progress')}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Progress</span>
            </button>
            <button
              onClick={() => setView('prs')}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300"
            >
              <Trophy className="w-6 h-6" />
              <span className="text-xs">PRs</span>
            </button>
          </div>
        </div>

        {/* Template Selection Modal */}
        {showTemplateSelect && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
            <div className="bg-slate-900 rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-900 border-b border-gray-800 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Select Workout</h2>
                <button onClick={() => setShowTemplateSelect(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-4">
                <button
                  onClick={() => {
                    startWorkout();
                    setShowTemplateSelect(false);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-medium mb-4"
                >
                  Empty Workout (Build Your Own)
                </button>
                
                <div className="space-y-4">
                  {['PPL', 'Bro Split', 'Arnold Split', 'Full Body', 'Upper/Lower'].map(category => {
                    const categoryTemplates = templates.filter(t => t.category === category);
                    if (categoryTemplates.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">{category}</h3>
                        <div className="space-y-2">
                          {categoryTemplates.map(template => (
                            <button
                              key={template.name}
                              onClick={() => {
                                startWorkout(template);
                                setShowTemplateSelect(false);
                              }}
                              className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-gray-700 p-3 rounded-xl text-left transition"
                            >
                              <div className="font-medium text-emerald-400">{template.name}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                {template.exercises.length} exercises
                              </div>
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
      </div>
    );
  }

  // WORKOUT VIEW
  if (view === 'workout' && activeWorkout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-20">
        {/* Rest Timer Overlay */}
        {restTimerActive && (
          <div className="fixed top-20 left-0 right-0 z-50 mx-4">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-4 shadow-2xl border border-emerald-400">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium">Rest - {restTimerExercise}</div>
                <button onClick={stopRestTimer} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-4xl font-bold text-center">
                {formatDuration(restTimer)}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setRestTimer(prev => prev + 15)}
                  className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium"
                >
                  +15s
                </button>
                <button
                  onClick={() => setRestTimer(prev => prev + 30)}
                  className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium"
                >
                  +30s
                </button>
                <button
                  onClick={stopRestTimer}
                  className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <button onClick={cancelWorkout} className="text-red-400 hover:text-red-300">
                <X className="w-6 h-6" />
              </button>
              <div className="text-center">
                <h2 className="font-bold text-lg">{activeWorkout.templateName}</h2>
                <div className="text-sm text-emerald-400 font-semibold">
                  {formatDuration(workoutDuration)}
                </div>
              </div>
              <button
                onClick={finishWorkout}
                className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-medium"
              >
                Finish
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {/* Exercises */}
          {activeWorkout.exercises.map((exercise, exIndex) => {
            const previousWorkout = getPreviousWorkoutForExercise(exercise.name);
            
            return (
              <div key={exercise.id} className="bg-slate-900/50 border border-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-emerald-400">{exercise.name}</h3>
                    {previousWorkout && (
                      <div className="text-xs text-gray-400 mt-1">
                        Last: {previousWorkout.weight} lbs × {previousWorkout.reps} reps
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteExercise(exercise.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Sets */}
                <div className="space-y-2 mb-3">
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={set.id}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        set.completed
                          ? 'bg-emerald-900/30 border border-emerald-700/50'
                          : 'bg-slate-800/50 border border-gray-700'
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-400 w-8">#{setIndex + 1}</div>
                      
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateSet(exercise.id, set.id, 'weight', e.target.value)}
                        placeholder="Weight"
                        disabled={set.completed}
                        className="flex-1 bg-slate-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50 disabled:bg-slate-800/50"
                      />
                      
                      <span className="text-gray-400">×</span>
                      
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSet(exercise.id, set.id, 'reps', e.target.value)}
                        placeholder="Reps"
                        disabled={set.completed}
                        className="flex-1 bg-slate-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50 disabled:bg-slate-800/50"
                      />
                      
                      {!set.completed ? (
                        <>
                          <button
                            onClick={() => completeSet(exercise.id, set.id)}
                            disabled={!set.weight || !set.reps}
                            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed p-2 rounded-lg"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteSet(exercise.id, set.id)}
                            className="text-gray-400 hover:text-red-400 p-2"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <div className="bg-emerald-600 p-2 rounded-lg">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addSetToExercise(exercise.id)}
                  className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-gray-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Set
                </button>
              </div>
            );
          })}

          {/* Add Exercise Button */}
          <button
            onClick={() => setShowExerciseSelect(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Exercise
          </button>
        </div>

        {/* Exercise Selection Modal */}
        {showExerciseSelect && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
            <div className="bg-slate-900 rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-900 border-b border-gray-800 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Add Exercise</h2>
                <button onClick={() => setShowExerciseSelect(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-4">
                {/* Custom Exercise Input */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={customExerciseName}
                    onChange={(e) => setCustomExerciseName(e.target.value)}
                    placeholder="Custom exercise name..."
                    className="w-full bg-slate-800 border border-gray-700 rounded-lg px-4 py-3 mb-2"
                  />
                  <button
                    onClick={() => {
                      if (customExerciseName.trim()) {
                        addExerciseToWorkout(customExerciseName.trim());
                      }
                    }}
                    disabled={!customExerciseName.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 py-2 rounded-lg font-medium"
                  >
                    Add Custom Exercise
                  </button>
                </div>

                {/* Muscle Group Filter */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'].map(muscle => (
                    <button
                      key={muscle}
                      onClick={() => setSelectedMuscleFilter(muscle)}
                      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                        selectedMuscleFilter === muscle
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-gray-400'
                      }`}
                    >
                      {muscle}
                    </button>
                  ))}
                </div>

                {/* Exercise List */}
                <div className="space-y-2">
                  {Object.keys(EXERCISE_DATABASE)
                    .filter(name => {
                      if (selectedMuscleFilter === 'All') return true;
                      return EXERCISE_DATABASE[name].muscle === selectedMuscleFilter;
                    })
                    .map(name => (
                      <button
                        key={name}
                        onClick={() => addExerciseToWorkout(name)}
                        className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-gray-700 p-3 rounded-xl text-left"
                      >
                        <div className="font-medium">{name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {EXERCISE_DATABASE[name].muscle} • {EXERCISE_DATABASE[name].compound ? 'Compound' : 'Isolation'}
                        </div>
                      </button>
                    ))}
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
                  <button
                    onClick={() => setExpandedWorkout(expandedWorkout === workout.id ? null : workout.id)}
                    className="w-full p-4 flex justify-between items-center hover:bg-slate-800/30"
                  >
                    <div className="text-left">
                      <h3 className="font-semibold text-lg text-emerald-400">{workout.templateName}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-400">{formatDate(workout.date)}</p>
                        <p className="text-xs text-gray-500">{formatDuration(workout.duration)}</p>
                        <p className="text-xs text-emerald-400">{workout.exercises.length} exercises</p>
                      </div>
                    </div>
                    {expandedWorkout === workout.id ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  {expandedWorkout === workout.id && (
                    <div className="px-4 pb-4 space-y-2 border-t border-gray-800 pt-3">
                      {workout.exercises.map(ex => (
                        <div key={ex.id} className="bg-slate-800/50 rounded-lg p-3">
                          <div className="font-medium text-emerald-400 mb-2">{ex.name}</div>
                          <div className="space-y-1">
                            {ex.sets.filter(s => s.completed).map((set, idx) => (
                              <div key={idx} className="text-sm text-gray-300">
                                Set {idx + 1}: {set.weight} lbs × {set.reps} reps
                              </div>
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
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
            <button
              onClick={() => setView('home')}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300"
            >
              <Dumbbell className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => setView('history')}
              className="flex flex-col items-center gap-1 text-emerald-400"
            >
              <History className="w-6 h-6" />
              <span className="text-xs font-medium">History</span>
            </button>
            <button
              onClick={() => setView('progress')}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Progress</span>
            </button>
            <button
              onClick={() => setView('prs')}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300"
            >
              <Trophy className="w-6 h-6" />
              <span className="text-xs">PRs</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PROGRESS VIEW
  if (view === 'progress') {
    const progressData = getProgressData(progressMuscleFilter, progressTimeFilter);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-20">
        <div className="bg-slate-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Progress</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Filters */}
          <div className="mb-6 space-y-3">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Muscle Group</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'].map(muscle => (
                  <button
                    key={muscle}
                    onClick={() => setProgressMuscleFilter(muscle)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                      progressMuscleFilter === muscle
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-gray-400'
                    }`}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-2">Time Period</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { label: '1 Month', value: '1month' },
                  { label: '3 Months', value: '3months' },
                  { label: '6 Months', value: '6months' },
                  { label: 'All Time', value: 'all' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setProgressTimeFilter(option.value)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                      progressTimeFilter === option.value
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Charts */}
          {progressData.length > 0 ? (
            <>
              <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4 mb-4">
                <h3 className="font-semibold mb-4">Average 1RM Progress</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatShortDate}
                      stroke="#94a3b8"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }}
                      labelFormatter={formatDate}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avg1RM" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Avg 1RM (lbs)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-4">
                <h3 className="font-semibold mb-4">Total Volume</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatShortDate}
                      stroke="#94a3b8"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }}
                      labelFormatter={formatDate}
                    />
                    <Bar 
                      dataKey="volume" 
                      fill="#10b981" 
                      radius={[8, 8, 0, 0]}
                      name="Volume (lbs)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-700" />
              <p className="text-gray-400">No progress data yet</p>
              <p className="text-sm text-gray-500 mt-2">Complete more workouts to see your progress!</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
            <button
              onClick={() => setView('home')}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300"
            >
              <Dumbbell className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => setView('history')}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300"
            >
              <History className="w-6 h-6" />
              <span className="text-xs">History</span>
            </button>
            <button
              onClick={() => setView('progress')}
              className="flex flex-col items-center gap-1 text-emerald-400"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-medium">Progress</span>
            </button>
            <button
              onClick={() => setView('prs')}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300"
            >
              <Trophy className="w-6 h-6" />
              <span className="text-xs">PRs</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PRS VIEW (Hall of Pain)
  if (view === 'prs') {
    const prs = getAllPersonalRecords();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white pb-20">
        <div className="bg-slate-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Flame className="w-7 h-7 text-orange-500" />
              Hall of Pain
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
                    <div className="text-sm text-gray-300 mt-1">
                      {pr.weight} lbs × {pr.reps} reps
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(pr.date)} • {pr.muscle}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">{pr.estimated1RM}</div>
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

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
            <button
              onClick={() => setView('home')}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300"
            >
              <Dumbbell className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => setView('history')}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300"
            >
              <History className="w-6 h-6" />
              <span className="text-xs">History</span>
            </button>
            <button
              onClick={() => setView('progress')}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Progress</span>
            </button>
            <button
              onClick={() => setView('prs')}
              className="flex flex-col items-center gap-1 text-emerald-400"
            >
              <Trophy className="w-6 h-6" />
              <span className="text-xs font-medium">PRs</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
