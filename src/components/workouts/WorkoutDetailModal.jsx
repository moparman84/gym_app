import { useState } from 'react';
import { XMarkIcon, FireIcon } from '@heroicons/react/24/outline';
import { coolDownExercises, coolDownRoutines } from '../../utils/coolDownExercises';

const WorkoutDetailModal = ({ workout, onClose }) => {
  const [activeTab, setActiveTab] = useState('workout');
  
  if (!workout) return null;

  const categoryColors = {
    benchmark: 'bg-blue-100 text-blue-800 border-blue-300',
    hero: 'bg-red-100 text-red-800 border-red-300',
    strength: 'bg-purple-100 text-purple-800 border-purple-300',
    emom: 'bg-green-100 text-green-800 border-green-300',
    metcon: 'bg-orange-100 text-orange-800 border-orange-300',
    bodyweight: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    partner: 'bg-pink-100 text-pink-800 border-pink-300',
    chipper: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  };

  const getCategoryLabel = (category) => {
    const labels = {
      benchmark: 'Benchmark WOD',
      hero: 'Hero WOD',
      strength: 'Strength',
      emom: 'EMOM',
      metcon: 'MetCon',
      bodyweight: 'Bodyweight',
      partner: 'Partner',
      chipper: 'Chipper'
    };
    return labels[category] || 'Workout';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FireIcon className="h-8 w-8 text-white" />
                  <h2 className="text-2xl font-bold text-white">
                    {workout.name}
                  </h2>
                </div>
                {workout.category && (
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${categoryColors[workout.category] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                    {getCategoryLabel(workout.category)}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gray-100 border-b border-gray-200">
            <div className="px-6">
              <nav className="flex -mb-px space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('workout')}
                  className={`${
                    activeTab === 'workout'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                  Workout
                </button>
                <button
                  onClick={() => setActiveTab('cooldown')}
                  className={`${
                    activeTab === 'cooldown'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                  Cool Down & Stretches
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-6">
            {activeTab === 'workout' ? (
              <>
                {/* Description */}
                {workout.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {workout.description}
                    </p>
                  </div>
                )}

                {/* Exercises */}
                {workout.exercises && workout.exercises.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Exercises ({workout.exercises.length})
                    </h3>
                    <div className="space-y-3">
                      {workout.exercises.map((exercise, index) => (
                        <div 
                          key={index} 
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            {/* Exercise Number */}
                            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </div>

                            {/* Exercise Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                {exercise.name}
                              </h4>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                {exercise.sets && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-500">Sets:</span>
                                    <span className="text-gray-900 font-semibold">{exercise.sets}</span>
                                  </div>
                                )}
                                
                                {exercise.reps && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-500">Reps:</span>
                                    <span className="text-gray-900 font-semibold">{exercise.reps}</span>
                                  </div>
                                )}
                                
                                {exercise.notes && (
                                  <div className="sm:col-span-3 flex items-start gap-2 mt-1">
                                    <span className="font-medium text-gray-500">Notes:</span>
                                    <span className="text-gray-700 italic">{exercise.notes}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {workout.createdAt && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">Created:</span> {new Date(workout.createdAt).toLocaleDateString()}
                      </div>
                      {workout.source === 'crossfit_seed' && (
                        <div>
                          <span className="font-medium">Source:</span> CrossFit Official
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Cool Down Tab Content */}
                <div className="space-y-6">
                  {/* Introduction */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Post-Workout Cool Down
                    </h3>
                    <p className="text-sm text-blue-800">
                      Proper cool down helps reduce muscle soreness, improve flexibility, and speed up recovery. 
                      Take 10-20 minutes to stretch and relax after your workout.
                    </p>
                  </div>

                  {/* Pre-defined Routines */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Recommended Cool Down Routines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {Object.values(coolDownRoutines).map((routine, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-1">{routine.name}</h4>
                          <p className="text-xs text-green-700 font-medium mb-2">⏱️ {routine.duration}</p>
                          <p className="text-sm text-gray-600 mb-3">{routine.description}</p>
                          <div className="text-xs text-gray-500">
                            {routine.exercises.length} exercises included
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* All Cool Down Exercises by Category */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      All Cool Down Exercises ({coolDownExercises.length})
                    </h3>
                    
                    {/* Static Stretches */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Static Stretches
                      </h4>
                      <div className="space-y-3">
                        {coolDownExercises.filter(ex => ex.category === 'static_stretch').map((exercise, index) => (
                          <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-semibold text-gray-900">{exercise.name}</h5>
                              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                                {exercise.duration}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{exercise.description}</p>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="text-gray-500">Target:</span>
                              {exercise.targetMuscles.map((muscle, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white border border-purple-200 rounded text-gray-700">
                                  {muscle}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Stretches */}
                    {coolDownExercises.filter(ex => ex.category === 'dynamic_stretch').length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Dynamic Stretches
                        </h4>
                        <div className="space-y-3">
                          {coolDownExercises.filter(ex => ex.category === 'dynamic_stretch').map((exercise, index) => (
                            <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-semibold text-gray-900">{exercise.name}</h5>
                                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                                  {exercise.duration}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{exercise.description}</p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="text-gray-500">Target:</span>
                                {exercise.targetMuscles.map((muscle, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-white border border-orange-200 rounded text-gray-700">
                                    {muscle}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Active Recovery */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Active Recovery
                      </h4>
                      <div className="space-y-3">
                        {coolDownExercises.filter(ex => ex.category === 'active_recovery').map((exercise, index) => (
                          <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-semibold text-gray-900">{exercise.name}</h5>
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                {exercise.duration}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{exercise.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mobility/Foam Rolling */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Foam Rolling & Mobility
                      </h4>
                      <div className="space-y-3">
                        {coolDownExercises.filter(ex => ex.category === 'mobility').map((exercise, index) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-semibold text-gray-900">{exercise.name}</h5>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                {exercise.duration}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{exercise.description}</p>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="text-gray-500">Target:</span>
                              {exercise.targetMuscles.map((muscle, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white border border-blue-200 rounded text-gray-700">
                                  {muscle}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Breathing & Relaxation */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        Breathing & Relaxation
                      </h4>
                      <div className="space-y-3">
                        {coolDownExercises.filter(ex => ex.category === 'breathing' || ex.category === 'relaxation').map((exercise, index) => (
                          <div key={index} className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-semibold text-gray-900">{exercise.name}</h5>
                              <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                                {exercise.duration}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{exercise.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailModal;
