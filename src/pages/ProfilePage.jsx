import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import useAuthStore from '../store/useAuthStore';
import { 
  UserCircleIcon, 
  CameraIcon,
  ScaleIcon,
  TrophyIcon,
  PlusIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
  phone: z.string().optional(),
  currentWeight: z.string().optional(),
  goalWeight: z.string().optional()
});

const ProfilePage = () => {
  const { user, userProfile, fetchUserProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [photoURL, setPhotoURL] = useState(userProfile?.photoURL || '');
  const [oneRepMaxes, setOneRepMaxes] = useState(userProfile?.oneRepMaxes || []);
  const [personalRecords, setPersonalRecords] = useState(userProfile?.personalRecords || []);
  const [newOneRM, setNewOneRM] = useState({ exercise: '', weight: '' });
  const [newPR, setNewPR] = useState({ exercise: '', record: '', date: '' });

  useEffect(() => {
    if (userProfile) {
      setPhotoURL(userProfile.photoURL || '');
      setOneRepMaxes(userProfile.oneRepMaxes || []);
      setPersonalRecords(userProfile.personalRecords || []);
    }
  }, [userProfile]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: userProfile?.displayName || '',
      email: user?.email || '',
      bio: userProfile?.bio || '',
      phone: userProfile?.phone || '',
      currentWeight: userProfile?.currentWeight || '',
      goalWeight: userProfile?.goalWeight || ''
    }
  });

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: data.displayName,
        bio: data.bio,
        phone: data.phone,
        currentWeight: data.currentWeight,
        goalWeight: data.goalWeight,
        photoURL,
        oneRepMaxes,
        personalRecords,
        updatedAt: new Date().toISOString()
      });
      
      // Refresh user profile
      await fetchUserProfile(user.uid);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
    setIsSaving(false);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    try {
      setIsSaving(true);
      
      // Create a unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile_photos/${user.uid}_${timestamp}.${fileExtension}`;
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update local state
      setPhotoURL(downloadURL);
      
      // Save to Firestore immediately
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL,
        updatedAt: new Date().toISOString()
      });
      
      // Refresh profile
      await fetchUserProfile(user.uid);
      alert('Photo uploaded successfully!');
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addOneRepMax = () => {
    if (newOneRM.exercise && newOneRM.weight) {
      setOneRepMaxes([...oneRepMaxes, { ...newOneRM, id: Date.now() }]);
      setNewOneRM({ exercise: '', weight: '' });
    }
  };

  const removeOneRepMax = (id) => {
    setOneRepMaxes(oneRepMaxes.filter(rm => rm.id !== id));
  };

  const addPersonalRecord = () => {
    if (newPR.exercise && newPR.record) {
      setPersonalRecords([...personalRecords, { 
        ...newPR, 
        date: newPR.date || new Date().toISOString().split('T')[0],
        id: Date.now() 
      }]);
      setNewPR({ exercise: '', record: '', date: '' });
    }
  };

  const removePersonalRecord = (id) => {
    setPersonalRecords(personalRecords.filter(pr => pr.id !== id));
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative flex-shrink-0">
                  {photoURL ? (
                    <img 
                      src={photoURL} 
                      alt="Profile" 
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-primary-600 flex items-center justify-center">
                      <span className="text-white text-3xl font-medium">
                        {userProfile?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-2 cursor-pointer hover:bg-primary-700">
                      <CameraIcon className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-medium text-gray-900">
                    {userProfile?.displayName || 'User'}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {userProfile?.role || 'member'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`${
                  activeTab === 'info'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`${
                  activeTab === 'stats'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <ScaleIcon className="h-4 w-4 inline mr-1" />
                Stats & Goals
              </button>
              <button
                onClick={() => setActiveTab('1rm')}
                className={`${
                  activeTab === '1rm'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                1 Rep Max
              </button>
              <button
                onClick={() => setActiveTab('prs')}
                className={`${
                  activeTab === 'prs'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <TrophyIcon className="h-4 w-4 inline mr-1" />
                Personal Records
              </button>
            </nav>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5">
            {/* Basic Info Tab */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    {...register('displayName')}
                    disabled={!isEditing}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  {errors.displayName && (
                    <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 bg-gray-50 text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    disabled={!isEditing}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    {...register('bio')}
                    disabled={!isEditing}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Account Information</h4>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Account Type</dt>
                      <dd className="mt-1 text-sm text-gray-900 capitalize">
                        {userProfile?.role || 'member'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Member Since</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {userProfile?.createdAt 
                          ? new Date(userProfile.createdAt).toLocaleDateString()
                          : 'N/A'
                        }
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* Stats & Goals Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="currentWeight" className="block text-sm font-medium text-gray-700">
                      Current Weight (lbs)
                    </label>
                    <input
                      type="text"
                      id="currentWeight"
                      {...register('currentWeight')}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="185"
                    />
                  </div>

                  <div>
                    <label htmlFor="goalWeight" className="block text-sm font-medium text-gray-700">
                      Goal Weight (lbs)
                    </label>
                    <input
                      type="text"
                      id="goalWeight"
                      {...register('goalWeight')}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="175"
                    />
                  </div>
                </div>

                {userProfile?.currentWeight && userProfile?.goalWeight && (
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <p className="text-sm text-primary-900">
                      <strong>Progress:</strong> {
                        Math.abs(parseFloat(userProfile.currentWeight) - parseFloat(userProfile.goalWeight))
                      } lbs to goal
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 1 Rep Max Tab */}
            {activeTab === '1rm' && (
              <div className="space-y-6">
                {isEditing && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Add 1 Rep Max</h4>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Exercise (e.g., Squat)"
                        value={newOneRM.exercise}
                        onChange={(e) => setNewOneRM({ ...newOneRM, exercise: e.target.value })}
                        className="flex-1 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Weight (lbs)"
                        value={newOneRM.weight}
                        onChange={(e) => setNewOneRM({ ...newOneRM, weight: e.target.value })}
                        className="w-32 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={addOneRepMax}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {oneRepMaxes.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No 1 rep maxes recorded yet</p>
                  ) : (
                    oneRepMaxes.map((rm) => (
                      <div key={rm.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{rm.exercise}</p>
                          <p className="text-2xl font-bold text-primary-600">{rm.weight} lbs</p>
                        </div>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeOneRepMax(rm.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Personal Records Tab */}
            {activeTab === 'prs' && (
              <div className="space-y-6">
                {isEditing && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Add Personal Record</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Exercise/Achievement"
                        value={newPR.exercise}
                        onChange={(e) => setNewPR({ ...newPR, exercise: e.target.value })}
                        className="border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Record (e.g., 100 reps)"
                        value={newPR.record}
                        onChange={(e) => setNewPR({ ...newPR, record: e.target.value })}
                        className="border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={newPR.date}
                          onChange={(e) => setNewPR({ ...newPR, date: e.target.value })}
                          className="flex-1 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button
                          type="button"
                          onClick={addPersonalRecord}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {personalRecords.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No personal records yet</p>
                  ) : (
                    personalRecords.map((pr) => (
                      <div key={pr.id} className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-start gap-3">
                          <TrophyIcon className="h-6 w-6 text-yellow-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">{pr.exercise}</p>
                            <p className="text-lg font-semibold text-primary-600">{pr.record}</p>
                            <p className="text-xs text-gray-500">{new Date(pr.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removePersonalRecord(pr.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
