import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { 
  XMarkIcon, 
  TrophyIcon,
  PlusIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';

const LeaderboardModal = ({ isOpen, onClose, event, userProfile }) => {
  const [activeBoard, setActiveBoard] = useState('main');
  const [users, setUsers] = useState([]);
  const [mainLeaderboard, setMainLeaderboard] = useState([]);
  const [lockerWodLeaderboard, setLockerWodLeaderboard] = useState([]);
  const [newEntry, setNewEntry] = useState({ userId: '', minutes: '', seconds: '', weight: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && event?.id) {
      fetchEventData();
      fetchUsers();
    }
  }, [isOpen, event?.id]);

  const fetchEventData = async () => {
    if (!event?.id) return;
    
    setLoading(true);
    try {
      const eventRef = doc(db, 'events', event.id);
      const eventDoc = await getDoc(eventRef);
      
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        console.log('Fetched fresh event data:', eventData);
        setMainLeaderboard(eventData.mainLeaderboard || []);
        setLockerWodLeaderboard(eventData.lockerWodLeaderboard || []);
      } else {
        console.warn('Event not found in Firestore');
        setMainLeaderboard([]);
        setLockerWodLeaderboard([]);
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
      // Fallback to event prop data if fetch fails
      setMainLeaderboard(event?.mainLeaderboard || []);
      setLockerWodLeaderboard(event?.lockerWodLeaderboard || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addEntry = () => {
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

    console.log('Adding entry:', entry);

    if (activeBoard === 'main') {
      const updated = [...mainLeaderboard, entry].sort((a, b) => 
        parseFloat(a.time) - parseFloat(b.time)
      );
      console.log('Updated main leaderboard:', updated);
      setMainLeaderboard(updated);
    } else {
      const updated = [...lockerWodLeaderboard, entry].sort((a, b) => 
        parseFloat(a.time) - parseFloat(b.time)
      );
      console.log('Updated locker WOD leaderboard:', updated);
      setLockerWodLeaderboard(updated);
    }

    setNewEntry({ userId: '', minutes: '', seconds: '', weight: '' });
  };

  const removeEntry = (entryId) => {
    if (activeBoard === 'main') {
      setMainLeaderboard(mainLeaderboard.filter(e => e.id !== entryId));
    } else {
      setLockerWodLeaderboard(lockerWodLeaderboard.filter(e => e.id !== entryId));
    }
  };

  const handleSave = async () => {
    if (!event?.id) {
      alert('Error: Event ID is missing. Please close and try again.');
      return;
    }

    console.log('=== SAVING LEADERBOARDS ===');
    console.log('Event ID:', event.id);
    console.log('Main leaderboard entries:', mainLeaderboard);
    console.log('Locker WOD entries:', lockerWodLeaderboard);

    setSaving(true);
    try {
      const eventRef = doc(db, 'events', event.id);
      
      // First check if event exists
      const eventSnap = await getDoc(eventRef);
      if (!eventSnap.exists()) {
        throw new Error('Event does not exist in Firestore. Please refresh and try again.');
      }

      console.log('Event exists, current data:', eventSnap.data());
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore timeout')), 10000)
      );

      const updateData = {
        mainLeaderboard: mainLeaderboard || [],
        lockerWodLeaderboard: lockerWodLeaderboard || [],
        updatedAt: new Date().toISOString()
      };

      console.log('Updating event with:', updateData);

      await Promise.race([
        updateDoc(eventRef, updateData),
        timeoutPromise
      ]);
      
      console.log('✅ SUCCESS! Leaderboards saved to Firestore');
      
      // Verify the save
      const verifySnap = await getDoc(eventRef);
      console.log('Verified saved data:', verifySnap.data());
      
      alert('Leaderboards saved successfully!');
      onClose();
    } catch (error) {
      console.error('❌ ERROR saving leaderboards:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      if (error.message === 'Firestore timeout') {
        alert('⏱️ Request timed out. Please check your internet connection and try again.');
      } else if (error.code === 'permission-denied') {
        alert('🚫 PERMISSION DENIED!\n\nYour Firestore security rules are blocking this update.\n\nFIX:\n1. Go to Firebase Console\n2. Firestore Database → Rules\n3. Update rules to allow writes\n4. See DEPLOY_FIRESTORE_RULES.md for details');
      } else if (error.code === 'unavailable') {
        alert('📡 Firestore is unavailable. Check your internet connection.');
      } else if (error.code === 'not-found') {
        alert('❌ Event not found in database. Please refresh the page and try again.');
      } else {
        alert(`❌ Failed to save leaderboards\n\nError: ${error.message}\nCode: ${error.code || 'unknown'}\n\nCheck browser console (F12) for details.`);
      }
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (time) => {
    // Convert seconds to MM:SS format if it's a number
    const timeNum = parseFloat(time);
    if (!isNaN(timeNum)) {
      const minutes = Math.floor(timeNum / 60);
      const seconds = Math.floor(timeNum % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return time;
  };

  if (!isOpen) return null;

  const currentLeaderboard = activeBoard === 'main' ? mainLeaderboard : lockerWodLeaderboard;
  const isAdmin = userProfile?.role === 'admin';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-400 to-orange-500">
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-6 w-6 text-white" />
              <h3 className="text-lg font-medium text-white">
                Leaderboards - {event?.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveBoard('main')}
                className={`${
                  activeBoard === 'main'
                    ? 'border-primary-500 text-primary-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                Main Workout
              </button>
              <button
                onClick={() => setActiveBoard('locker')}
                className={`${
                  activeBoard === 'locker'
                    ? 'border-primary-500 text-primary-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                Locker WOD
              </button>
            </nav>
          </div>

          <div className="px-6 py-6">
            {/* Add Entry Form (Admin Only) */}
            {isAdmin && (
              <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Add Athlete</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <select
                    value={newEntry.userId}
                    onChange={(e) => setNewEntry({ ...newEntry, userId: e.target.value })}
                    className="col-span-1 sm:col-span-2 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Member...</option>
                    {users.map(user => (
                      <option key={user.uid} value={user.uid}>
                        {user.displayName || user.email}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={newEntry.minutes}
                      onChange={(e) => setNewEntry({ ...newEntry, minutes: e.target.value })}
                      min="0"
                      className="w-20 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <span className="flex items-center text-gray-500">:</span>
                    <input
                      type="number"
                      placeholder="Sec"
                      value={newEntry.seconds}
                      onChange={(e) => setNewEntry({ ...newEntry, seconds: e.target.value })}
                      min="0"
                      max="59"
                      className="w-20 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Weight"
                      value={newEntry.weight}
                      onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
                      className="flex-1 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={addEntry}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Enter minutes and seconds separately. Sorted automatically by fastest time.
                </p>
              </div>
            )}

            {/* Leaderboard Display */}
            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-sm text-gray-500">Loading leaderboards...</p>
                </div>
              ) : currentLeaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    {isAdmin ? 'No entries yet. Add athletes above.' : 'No leaderboard entries for this workout yet.'}
                  </p>
                </div>
              ) : (
                currentLeaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-400'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-200 to-gray-100 border border-gray-300'
                        : index === 2
                        ? 'bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-300'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0
                          ? 'bg-yellow-500 text-white'
                          : index === 1
                          ? 'bg-gray-400 text-white'
                          : index === 2
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{entry.userName}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-mono font-bold text-primary-600">
                            {formatTime(entry.time)}
                          </span>
                          {entry.weight && (
                            <span className="text-gray-500">
                              {entry.weight}
                            </span>
                          )}
                        </div>
                      </div>
                      {index === 0 && (
                        <TrophyIcon className="h-8 w-8 text-yellow-500" />
                      )}
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="ml-4 text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {isAdmin ? 'Cancel' : 'Close'}
            </button>
            {isAdmin && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Leaderboards'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;
