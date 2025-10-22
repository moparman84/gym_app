import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  orderBy, 
  query 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { 
  MegaphoneIcon, 
  PlusIcon, 
  TrashIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const AnnouncementsSection = ({ userProfile }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', body: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const announcementsRef = collection(db, 'announcements');
      const q = query(announcementsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const announcementsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.body.trim()) {
      alert('Please fill in both title and body');
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, 'announcements'), {
        title: newAnnouncement.title.trim(),
        body: newAnnouncement.body.trim(),
        createdAt: new Date().toISOString(),
        createdBy: userProfile?.displayName || 'Admin'
      });

      setNewAnnouncement({ title: '', body: '' });
      setIsAddingNew(false);
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error adding announcement:', error);
      alert('Failed to add announcement');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!confirm('Delete this announcement?')) return;

    try {
      await deleteDoc(doc(db, 'announcements', id));
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement');
    }
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MegaphoneIcon className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
        </div>
        {isAdmin && !isAddingNew && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <PlusIcon className="h-4 w-4" />
            Add Announcement
          </button>
        )}
      </div>

      {/* Add Announcement Form (Admin Only) */}
      {isAdmin && isAddingNew && (
        <div className="mb-6 bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">New Announcement</h3>
            <button
              onClick={() => {
                setIsAddingNew(false);
                setNewAnnouncement({ title: '', body: '' });
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                placeholder="e.g., Gym Closure This Weekend"
                className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={newAnnouncement.body}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, body: e.target.value })}
                placeholder="Enter your announcement details..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                disabled={saving}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddAnnouncement}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {saving ? 'Posting...' : 'Post Announcement'}
              </button>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setNewAnnouncement({ title: '', body: '' });
                }}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <MegaphoneIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 font-medium">No announcements yet</p>
            <p className="text-xs text-gray-500 mt-1">
              {isAdmin ? 'Click "Add Announcement" to create one' : 'Check back later for updates'}
            </p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-500 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MegaphoneIcon className="h-5 w-5 text-orange-600 flex-shrink-0" />
                    <h3 className="text-lg font-bold text-gray-900">
                      {announcement.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {announcement.body}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-medium">
                      Posted by {announcement.createdBy}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="ml-4 text-red-600 hover:text-red-700 flex-shrink-0"
                    title="Delete announcement"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementsSection;
