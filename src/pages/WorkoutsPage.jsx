import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuthStore from '../store/useAuthStore';
import { PlusIcon, PencilIcon, TrashIcon, BoltIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import WorkoutModal from '../components/workouts/WorkoutModal';
import WorkoutDetailModal from '../components/workouts/WorkoutDetailModal';
import { seedCrossfitWorkouts } from '../utils/seedCrossfitWorkouts';

const WorkoutsPage = () => {
  const { user, userProfile } = useAuthStore();
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingWorkout, setViewingWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryColors = {
    benchmark: 'bg-blue-100 text-blue-800',
    hero: 'bg-red-100 text-red-800',
    strength: 'bg-purple-100 text-purple-800',
    emom: 'bg-green-100 text-green-800',
    metcon: 'bg-orange-100 text-orange-800',
    bodyweight: 'bg-yellow-100 text-yellow-800',
    partner: 'bg-pink-100 text-pink-800',
    chipper: 'bg-indigo-100 text-indigo-800'
  };

  const getCategoryLabel = (category) => {
    const labels = {
      benchmark: 'Benchmark',
      hero: 'Hero WOD',
      strength: 'Strength',
      emom: 'EMOM',
      metcon: 'MetCon',
      bodyweight: 'Bodyweight',
      partner: 'Partner',
      chipper: 'Chipper'
    };
    return labels[category] || 'General';
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const workoutsRef = collection(db, 'workouts');
      const querySnapshot = await getDocs(workoutsRef);
      const workoutsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWorkouts(workoutsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setLoading(false);
    }
  };

  const handleCreateWorkout = () => {
    setSelectedWorkout(null);
    setIsModalOpen(true);
  };

  const handleEditWorkout = (workout, e) => {
    e.stopPropagation(); // Prevent card click
    setSelectedWorkout(workout);
    setIsModalOpen(true);
  };

  const handleViewWorkout = (workout) => {
    setViewingWorkout(workout);
  };

  const handleSaveWorkout = async (workoutData) => {
    try {
      if (selectedWorkout?.id) {
        // Update existing workout
        const workoutRef = doc(db, 'workouts', selectedWorkout.id);
        await updateDoc(workoutRef, {
          ...workoutData,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Create new workout
        await addDoc(collection(db, 'workouts'), {
          ...workoutData,
          createdBy: user.uid,
          createdAt: new Date().toISOString()
        });
      }
      
      fetchWorkouts();
      setIsModalOpen(false);
      setSelectedWorkout(null);
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout');
    }
  };

  const handleDeleteWorkout = async (workoutId, e) => {
    e.stopPropagation(); // Prevent card click
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await deleteDoc(doc(db, 'workouts', workoutId));
        fetchWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
        alert('Failed to delete workout');
      }
    }
  };

  const handleSeedCrossfitWorkouts = async () => {
    if (!window.confirm('This will add 30+ CrossFit benchmark workouts to your library. Continue?')) {
      return;
    }

    setSeeding(true);
    try {
      const result = await seedCrossfitWorkouts(user.uid);
      
      if (result.success) {
        alert(`✅ Success!\n\nAdded: ${result.added} new workouts\nSkipped: ${result.skipped} existing workouts`);
        fetchWorkouts();
      } else {
        alert(`Failed to seed workouts: ${result.error}`);
      }
    } catch (error) {
      console.error('Error seeding workouts:', error);
      alert('Failed to seed CrossFit workouts');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Calculate filtered workouts for display
  const filteredWorkouts = workouts
    .filter(w => categoryFilter === 'all' || w.category === categoryFilter)
    .filter(w => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      if (w.name?.toLowerCase().includes(query)) return true;
      if (w.description?.toLowerCase().includes(query)) return true;
      if (w.exercises?.some(ex => ex.name?.toLowerCase().includes(query))) return true;
      return false;
    })
    .sort((a, b) => {
      const nameA = a.name?.toLowerCase() || '';
      const nameB = b.name?.toLowerCase() || '';
      return nameA.localeCompare(nameB);
    });

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workout Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            {userProfile?.role === 'admin' 
              ? 'Create and manage gym workout programs'
              : 'View available workout programs'}
          </p>
        </div>
        {userProfile?.role === 'admin' && (
          <div className="flex gap-3">
            <button
              onClick={handleSeedCrossfitWorkouts}
              disabled={seeding}
              className="inline-flex items-center px-4 py-2 border border-primary-600 rounded-lg shadow-sm text-sm font-medium text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <BoltIcon className="h-5 w-5 mr-2" />
              {seeding ? 'Adding Workouts...' : 'Add CrossFit WODs'}
            </button>
            <button
              onClick={handleCreateWorkout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Workout
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      {workouts.length > 0 && (
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search workouts by name, description, or exercise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <span className="text-sm">Clear</span>
              </button>
            )}
          </div>
          {(searchQuery || categoryFilter !== 'all') && (
            <p className="mt-2 text-sm text-gray-600">
              Showing {filteredWorkouts.length} of {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          )}
        </div>
      )}

      {/* Category Filter */}
      {workouts.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            All Workouts ({workouts.length})
          </button>
          {['benchmark', 'hero', 'strength', 'metcon', 'bodyweight', 'emom'].map(cat => {
            const count = workouts.filter(w => w.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {getCategoryLabel(cat)} ({count})
              </button>
            );
          })}
        </div>
      )}

      {workouts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workouts</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new workout.</p>
        </div>
      ) : filteredWorkouts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workouts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery 
              ? `No results for "${searchQuery}". Try a different search term.`
              : 'No workouts match the selected category.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWorkouts.map((workout) => (
            <div
              key={workout.id}
              onClick={() => handleViewWorkout(workout)}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-all cursor-pointer hover:scale-105 transform"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {workout.name}
                    </h3>
                    {workout.category && (
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[workout.category] || 'bg-gray-100 text-gray-800'}`}>
                        {getCategoryLabel(workout.category)}
                      </span>
                    )}
                  </div>
                  {userProfile?.role === 'admin' && (
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={(e) => handleEditWorkout(workout, e)}
                        className="text-primary-600 hover:text-primary-700 p-1 hover:bg-primary-50 rounded transition-colors"
                        title="Edit workout"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteWorkout(workout.id, e)}
                        className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                        title="Delete workout"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {workout.description || 'No description'}
                </p>

                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Exercises ({workout.exercises.length})
                    </p>
                    <ul className="space-y-1">
                      {workout.exercises.slice(0, 3).map((exercise, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          • {exercise.name}
                        </li>
                      ))}
                      {workout.exercises.length > 3 && (
                        <li className="text-sm text-gray-500">
                          +{workout.exercises.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <WorkoutModal
          workout={selectedWorkout}
          onSave={handleSaveWorkout}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedWorkout(null);
          }}
        />
      )}

      {/* View Detail Modal */}
      {viewingWorkout && (
        <WorkoutDetailModal
          workout={viewingWorkout}
          onClose={() => setViewingWorkout(null)}
        />
      )}
    </div>
  );
};

export default WorkoutsPage;
