import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getProfile, logoutUser } from '@/services/auth';

const ProfilePage = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await getProfile(token);
          setUsername(data.username);
        } catch (err) {
          console.error('Error fetching profile:', err);
          setError('Failed to fetch profile');
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await logoutUser(token);
        localStorage.removeItem('token');
        router.push('/login');
      } catch (err) {
        console.error('Error logging out:', err);
        setError('Logout failed');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Profile</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {username ? (
          <div className="text-center">
            <p className="text-lg">Username: <span className="font-medium">{username}</span></p>
            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
