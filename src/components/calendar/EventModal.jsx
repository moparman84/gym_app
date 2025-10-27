import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon, TrophyIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { getAllExerciseNames } from '../../utils/seedCrossfitWorkouts';
import { coolDownExercises } from '../../utils/coolDownExercises';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  start: z.string().min(1, 'Start date is required'),
  end: z.string().min(1, 'End date is required'),
  workoutId: z.string().optional(),
  description: z.string().optional()
});

const EventModal = ({ event, workouts, onSave, onDelete, onClose, onLeaderboard }) => {
  const [lockerWodName, setLockerWodName] = useState(event?.lockerWod?.name || '');
  const [lockerWodDescription, setLockerWodDescription] = useState(event?.lockerWod?.description || '');
  const [lockerWodExercises, setLockerWodExercises] = useState(event?.lockerWod?.exercises || []);
  const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '', weight: '', duration: '', notes: '' });
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(event?.workoutId || '');
  const [mainWorkoutExercises, setMainWorkoutExercises] = useState(event?.mainWorkoutExercises || []);
  const [selectedCoolDowns, setSelectedCoolDowns] = useState(event?.coolDownExercises || []);
  const [exerciseNamesList] = useState(getAllExerciseNames());

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: event || {}
  });

  useEffect(() => {
    reset(event);
    setSelectedWorkoutId(event?.workoutId || '');
    setLockerWodName(event?.lockerWod?.name || '');
    setLockerWodDescription(event?.lockerWod?.description || '');
    setLockerWodExercises(event?.lockerWod?.exercises || []);
    setMainWorkoutExercises(event?.mainWorkoutExercises || []);
    setSelectedCoolDowns(event?.coolDownExercises || []);
  }, [event, reset]);

  // Auto-populate title from selected workout
  const handleWorkoutChange = (workoutId) => {
    setSelectedWorkoutId(workoutId);
    if (workoutId) {
      const selectedWorkout = workouts.find(w => w.id === workoutId);
      if (selectedWorkout) {
        setValue('title', selectedWorkout.name);
        // Populate exercises from the selected workout
        if (selectedWorkout.exercises && Array.isArray(selectedWorkout.exercises)) {
          const exercisesWithIds = selectedWorkout.exercises.map((ex, idx) => ({
            ...ex,
            id: `main-${Date.now()}-${idx}`
          }));
          setMainWorkoutExercises(exercisesWithIds);
        } else {
          setMainWorkoutExercises([]);
        }
      }
    } else {
      setMainWorkoutExercises([]);
    }
  };

  const addExercise = () => {
    if (!newExercise.name) {
      alert('Please enter an exercise name');
      return;
    }
    setLockerWodExercises([...lockerWodExercises, { ...newExercise, id: Date.now() }]);
    setNewExercise({ name: '', sets: '', reps: '', weight: '', duration: '', notes: '' });
  };

  const removeExercise = (id) => {
    setLockerWodExercises(lockerWodExercises.filter(ex => ex.id !== id));
  };

  const updateMainExercise = (id, field, value) => {
    setMainWorkoutExercises(mainWorkoutExercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const toggleCoolDown = (exerciseName) => {
    const exercise = coolDownExercises.find(ex => ex.name === exerciseName);
    if (!exercise) return;
    
    const isSelected = selectedCoolDowns.some(cd => cd.name === exerciseName);
    if (isSelected) {
      setSelectedCoolDowns(selectedCoolDowns.filter(cd => cd.name !== exerciseName));
    } else {
      // Add with a customNote field initialized as empty
      setSelectedCoolDowns([...selectedCoolDowns, { ...exercise, customNote: '' }]);
    }
  };

  const updateCoolDownNote = (exerciseName, note) => {
    setSelectedCoolDowns(selectedCoolDowns.map(cd => 
      cd.name === exerciseName ? { ...cd, customNote: note } : cd
    ));
  };

  const onSubmit = (data) => {
    const eventData = {
      ...data,
      end: data.start, // Training sessions are same-day events
      backgroundColor: data.workoutId 
        ? workouts.find(w => w.id === data.workoutId)?.color || '#3788d8'
        : '#3788d8'
    };

    // Add main workout exercises (with any edits)
    if (mainWorkoutExercises.length > 0) {
      eventData.mainWorkoutExercises = mainWorkoutExercises;
    }

    // Add Locker WOD if there are exercises
    if (lockerWodExercises.length > 0 || lockerWodName) {
      eventData.lockerWod = {
        name: lockerWodName || 'Locker WOD',
        description: lockerWodDescription,
        exercises: lockerWodExercises
      };
    } else {
      eventData.lockerWod = null;
    }

    // Add cool down exercises
    if (selectedCoolDowns.length > 0) {
      eventData.coolDownExercises = selectedCoolDowns;
    }

    onSave(eventData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {event?.id ? 'Edit Training Session' : 'New Training Session'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Date and Time Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="start" className="block text-sm font-medium text-gray-700">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="start"
                      {...register('start')}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.start && (
                      <p className="mt-1 text-sm text-red-600">{errors.start.message}</p>
                    )}
                  </div>

                  <div className="hidden">
                    <input type="date" {...register('end')} />
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Training Name *
                    </label>
                    <input
                      type="text"
                      id="title"
                      {...register('title')}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Auto-filled from workout"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <input
                      type="text"
                      id="description"
                      {...register('description')}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Optional notes..."
                    />
                  </div>
                </div>
              </div>

              {/* Three Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Training Section - LEFT SIDE */}
                <div className="border-2 border-primary-200 rounded-lg p-5 bg-primary-50">
                  <h4 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2">
                    <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                    Main Training
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="workoutId" className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Workout from Library *
                      </label>
                      <select
                        id="workoutId"
                        {...register('workoutId')}
                        value={selectedWorkoutId}
                        onChange={(e) => handleWorkoutChange(e.target.value)}
                        className="block w-full border-2 border-primary-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                      >
                        <option value="">Choose a workout...</option>
                        {[...workouts].sort((a, b) => a.name.localeCompare(b.name)).map(workout => (
                          <option key={workout.id} value={workout.id}>
                            {workout.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-xs text-gray-600">Training name will auto-populate from selected workout</p>
                    </div>

                    {/* Exercises from selected workout */}
                    {mainWorkoutExercises.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Exercises (editable)
                        </label>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {mainWorkoutExercises.map((exercise, index) => (
                            <div key={exercise.id} className="p-3 bg-white border border-primary-200 rounded-lg">
                              <div className="mb-2 flex items-center gap-2">
                                <span className="font-bold text-primary-600 text-sm">{index + 1}.</span>
                                <p className="font-medium text-gray-900 flex-1">{exercise.name}</p>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <div>
                                  <label className="text-xs text-gray-500">Sets</label>
                                  <input
                                    type="text"
                                    value={exercise.sets || ''}
                                    onChange={(e) => updateMainExercise(exercise.id, 'sets', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="Sets"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">Reps/Distance</label>
                                  <input
                                    type="text"
                                    value={exercise.reps || ''}
                                    onChange={(e) => updateMainExercise(exercise.id, 'reps', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="Reps/Distance"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <label className="text-xs text-gray-500">Notes</label>
                                  <input
                                    type="text"
                                    value={exercise.notes || ''}
                                    onChange={(e) => updateMainExercise(exercise.id, 'notes', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="Notes"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Locker WOD Section - RIGHT SIDE */}
                <div className="border-2 border-orange-200 rounded-lg p-5 bg-orange-50">
                  <h4 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                    <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                    Locker WOD (Optional)
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">Bonus workout for this day only. Won't be saved to library.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Workout Name
                      </label>
                      <input
                        type="text"
                        value={lockerWodName}
                        onChange={(e) => setLockerWodName(e.target.value)}
                        className="block w-full border-2 border-orange-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                        placeholder="e.g., Burpee Challenge"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={lockerWodDescription}
                        onChange={(e) => setLockerWodDescription(e.target.value)}
                        className="block w-full border-2 border-orange-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                        placeholder="Quick description..."
                      />
                    </div>

                    {/* Exercise List */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Exercises
                      </label>
                      <div className="space-y-2 mb-3">
                        {lockerWodExercises.map((exercise) => (
                          <div key={exercise.id} className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{exercise.name}</p>
                              <p className="text-sm text-gray-600">
                                {exercise.sets && `${exercise.sets} sets `}
                                {exercise.reps && `× ${exercise.reps} reps `}
                                {exercise.weight && `@ ${exercise.weight} `}
                                {exercise.duration && `for ${exercise.duration}`}
                              </p>
                              {exercise.notes && <p className="text-xs text-gray-500 italic">{exercise.notes}</p>}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExercise(exercise.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Exercise Form */}
                      <div className="p-4 bg-white border-2 border-orange-200 rounded-lg space-y-3">
                        <div>
                          <select
                            value={newExercise.name}
                            onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                            className="block w-full border-2 border-orange-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                          >
                            <option value="">Select exercise name *</option>
                            {exerciseNamesList.map((name, idx) => (
                              <option key={idx} value={name}>
                                {name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <input
                            type="text"
                            placeholder="Sets"
                            value={newExercise.sets}
                            onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Reps/Distance"
                            value={newExercise.reps}
                            onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Weight"
                            value={newExercise.weight}
                            onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Duration"
                            value={newExercise.duration}
                            onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })}
                            className="border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Notes (optional)"
                          value={newExercise.notes}
                          onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                          className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button
                          type="button"
                          onClick={addExercise}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                        >
                          <PlusIcon className="h-5 w-5" />
                          Add Exercise
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cool Down Section - THIRD COLUMN */}
                <div className="border-2 border-green-200 rounded-lg p-5 bg-green-50">
                  <h4 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                    Cool Down (Optional)
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">Select stretches and cool down exercises for recovery.</p>
                  
                  <div className="space-y-4">
                    {/* Selected Cool Downs */}
                    {selectedCoolDowns.length > 0 && (
                      <div className="mb-3">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Selected ({selectedCoolDowns.length})
                        </label>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {selectedCoolDowns.map((exercise, idx) => (
                            <div key={idx} className="p-3 bg-green-100 border border-green-300 rounded">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900 text-sm">{exercise.name}</span>
                                <button
                                  type="button"
                                  onClick={() => toggleCoolDown(exercise.name)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="text-xs text-green-700 mb-2">
                                Default: {exercise.duration}
                              </div>
                              <input
                                type="text"
                                placeholder="Custom time/distance (e.g., '2 min', '400m')"
                                value={exercise.customNote || ''}
                                onChange={(e) => updateCoolDownNote(exercise.name, e.target.value)}
                                className="w-full text-sm border border-green-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cool Down Categories */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Available Exercises
                      </label>
                      <div className="max-h-96 overflow-y-auto space-y-3">
                        {/* Static Stretches */}
                        <div>
                          <p className="text-xs font-semibold text-purple-700 mb-1">Static Stretches</p>
                          <div className="space-y-1">
                            {coolDownExercises.filter(ex => ex.category === 'static_stretch').slice(0, 8).map((exercise, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => toggleCoolDown(exercise.name)}
                                className={`w-full text-left px-3 py-2 text-sm rounded border ${
                                  selectedCoolDowns.some(cd => cd.name === exercise.name)
                                    ? 'bg-green-200 border-green-400 font-semibold'
                                    : 'bg-white border-purple-200 hover:bg-purple-50'
                                }`}
                              >
                                {exercise.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Active Recovery */}
                        <div>
                          <p className="text-xs font-semibold text-green-700 mb-1">Active Recovery</p>
                          <div className="space-y-1">
                            {coolDownExercises.filter(ex => ex.category === 'active_recovery').map((exercise, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => toggleCoolDown(exercise.name)}
                                className={`w-full text-left px-3 py-2 text-sm rounded border ${
                                  selectedCoolDowns.some(cd => cd.name === exercise.name)
                                    ? 'bg-green-200 border-green-400 font-semibold'
                                    : 'bg-white border-green-200 hover:bg-green-50'
                                }`}
                              >
                                {exercise.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Foam Rolling */}
                        <div>
                          <p className="text-xs font-semibold text-blue-700 mb-1">Foam Rolling</p>
                          <div className="space-y-1">
                            {coolDownExercises.filter(ex => ex.category === 'mobility').map((exercise, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => toggleCoolDown(exercise.name)}
                                className={`w-full text-left px-3 py-2 text-sm rounded border ${
                                  selectedCoolDowns.some(cd => cd.name === exercise.name)
                                    ? 'bg-green-200 border-green-400 font-semibold'
                                    : 'bg-white border-blue-200 hover:bg-blue-50'
                                }`}
                              >
                                {exercise.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Breathing */}
                        <div>
                          <p className="text-xs font-semibold text-indigo-700 mb-1">Breathing & Relaxation</p>
                          <div className="space-y-1">
                            {coolDownExercises.filter(ex => ex.category === 'breathing' || ex.category === 'relaxation').map((exercise, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => toggleCoolDown(exercise.name)}
                                className={`w-full text-left px-3 py-2 text-sm rounded border ${
                                  selectedCoolDowns.some(cd => cd.name === exercise.name)
                                    ? 'bg-green-200 border-green-400 font-semibold'
                                    : 'bg-white border-indigo-200 hover:bg-indigo-50'
                                }`}
                              >
                                {exercise.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-col sm:flex-row sm:justify-between gap-2">
              <div className="flex gap-2">
                {event?.id && onLeaderboard && (
                  <button
                    type="button"
                    onClick={onLeaderboard}
                    className="inline-flex items-center justify-center rounded-lg border border-yellow-500 shadow-sm px-4 py-2 bg-yellow-50 text-base font-medium text-yellow-700 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:text-sm"
                  >
                    <TrophyIcon className="h-4 w-4 mr-2" />
                    Manage Leaderboards
                  </button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                >
                  Save
                </button>
                {event?.id && (
                  <button
                    type="button"
                    onClick={onDelete}
                    className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
