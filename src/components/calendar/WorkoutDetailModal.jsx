import { XMarkIcon, TrophyIcon } from '@heroicons/react/24/outline';

const WorkoutDetailModal = ({ isOpen, onClose, event, workout, onViewLeaderboard }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-primary-600">
            <h3 className="text-lg font-medium text-white">
              {event?.title || 'Workout Details'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 py-6">
            {/* Date Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Date:</strong> {event?.start ? new Date(event.start).toLocaleDateString() : 'N/A'}
              </p>
              {event?.description && (
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Description:</strong> {event.description}
                </p>
              )}
            </div>

            {/* Main Workout */}
            {(workout || event?.mainWorkoutExercises) && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Main Workout: {workout?.name || event?.title}
                </h4>
                <div className="space-y-3">
                  {/* Show mainWorkoutExercises if they exist (may have edits), otherwise show workout.exercises */}
                  {(event?.mainWorkoutExercises || workout?.exercises || []).map((exercise, index) => (
                    <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{exercise.name}</p>
                          <div className="mt-1 text-sm text-gray-600">
                            {exercise.sets && <span className="mr-4">Sets: {exercise.sets}</span>}
                            {exercise.reps && <span className="mr-4">Reps/Distance: {exercise.reps}</span>}
                            {exercise.weight && <span className="mr-4">Weight: {exercise.weight}</span>}
                            {exercise.duration && <span>Duration: {exercise.duration}</span>}
                          </div>
                          {exercise.notes && (
                            <p className="mt-2 text-sm text-gray-500 italic">{exercise.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locker WOD */}
            {event?.lockerWod && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Locker WOD</h4>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">{event.lockerWod.name}</p>
                  <div className="space-y-2">
                    {event.lockerWod.exercises && event.lockerWod.exercises.map((exercise, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium text-gray-800">{exercise.name}</p>
                        <p className="text-gray-600">
                          {exercise.sets && `${exercise.sets} sets `}
                          {exercise.reps && `× ${exercise.reps} `}
                          {exercise.weight && `@ ${exercise.weight} `}
                          {exercise.duration && `for ${exercise.duration}`}
                        </p>
                        {exercise.notes && <p className="text-gray-500 italic text-xs">{exercise.notes}</p>}
                      </div>
                    ))}
                  </div>
                  {event.lockerWod.description && (
                    <p className="mt-3 text-sm text-gray-600">{event.lockerWod.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Cool Down Exercises */}
            {event?.coolDownExercises && event.coolDownExercises.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Cool Down & Stretches</h4>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.coolDownExercises.map((exercise, index) => (
                      <div key={index} className="p-3 bg-white border border-green-300 rounded-lg">
                        <p className="font-medium text-gray-900 mb-1">{exercise.name}</p>
                        <p className="text-xs text-green-700 font-medium mb-1">
                          ⏱️ {exercise.customNote || exercise.duration}
                          {exercise.customNote && exercise.duration && (
                            <span className="text-gray-500 ml-1">(default: {exercise.duration})</span>
                          )}
                        </p>
                        {exercise.description && (
                          <p className="text-xs text-gray-600 mb-2">{exercise.description}</p>
                        )}
                        {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {exercise.targetMuscles.map((muscle, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">
                                {muscle}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* No Workout Message */}
            {!workout && !event?.lockerWod && !event?.mainWorkoutExercises && (
              <div className="text-center py-8">
                <p className="text-gray-500">No workout details available for this event.</p>
              </div>
            )}

            {/* Leaderboard Button */}
            {(event?.mainLeaderboard?.length > 0 || event?.lockerWodLeaderboard?.length > 0) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={onViewLeaderboard}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all"
                >
                  <TrophyIcon className="h-5 w-5" />
                  View Leaderboard
                </button>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
