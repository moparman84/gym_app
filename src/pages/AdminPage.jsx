import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuthStore from '../store/useAuthStore';
import { format } from 'date-fns';
import { 
  UserGroupIcon, 
  ClockIcon, 
  CalendarIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import MemberDetailModal from '../components/admin/MemberDetailModal';

const AdminPage = () => {
  const { userProfile } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isMemberDetailOpen, setIsMemberDetailOpen] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (userProfile?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    fetchData();
  }, [userProfile, navigate]);

  const fetchData = async () => {
    try {
      // Fetch all users
      const usersRef = collection(db, 'users');
      const usersSnap = await getDocs(usersRef);
      const usersData = usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);

      // Fetch login history
      const historyRef = collection(db, 'loginHistory');
      const historyQuery = query(historyRef, orderBy('timestamp', 'desc'));
      const historySnap = await getDocs(historyQuery);
      const historyData = historySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLoginHistory(historyData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  const getLoginCount = (userId, days = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return loginHistory.filter(log => 
      log.userId === userId && 
      new Date(log.timestamp) > cutoffDate
    ).length;
  };

  const getTodayLogins = () => {
    const today = new Date().toDateString();
    return loginHistory.filter(log => 
      new Date(log.timestamp).toDateString() === today
    );
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setIsMemberDetailOpen(true);
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage members and monitor gym activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Members
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {users.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Today's Logins
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {getTodayLogins().length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active This Week
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {new Set(loginHistory
                      .filter(log => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(log.timestamp) > weekAgo;
                      })
                      .map(log => log.userId)
                    ).size}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Logins
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {loginHistory.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Login History
          </button>
        </nav>
      </div>

      {/* Members Tab */}
      {activeTab === 'users' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Since
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last 30 Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const userLogins = loginHistory.filter(log => log.userId === user.uid);
                const lastLogin = userLogins[0];
                
                return (
                  <tr key={user.uid}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleMemberClick(user)}
                        className="flex items-center hover:bg-gray-50 rounded-lg p-2 -ml-2 transition-colors w-full text-left"
                      >
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.photoURL ? (
                            <img 
                              src={user.photoURL} 
                              alt={user.displayName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                              <span className="text-white font-medium">
                                {user.displayName?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-primary-600 hover:text-primary-700">
                            {user.displayName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'coach'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getLoginCount(user.uid, 30)} logins
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lastLogin ? format(new Date(lastLogin.timestamp), 'MMM d, h:mm a') : 'Never'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Login History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Login Activity
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {loginHistory.slice(0, 50).map((log) => {
                const user = users.find(u => u.uid === log.userId);
                
                return (
                  <li key={log.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 text-sm font-medium">
                              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.displayName || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(log.timestamp), 'MMM d, yyyy - h:mm a')}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      <MemberDetailModal
        isOpen={isMemberDetailOpen}
        onClose={() => {
          setIsMemberDetailOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        loginHistory={loginHistory}
      />
    </div>
  );
};

export default AdminPage;
