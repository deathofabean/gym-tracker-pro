import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Plus, History, TrendingUp, X, Check, Trophy, Calendar, BarChart3, Calculator, ChevronRight, ChevronDown, Play, Pause, Clock, Copy, Edit2, Save, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GetPhockingRipped() {
  const [view, setView] = useState('log');
  const [exercises, setExercises] = useState([
    'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 
    'Barbell Row', 'Pull-ups', 'Dips', 'Bicep Curls',
    'Tricep Extensions', 'Lateral Raises', 'Leg Press', 'Romanian Deadlift',
    'Incline Bench Press', 'Front Squat', 'Lunges', 'Leg Curls'
  ]);
  const [workouts, setWorkouts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [customExercise, setCustomExercise] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedExerciseForProgress, setSelectedExerciseForProgress] = useState('');
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  
  // Rest timer state
  const [restTimer, setRestTimer] = useState(0);
  const [restTimerActive, setRestTimerActive] = useState(false);
  const [restTimerExercise, setRestTimerExercise] = useState('');
  const restTimerInterval = useRef(null);
  
  // Template management
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  
  // Calculator state
  const [calcWeight, setCalcWeight] = useState('');
  const [calcReps, setCalcReps] = useState('');
  const [oneRepMax, setOneRepMax] = useState(null);

  // Workout duration timer
  useEffect(() => {
    let interval;
    if (workoutStartTime && currentWorkout.length > 0) {
      interval = setInterval(() => {
        setWorkoutDuration(Math.floor((Date.now() - workoutStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutStartTime, currentWorkout.length]);

  // Rest timer countdown
  useEffect(() => {
    if (restTimerActive && restTimer > 0) {
      restTimerInterval.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setRestTimerActive(false);
            // Play a sound or notification here
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const workoutsResult = await window.storage.get('phocking-workouts', false);
      const exercisesResult = await window.storage.get('phocking-exercises', false);
      const templatesResult = await window.storage.get('phocking-templates', false);
      
      if (workoutsResult?.value) {
        setWorkouts(JSON.parse(workoutsResult.value));
      }
      if (exercisesResult?.value) {
        setExercises(JSON.parse(exercisesResult.value));
      }
      if (templatesResult?.value) {
        setTemplates(JSON.parse(templatesResult.value));
      }
    } catch (error) {
      console.log('No existing data found, starting fresh');
    }
    setLoading(false);
  };

  const saveWorkouts = async (updatedWorkouts) => {
    try {
      await window.storage.set('phocking-workouts', JSON.stringify(updatedWorkouts), false);
    } catch (error) {
      console.error('Failed to save workouts:', error);
    }
  };

  const saveExercises = async (updatedExercises) => {
    try {
      await window.storage.set('phocking-exercises', JSON.stringify(updatedExercises), false);
    } catch (error) {
      console.error('Failed to save exercises:', error);
    }
  };

  const saveTemplates = async (updatedTemplates) => {
    try {
      await window.storage.set('phocking-templates', JSON.stringify(updatedTemplates), false);
    } catch (error) {
      console.error('Failed to save templates:', error);
    }
  };

  const addSet = () => {
    if (!selectedExercise && !customExercise) return;
    
    const exercise = customExercise || selectedExercise;
    
    if (customExercise && !exercises.includes(customExercise)) {
      const updatedExercises = [...exercises, customExercise].sort();
      setExercises(updatedExercises);
      saveExercises(updatedExercises);
    }
    
    const lastEntry = getLastEntryForExercise(exercise);
    
    // Start workout timer if first exercise
    if (currentWorkout.length === 0) {
      setWorkoutStartTime(Date.now());
    }
    
    setCurrentWorkout([...currentWorkout, {
      id: Date.now(),
      exercise,
      sets: 1,
      reps: lastEntry?.reps || '',
      weight: lastEntry?.weight || ''
    }]);
    
    setCustomExercise('');
    setShowCustomInput(false);
  };

  const getLastEntryForExercise = (exerciseName) => {
    for (let workout of workouts) {
      const entry = workout.exercises.find(ex => ex.exercise === exerciseName);
      if (entry && entry.weight && entry.reps) {
        return entry;
      }
    }
    return null;
  };

  const updateSet = (id, field, value) => {
    setCurrentWorkout(currentWorkout.map(set =>
      set.id === id ? { ...set, [field]: value } : set
    ));
  };

  const removeSet = (id) => {
    setCurrentWorkout(currentWorkout.filter(set => set.id !== id));
    if (currentWorkout.length === 1) {
      setWorkoutStartTime(null);
      setWorkoutDuration(0);
    }
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

  const finishWorkout = () => {
    if (currentWorkout.length === 0) return;
    
    const workout = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration: workoutDuration,
      exercises: currentWorkout
    };
    
    const updatedWorkouts = [workout, ...workouts];
    setWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);
    setCurrentWorkout([]);
    setWorkoutStartTime(null);
    setWorkoutDuration(0);
    stopRestTimer();
  };

  const saveAsTemplate = () => {
    if (!templateName.trim() || currentWorkout.length === 0) return;
    
    const template = {
      id: Date.now(),
      name: templateName,
      exercises: currentWorkout.map(ex => ({
        exercise: ex.exercise,
        sets: ex.sets
      }))
    };
    
    const updatedTemplates = [...templates, template];
    setTemplates(updatedTemplates);
    saveTemplates(updatedTemplates);
    setTemplateName('');
    setShowSaveTemplate(false);
  };

  const loadTemplate = (template) => {
    const loadedWorkout = template.exercises.map(ex => {
      const lastEntry = getLastEntryForExercise(ex.exercise);
      return {
        id: Date.now() + Math.random(),
        exercise: ex.exercise,
        sets: ex.sets,
        reps: lastEntry?.reps || '',
        weight: lastEntry?.weight || ''
      };
    });
    
    setCurrentWorkout(loadedWorkout);
    setWorkoutStartTime(Date.now());
    setShowTemplates(false);
  };

  const deleteTemplate = (id) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    saveTemplates(updatedTemplates);
  };

  const deleteWorkout = (id) => {
    const updatedWorkouts = workouts.filter(w => w.id !== id);
    setWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);
  };

  const getExerciseHistory = (exerciseName) => {
    const history = [];
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        if (ex.exercise === exerciseName && ex.weight && ex.reps) {
          history.push({
            date: workout.date,
            weight: parseFloat(ex.weight),
            reps: parseInt(ex.reps),
            sets: ex.sets,
            volume: parseFloat(ex.weight) * parseInt(ex.reps) * ex.sets,
            estimated1RM: calculateOneRepMax(parseFloat(ex.weight), parseInt(ex.reps))
          });
        }
      });
    });
    return history.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getAllPersonalRecords = () => {
    const prs = {};
    
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        if (ex.weight && ex.reps) {
          const weight = parseFloat(ex.weight);
          const reps = parseInt(ex.reps);
          const estimated1RM = calculateOneRepMax(weight, reps);
          
          if (!prs[ex.exercise] || estimated1RM > prs[ex.exercise].estimated1RM) {
            prs[ex.exercise] = {
              weight,
              reps,
              sets: ex.sets,
              estimated1RM,
              date: workout.date
            };
          }
        }
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

  const calculate1RM = () => {
    const weight = parseFloat(calcWeight);
    const reps = parseInt(calcReps);
    
    if (weight && reps && reps > 0) {
      const result = calculateOneRepMax(weight, reps);
      setOneRepMax(result);
    }
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

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalWorkouts = () => workouts.length;
  
  const getTotalVolume = () => {
    let volume = 0;
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        if (ex.weight && ex.reps && ex.sets) {
          volume += parseFloat(ex.weight) * parseInt(ex.reps) * ex.sets;
        }
      });
    });
    return Math.round(volume);
  };

  const getUniqueExercisesCount = () => {
    const uniqueExercises = new Set();
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        uniqueExercises.add(ex.exercise);
      });
    });
    return uniqueExercises.size;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-slate-900 text-white pb-20">
      {/* Rest Timer Overlay */}
      {restTimerActive && (
        <div className="fixed top-20 left-0 right-0 z-50 mx-4">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-4 shadow-2xl border-2 border-orange-400">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Rest Timer - {restTimerExercise}</div>
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
      <div className="bg-slate-900/80 backdrop-blur-lg border-b border-red-900/30 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-5xl">🍜</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  Get Phocking Ripped
                </h1>
                <p className="text-xs text-slate-400">Noodle your way to gains</p>
              </div>
            </div>
            {workoutStartTime && currentWorkout.length > 0 && (
              <div className="text-right">
                <div className="text-xs text-slate-400">Workout Time</div>
                <div className="text-xl font-bold text-orange-400">
                  {formatDuration(workoutDuration)}
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setView('log')}
              className={`py-2.5 px-2 rounded-lg font-medium transition-all ${
                view === 'log' 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <Plus className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Log</span>
            </button>
            <button
              onClick={() => setView('history')}
              className={`py-2.5 px-2 rounded-lg font-medium transition-all ${
                view === 'history' 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <History className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">History</span>
            </button>
            <button
              onClick={() => setView('progress')}
              className={`py-2.5 px-2 rounded-lg font-medium transition-all ${
                view === 'progress' 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <TrendingUp className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Progress</span>
            </button>
            <button
              onClick={() => setView('calculator')}
              className={`py-2.5 px-2 rounded-lg font-medium transition-all ${
                view === 'calculator' 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <Calculator className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">1RM</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {view === 'log' && (
          <div>
            {/* Quick Stats */}
            {workouts.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-3">
                  <Calendar className="w-5 h-5 text-red-400 mb-1" />
                  <div className="text-2xl font-bold">{getTotalWorkouts()}</div>
                  <div className="text-xs text-slate-400">Bowls Served</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-3">
                  <Dumbbell className="w-5 h-5 text-orange-400 mb-1" />
                  <div className="text-2xl font-bold">{getTotalVolume().toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Total lbs</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-3">
                  <Trophy className="w-5 h-5 text-green-400 mb-1" />
                  <div className="text-2xl font-bold">{getUniqueExercisesCount()}</div>
                  <div className="text-xs text-slate-400">Recipes</div>
                </div>
              </div>
            )}

            {/* Templates Section */}
            {templates.length > 0 && !showTemplates && (
              <button
                onClick={() => setShowTemplates(true)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 mb-4 flex items-center justify-between hover:bg-slate-700/50 transition"
              >
                <div className="flex items-center gap-2">
                  <Copy className="w-5 h-5 text-orange-400" />
                  <span className="font-medium">Load Saved Recipe</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            )}

            {showTemplates && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Copy className="w-5 h-5 text-orange-400" />
                    Saved Recipes
                  </h3>
                  <button onClick={() => setShowTemplates(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <div className="space-y-2">
                  {templates.map(template => (
                    <div key={template.id} className="bg-slate-700/50 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-orange-400">{template.name}</div>
                        <div className="text-xs text-slate-400">{template.exercises.length} exercises</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadTemplate(template)}
                          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exercise Selection */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-4 shadow-lg">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-400" />
                Add Ingredient
              </h2>
              
              {!showCustomInput ? (
                <>
                  <select
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-3 mb-3 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  >
                    <option value="">Select an exercise...</option>
                    {exercises.map(ex => (
                      <option key={ex} value={ex}>{ex}</option>
                    ))}
                  </select>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={addSet}
                      disabled={!selectedExercise}
                      className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed py-3 rounded-lg font-medium transition-all shadow-lg shadow-red-500/20"
                    >
                      Add to Bowl
                    </button>
                    <button
                      onClick={() => setShowCustomInput(true)}
                      className="px-6 bg-slate-700/70 hover:bg-slate-600/70 rounded-lg transition-all border border-slate-600/50"
                    >
                      Custom
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={customExercise}
                    onChange={(e) => setCustomExercise(e.target.value)}
                    placeholder="Enter custom exercise name..."
                    className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-3 mb-3 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addSet}
                      disabled={!customExercise.trim()}
                      className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed py-3 rounded-lg font-medium transition-all shadow-lg shadow-red-500/20"
                    >
                      Add to Bowl
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomExercise('');
                      }}
                      className="px-6 bg-slate-700/70 hover:bg-slate-600/70 rounded-lg transition-all border border-slate-600/50"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Current Workout */}
            {currentWorkout.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-4 shadow-lg">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-green-400" />
                    Current Bowl
                  </h2>
                  {!showSaveTemplate && (
                    <button
                      onClick={() => setShowSaveTemplate(true)}
                      className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
                    >
                      <Save className="w-4 h-4" />
                      Save Recipe
                    </button>
                  )}
                </div>

                {showSaveTemplate && (
                  <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Recipe name (e.g., Push Day, Leg Day)..."
                      className="w-full bg-slate-600/50 border border-slate-500/30 rounded-lg px-3 py-2 text-white mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveAsTemplate}
                        disabled={!templateName.trim()}
                        className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-slate-600 py-2 rounded-lg text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setShowSaveTemplate(false);
                          setTemplateName('');
                        }}
                        className="px-4 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  {currentWorkout.map((set, index) => {
                    const lastEntry = getLastEntryForExercise(set.exercise);
                    return (
                      <div key={set.id} className="bg-gradient-to-r from-slate-700/50 to-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="font-semibold text-orange-400">{set.exercise}</span>
                            {lastEntry && (
                              <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Last: {lastEntry.sets} × {lastEntry.reps} @ {lastEntry.weight} lbs
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeSet(set.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Sets</label>
                            <input
                              type="number"
                              value={set.sets}
                              onChange={(e) => updateSet(set.id, 'sets', e.target.value)}
                              className="w-full bg-slate-600/50 border border-slate-500/30 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Reps</label>
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) => updateSet(set.id, 'reps', e.target.value)}
                              className="w-full bg-slate-600/50 border border-slate-500/30 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Weight (lbs)</label>
                            <input
                              type="number"
                              value={set.weight}
                              onChange={(e) => updateSet(set.id, 'weight', e.target.value)}
                              className="w-full bg-slate-600/50 border border-slate-500/30 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                              placeholder="0"
                              step="0.5"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => startRestTimer(set.exercise, 90)}
                          className="w-full bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
                        >
                          <Clock className="w-4 h-4" />
                          Start Rest Timer (90s)
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={finishWorkout}
                  className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 py-3.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                >
                  <Check className="w-5 h-5" />
                  Finish & Serve
                </button>
              </div>
            )}

            {currentWorkout.length === 0 && (
              <div className="text-center text-slate-400 py-12">
                <div className="text-6xl mb-4">🍜</div>
                <p className="text-lg font-medium mb-2">Your bowl is empty!</p>
                <p className="text-sm">Add some ingredients above to start cooking</p>
              </div>
            )}
          </div>
        )}

        {view === 'history' && (
          <div>
            {workouts.length > 0 ? (
              <div className="space-y-3">
                {workouts.map(workout => (
                  <div key={workout.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shadow-lg">
                    <button
                      onClick={() => setExpandedWorkout(expandedWorkout === workout.id ? null : workout.id)}
                      className="w-full p-4 flex justify-between items-center hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="text-left">
                        <h3 className="font-semibold text-lg">{formatDate(workout.date)}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-slate-400">
                            {new Date(workout.date).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit'
                            })}
                          </p>
                          {workout.duration && (
                            <p className="text-xs text-orange-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(workout.duration)}
                            </p>
                          )}
                          <p className="text-xs text-red-400">
                            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteWorkout(workout.id);
                          }}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        {expandedWorkout === workout.id ? (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {expandedWorkout === workout.id && (
                      <div className="px-4 pb-4 space-y-2 border-t border-slate-700/50 pt-3">
                        {workout.exercises.map(ex => {
                          const estimated1RM = calculateOneRepMax(parseFloat(ex.weight), parseInt(ex.reps));
                          return (
                            <div key={ex.id} className="bg-gradient-to-r from-slate-700/50 to-slate-700/30 border border-slate-600/30 rounded-lg p-3">
                              <div className="font-medium text-orange-400 mb-1.5">{ex.exercise}</div>
                              <div className="flex justify-between items-center">
                                <div className="text-sm text-slate-300">
                                  {ex.sets} × {ex.reps} reps @ {ex.weight} lbs
                                </div>
                                <div className="text-xs text-slate-400">
                                  Est. 1RM: {estimated1RM} lbs
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-12">
                <div className="text-6xl mb-4">📖</div>
                <p className="text-lg font-medium mb-2">No recipes in the cookbook yet</p>
                <p className="text-sm">Complete your first workout to see it here!</p>
              </div>
            )}
          </div>
        )}

        {view === 'progress' && (
          <div>
            {/* Personal Records */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-4 shadow-lg">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Hall of Flame
              </h2>
              
              {getAllPersonalRecords().length > 0 ? (
                <div className="space-y-2">
                  {getAllPersonalRecords().slice(0, 5).map((pr, index) => (
                    <div key={pr.exercise} className="bg-gradient-to-r from-slate-700/50 to-slate-700/30 border border-slate-600/30 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-orange-400">{pr.exercise}</div>
                        <div className="text-sm text-slate-300 mt-0.5">
                          {pr.sets} × {pr.reps} @ {pr.weight} lbs
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {formatDate(pr.date)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-yellow-400">{pr.estimated1RM}</div>
                        <div className="text-xs text-slate-400">Est. 1RM</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-6">
                  <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Complete workouts to earn your flames</p>
                </div>
              )}
            </div>

            {/* Exercise Progress Chart */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-red-400" />
                Strength Broth
              </h2>
              
              <select
                value={selectedExerciseForProgress}
                onChange={(e) => setSelectedExerciseForProgress(e.target.value)}
                className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-3 mb-4 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              >
                <option value="">Select an exercise to view progress...</option>
                {exercises.map(ex => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>

              {selectedExerciseForProgress && getExerciseHistory(selectedExerciseForProgress).length > 0 ? (
                <>
                  <div className="mb-4">
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={getExerciseHistory(selectedExerciseForProgress)}>
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
                          labelFormatter={(value) => formatDate(value)}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="estimated1RM" 
                          stroke="#fb923c" 
                          strokeWidth={3}
                          dot={{ fill: '#fb923c', r: 4 }}
                          activeDot={{ r: 6 }}
                          name="Est. 1RM (lbs)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {getExerciseHistory(selectedExerciseForProgress).reverse().map((entry, index) => (
                      <div key={index} className="bg-gradient-to-r from-slate-700/50 to-slate-700/30 border border-slate-600/30 rounded-lg p-3 flex justify-between items-center text-sm">
                        <div>
                          <div className="text-slate-300">{formatDate(entry.date)}</div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {entry.sets} × {entry.reps} @ {entry.weight} lbs
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-orange-400">{entry.estimated1RM}</div>
                          <div className="text-xs text-slate-400">Est. 1RM</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : selectedExerciseForProgress ? (
                <div className="text-center text-slate-400 py-8">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No data yet for this ingredient</p>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {view === 'calculator' && (
          <div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-lg">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-green-400" />
                Spice Calculator
              </h2>
              <p className="text-sm text-slate-400 mb-5">Calculate your estimated 1RM to season your training</p>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-sm text-slate-300 block mb-2 font-medium">Weight (lbs)</label>
                  <input
                    type="number"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(e.target.value)}
                    placeholder="Enter weight..."
                    className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-3 text-white text-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2 font-medium">Reps Completed</label>
                  <input
                    type="number"
                    value={calcReps}
                    onChange={(e) => setCalcReps(e.target.value)}
                    placeholder="Enter reps..."
                    className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-3 text-white text-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    min="1"
                  />
                </div>

                <button
                  onClick={calculate1RM}
                  disabled={!calcWeight || !calcReps}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed py-3.5 rounded-lg font-semibold transition-all shadow-lg shadow-red-500/30"
                >
                  Calculate Heat Level
                </button>
              </div>

              {oneRepMax !== null && (
                <div className="bg-gradient-to-br from-red-500/20 to-orange-600/20 border border-red-500/40 rounded-xl p-6 text-center">
                  <div className="text-sm text-slate-300 mb-2">Estimated One Rep Max</div>
                  <div className="text-5xl font-bold text-red-400 mb-1">{oneRepMax}</div>
                  <div className="text-slate-400">lbs of pure heat 🌶️</div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-600">
                    <div className="text-xs text-slate-400 mb-3">Seasoning Levels</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400">90% (Strength)</div>
                        <div className="text-lg font-semibold text-slate-200">{Math.round(oneRepMax * 0.9)} lbs</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400">80% (Power)</div>
                        <div className="text-lg font-semibold text-slate-200">{Math.round(oneRepMax * 0.8)} lbs</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400">70% (Hypertrophy)</div>
                        <div className="text-lg font-semibold text-slate-200">{Math.round(oneRepMax * 0.7)} lbs</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400">60% (Endurance)</div>
                        <div className="text-lg font-semibold text-slate-200">{Math.round(oneRepMax * 0.6)} lbs</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 text-xs text-slate-400 bg-slate-700/30 rounded-lg p-3">
                <strong className="text-slate-300">Note:</strong> Uses the Epley formula (1RM = weight × (1 + reps/30)). Results are estimates based on your pho-tential!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
