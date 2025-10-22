import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  TrophyIcon,
  ClockIcon,
  FireIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const DailyWorkoutView = ({ selectedDate, events, workouts, onDateChange, onEventClick, onLeaderboardClick, onCreateEvent, userProfile, onEventsUpdate }) => {
  const [users, setUsers] = useState([]);
  const [newEntry, setNewEntry] = useState({ userId: '', minutes: '', seconds: '', weight: '' });
  const [saving, setSaving] = useState(false);

  // Fetch users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          uid: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    if (userProfile?.role === 'admin') {
      fetchUsers();
    }
  }, [userProfile]);
  // Filter events for selected date
  const dayEvents = events.filter(event => {
    // Extract date string directly from event.start (format: YYYY-MM-DD)
    const eventDateStr = event.start.split('T')[0]; // Get just the date part before time
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    return eventDateStr === selectedDateStr;
  });

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const getWorkoutDetails = (workoutId) => {
    return workouts.find(w => w.id === workoutId);
  };

  const hasLeaderboard = (event) => {
    return (event.mainLeaderboard?.length > 0 || event.lockerWodLeaderboard?.length > 0);
  };

  const addLeaderboardEntry = async (card) => {
    if (!newEntry.userId || (!newEntry.minutes && !newEntry.seconds)) {
      alert('Please select a user and enter a time');
      return;
    }

    const user = users.find(u => u.uid === newEntry.userId);
    
    // Convert minutes and seconds to total seconds
    const minutes = parseInt(newEntry.minutes) || 0;
    const seconds = parseInt(newEntry.seconds) || 0;
    const timeInSeconds = (minutes * 60 + seconds).toString();
    
    const entry = {
      userId: newEntry.userId,
      userName: user?.displayName || user?.email || 'Unknown',
      time: timeInSeconds,
      weight: newEntry.weight || '',
      id: Date.now()
    };

    setSaving(true);
    try {
      const eventRef = doc(db, 'events', card.event.id);
      const eventSnap = await getDoc(eventRef);
      
      if (!eventSnap.exists()) {
        throw new Error('Event not found');
      }

      const eventData = eventSnap.data();
      const leaderboardField = card.leaderboardType;
      const currentLeaderboard = eventData[leaderboardField] || [];
      
      const updatedLeaderboard = [...currentLeaderboard, entry].sort((a, b) => 
        parseFloat(a.time) - parseFloat(b.time)
      );

      await updateDoc(eventRef, {
        [leaderboardField]: updatedLeaderboard,
        updatedAt: new Date().toISOString()
      });

      console.log('✅ Entry added successfully!');
      setNewEntry({ userId: '', minutes: '', seconds: '', weight: '' });
      
      // Refresh events
      if (onEventsUpdate) {
        onEventsUpdate();
      }
    } catch (error) {
      console.error('❌ Error adding entry:', error);
      alert(`Failed to add entry: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const removeLeaderboardEntry = async (card, entryId) => {
    if (!confirm('Remove this entry?')) return;

    setSaving(true);
    try {
      const eventRef = doc(db, 'events', card.event.id);
      const eventSnap = await getDoc(eventRef);
      
      if (!eventSnap.exists()) {
        throw new Error('Event not found');
      }

      const eventData = eventSnap.data();
      const leaderboardField = card.leaderboardType;
      const currentLeaderboard = eventData[leaderboardField] || [];
      
      const updatedLeaderboard = currentLeaderboard.filter(e => e.id !== entryId);

      await updateDoc(eventRef, {
        [leaderboardField]: updatedLeaderboard,
        updatedAt: new Date().toISOString()
      });

      console.log('✅ Entry removed successfully!');
      
      // Refresh events
      if (onEventsUpdate) {
        onEventsUpdate();
      }
    } catch (error) {
      console.error('❌ Error removing entry:', error);
      alert(`Failed to remove entry: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousDay}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </button>

          <div className="text-center flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
            <button
              onClick={goToToday}
              className="mt-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Go to Today
            </button>
          </div>

          <button
            onClick={goToNextDay}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        
        {/* Admin Create Event Button */}
        {userProfile?.role === 'admin' && onCreateEvent && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => onCreateEvent(selectedDate)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
            >
              <PlusIcon className="h-5 w-5" />
              Schedule Workout for This Day
            </button>
          </div>
        )}
      </div>

      {/* Workouts Grid */}
      {dayEvents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FireIcon className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Workouts Scheduled</h3>
          <p className="mt-2 text-sm text-gray-500">
            {userProfile?.role === 'admin' 
              ? 'Click on the calendar to schedule a workout for this day'
              : 'Check back later or select a different day'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
          {dayEvents.flatMap((event) => {
            const workout = getWorkoutDetails(event.workoutId);
            const hasMainLeaderboard = event.mainLeaderboard?.length > 0;
            const hasLockerLeaderboard = event.lockerWodLeaderboard?.length > 0;
            const cards = [];
            
            // Main Training Card
            if (workout) {
              cards.push({
                id: `${event.id}-main`,
                type: 'main',
                event: event,
                workout: workout,
                title: event.title,
                hasLeaderboard: hasMainLeaderboard,
                leaderboard: event.mainLeaderboard,
                leaderboardType: 'mainLeaderboard'
              });
            }
            
            // Locker WOD Card (as separate workout)
            if (event.lockerWod && (event.lockerWod.exercises?.length > 0 || event.lockerWod.name)) {
              cards.push({
                id: `${event.id}-locker`,
                type: 'locker',
                event: event,
                workout: event.lockerWod,
                title: 'Locker WOD',
                hasLeaderboard: hasLockerLeaderboard,
                leaderboard: event.lockerWodLeaderboard,
                leaderboardType: 'lockerWodLeaderboard'
              });
            }
            
            return cards;
          }).map((card) => {
            
            return (
              <div 
                key={card.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Workout Header */}
                <div 
                  className={`p-6 cursor-pointer transition-colors ${
                    card.type === 'locker'
                      ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800'
                      : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
                  }`}
                  onClick={() => onEventClick(card.event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {card.title}
                      </h3>
                      {card.type === 'main' && card.workout.name !== card.title && (
                        <p className="text-primary-100 text-sm">
                          {card.workout.name}
                        </p>
                      )}
                    </div>
                    {card.hasLeaderboard && (
                      <TrophyIcon className="h-8 w-8 text-yellow-300" />
                    )}
                  </div>
                </div>

                {/* Workout Details */}
                {card.workout && (
                  <div className={`p-6 border-b border-gray-200 ${
                    card.type === 'locker' ? 'bg-orange-50' : 'bg-gray-50'
                  }`}>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      {card.type === 'locker' ? 'Alternative Training' : 'Workout Details'}
                    </h4>
                    {card.type === 'locker' && card.workout.name && (
                      <p className="text-lg font-bold text-orange-800 mb-3">{card.workout.name}</p>
                    )}
                    {card.workout.description && (
                      <p className="text-sm text-gray-600 mb-4">{card.workout.description}</p>
                    )}
                    {card.workout.exercises && card.workout.exercises.length > 0 && (
                      <div className="space-y-2">
                        {card.workout.exercises.slice(0, 3).map((exercise, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              card.type === 'locker'
                                ? 'bg-orange-200 text-orange-800'
                                : 'bg-primary-100 text-primary-700'
                            }`}>
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">{exercise.name}</span>
                              {(exercise.sets || exercise.reps) && (
                                <span className="text-gray-500 ml-2">
                                  {exercise.sets && `${exercise.sets} sets`}
                                  {exercise.sets && exercise.reps && ' × '}
                                  {exercise.reps && `${exercise.reps} reps`}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        {card.workout.exercises.length > 3 && (
                          <p className="text-xs text-gray-500 ml-8">
                            +{card.workout.exercises.length - 3} more exercises
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Leaderboards Section */}
                {card.hasLeaderboard && card.leaderboard && (
                  <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                        <TrophyIcon className="h-5 w-5 text-yellow-600" />
                        Leaderboard
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLeaderboardClick(card.event);
                        }}
                        className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
                      >
                        View Full →
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Leaderboard Entries */}
                      {card.leaderboard.length > 0 && (
                        <div>
                          <div className="space-y-2">
                            {card.leaderboard.slice(0, 3).map((entry, index) => (
                              <div
                                key={entry.id || index}
                                className={`flex items-center gap-3 p-3 rounded-lg ${
                                  index === 0
                                    ? 'bg-gradient-to-r from-yellow-200 to-yellow-100 border-2 border-yellow-400'
                                    : index === 1
                                    ? 'bg-gradient-to-r from-gray-200 to-gray-100 border border-gray-300'
                                    : 'bg-white border border-orange-200'
                                }`}
                              >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                  index === 0
                                    ? 'bg-yellow-500 text-white'
                                    : index === 1
                                    ? 'bg-gray-400 text-white'
                                    : 'bg-orange-400 text-white'
                                }`}>
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 truncate">{entry.userName}</p>
                                  <p className="text-sm text-gray-600 font-mono">
                                    {formatTime(entry.time)}
                                    {entry.weight && <span className="text-gray-500 ml-2">• {entry.weight}</span>}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Admin Leaderboard Editor or Empty State */}
                {userProfile?.role === 'admin' ? (
                  <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-t-2 border-yellow-300">
                    <div className="flex items-center gap-2 mb-4">
                      <TrophyIcon className="h-5 w-5 text-yellow-600" />
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                        Leaderboard Manager
                      </h4>
                    </div>

                    {/* Add Entry Form */}
                    <div className="bg-white rounded-lg p-4 mb-4 border-2 border-yellow-200">
                      <p className="text-xs font-semibold text-gray-600 mb-3 uppercase">Add New Entry</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Member *</label>
                          <select
                            value={newEntry.userId}
                            onChange={(e) => setNewEntry({ ...newEntry, userId: e.target.value })}
                            className="w-full text-sm border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled={saving}
                          >
                            <option value="">Select member...</option>
                            {users.map(user => (
                              <option key={user.uid} value={user.uid}>
                                {user.displayName || user.email}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Time *</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="number"
                              value={newEntry.minutes}
                              onChange={(e) => setNewEntry({ ...newEntry, minutes: e.target.value })}
                              placeholder="Min"
                              min="0"
                              className="w-16 text-sm border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              disabled={saving}
                            />
                            <span className="text-gray-500 font-bold">:</span>
                            <input
                              type="number"
                              value={newEntry.seconds}
                              onChange={(e) => setNewEntry({ ...newEntry, seconds: e.target.value })}
                              placeholder="Sec"
                              min="0"
                              max="59"
                              className="w-16 text-sm border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              disabled={saving}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Weight</label>
                          <input
                            type="text"
                            value={newEntry.weight}
                            onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
                            placeholder="135"
                            className="w-full text-sm border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            disabled={saving}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => addLeaderboardEntry(card)}
                        disabled={saving || !newEntry.userId || (!newEntry.minutes && !newEntry.seconds)}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      >
                        <PlusIcon className="h-4 w-4" />
                        {saving ? 'Adding...' : 'Add Entry'}
                      </button>
                    </div>

                    {/* Current Leaderboard */}
                    {card.leaderboard && card.leaderboard.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">Current Rankings</p>
                        <div className="space-y-2">
                          {card.leaderboard.map((entry, index) => (
                            <div
                              key={entry.id || index}
                              className={`flex items-center gap-3 p-3 rounded-lg ${
                                index === 0
                                  ? 'bg-gradient-to-r from-yellow-200 to-yellow-100 border-2 border-yellow-400'
                                  : index === 1
                                  ? 'bg-gradient-to-r from-gray-200 to-gray-100 border border-gray-300'
                                  : 'bg-white border border-orange-200'
                              }`}
                            >
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                index === 0
                                  ? 'bg-yellow-500 text-white'
                                  : index === 1
                                  ? 'bg-gray-400 text-white'
                                  : 'bg-orange-400 text-white'
                              }`}>
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate text-sm">{entry.userName}</p>
                                <p className="text-sm text-gray-600 font-mono">
                                  {formatTime(entry.time)}
                                  {entry.weight && <span className="text-gray-500 ml-2">• {entry.weight}</span>}
                                </p>
                              </div>
                              <button
                                onClick={() => removeLeaderboardEntry(card, entry.id)}
                                disabled={saving}
                                className="flex-shrink-0 text-red-600 hover:text-red-700 disabled:text-gray-400 transition-colors"
                                title="Remove entry"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-white rounded-lg border-2 border-dashed border-gray-300">
                        <TrophyIcon className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">No entries yet. Add the first one above!</p>
                      </div>
                    )}
                  </div>
                ) : (
                  !card.hasLeaderboard && (
                    <div className="p-6 bg-gray-50 text-center">
                      <TrophyIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">No leaderboards yet</p>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function to format time
const formatTime = (time) => {
  const timeNum = parseFloat(time);
  if (!isNaN(timeNum)) {
    const minutes = Math.floor(timeNum / 60);
    const seconds = Math.floor(timeNum % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return time;
};

export default DailyWorkoutView;
