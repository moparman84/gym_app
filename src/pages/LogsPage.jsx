import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuthStore from '../store/useAuthStore';
import { format } from 'date-fns';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import LogModal from '../components/workoutLogs/LogModal';

const LogsPage = () => {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    try {
      const logsRef = collection(db, 'logs');
      const q = query(
        logsRef,
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const logsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setLogs(logsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLoading(false);
    }
  };

  const handleCreateLog = () => {
    setIsModalOpen(true);
  };

  const handleSaveLog = async (logData) => {
    try {
      await addDoc(collection(db, 'logs'), {
        ...logData,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
      
      fetchLogs();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving log:', error);
      alert('Failed to save log');
    }
  };

  const handleDeleteLog = async (logId) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await deleteDoc(doc(db, 'logs', logId));
        fetchLogs();
      } catch (error) {
        console.error('Error deleting log:', error);
        alert('Failed to delete log');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workout Logs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your workout progress and performance
          </p>
        </div>
        <button
          onClick={handleCreateLog}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Log
        </button>
      </div>

      {logs.length === 0 ? (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workout logs</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by logging your first workout.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {logs.map((log) => (
              <li key={log.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {log.workoutName}
                      </h3>
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(log.date), 'MMMM d, yyyy')}
                    </p>
                    
                    {log.exercises && log.exercises.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {log.exercises.map((exercise, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-gray-700">{exercise.name}</span>
                            {exercise.sets && (
                              <span className="text-gray-500 ml-2">
                                {exercise.sets} sets × {exercise.reps} reps
                                {exercise.weight && ` @ ${exercise.weight} lbs`}
                              </span>
                            )}
                            {exercise.notes && (
                              <p className="text-gray-500 mt-1">{exercise.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {log.notes && (
                      <p className="mt-2 text-sm text-gray-600 italic">
                        Notes: {log.notes}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isModalOpen && (
        <LogModal
          onSave={handleSaveLog}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default LogsPage;
