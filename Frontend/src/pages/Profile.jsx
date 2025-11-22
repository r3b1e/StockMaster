import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
              {user?.name || '-'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
              {user?.email || '-'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
              {user?.role ? user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

