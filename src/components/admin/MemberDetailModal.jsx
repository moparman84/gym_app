import { XMarkIcon, EnvelopeIcon, CalendarIcon, TrophyIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const MemberDetailModal = ({ isOpen, onClose, member, loginHistory }) => {
  if (!isOpen || !member) return null;

  const memberLogins = loginHistory.filter(log => log.userId === member.uid);
  const lastLogin = memberLogins[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-primary-600">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                {member.photoURL ? (
                  <img src={member.photoURL} alt={member.displayName} className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <span className="text-primary-600 font-bold text-2xl">
                    {member.displayName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{member.displayName}</h3>
                <p className="text-primary-100 text-sm">{member.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <h4 className="font-semibold text-gray-900">Contact Info</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="text-gray-900">{member.email}</p>
                  </div>
                  {member.phone && (
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="text-gray-900">{member.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <h4 className="font-semibold text-gray-900">Membership</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Role:</span>
                    <p>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800'
                          : member.role === 'coach'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {member.role}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Member Since:</span>
                    <p className="text-gray-900">
                      {member.createdAt ? format(new Date(member.createdAt), 'MMMM d, yyyy') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Login:</span>
                    <p className="text-gray-900">
                      {lastLogin ? format(new Date(lastLogin.timestamp), 'MMM d, yyyy - h:mm a') : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {member.bio && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                <p className="text-sm text-gray-700">{member.bio}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Weight Stats */}
              {(member.currentWeight || member.goalWeight) && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ScaleIcon className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Weight</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    {member.currentWeight && (
                      <p className="text-gray-700">Current: <span className="font-medium">{member.currentWeight} lbs</span></p>
                    )}
                    {member.goalWeight && (
                      <p className="text-gray-700">Goal: <span className="font-medium">{member.goalWeight} lbs</span></p>
                    )}
                    {member.currentWeight && member.goalWeight && (
                      <p className="text-gray-700">To Goal: <span className="font-medium text-primary-600">
                        {Math.abs(member.currentWeight - member.goalWeight)} lbs
                      </span></p>
                    )}
                  </div>
                </div>
              )}

              {/* Login Activity */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-2">Activity</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">Total Logins: <span className="font-medium">{memberLogins.length}</span></p>
                  <p className="text-gray-700">Last 30 Days: <span className="font-medium">
                    {memberLogins.filter(log => {
                      const thirtyDaysAgo = new Date();
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                      return new Date(log.timestamp) > thirtyDaysAgo;
                    }).length}
                  </span></p>
                  <p className="text-gray-700">Last 7 Days: <span className="font-medium">
                    {memberLogins.filter(log => {
                      const sevenDaysAgo = new Date();
                      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                      return new Date(log.timestamp) > sevenDaysAgo;
                    }).length}
                  </span></p>
                </div>
              </div>

              {/* PRs Count */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrophyIcon className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-semibold text-gray-900">Records</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">1 Rep Max: <span className="font-medium">
                    {member.oneRepMaxes?.length || 0}
                  </span></p>
                  <p className="text-gray-700">Personal Records: <span className="font-medium">
                    {member.personalRecords?.length || 0}
                  </span></p>
                </div>
              </div>
            </div>

            {/* 1 Rep Max */}
            {member.oneRepMaxes && member.oneRepMaxes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">1 Rep Max</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {member.oneRepMaxes.map((rm) => (
                    <div key={rm.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="font-medium text-gray-900">{rm.exercise}</p>
                      <p className="text-lg font-bold text-primary-600">{rm.weight} lbs</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Records */}
            {member.personalRecords && member.personalRecords.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Personal Records</h4>
                <div className="space-y-2">
                  {member.personalRecords.map((pr) => (
                    <div key={pr.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{pr.exercise}</p>
                        <p className="text-sm text-gray-600">{pr.record}</p>
                      </div>
                      {pr.date && (
                        <p className="text-xs text-gray-500">
                          {format(new Date(pr.date), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Login History */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recent Login History</h4>
              <div className="bg-gray-50 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                {memberLogins.slice(0, 10).length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {memberLogins.slice(0, 10).map((log) => (
                      <li key={log.id} className="px-4 py-3 text-sm text-gray-700">
                        {format(new Date(log.timestamp), 'EEEE, MMMM d, yyyy - h:mm a')}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-3 text-sm text-gray-500">No login history available</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
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

export default MemberDetailModal;
