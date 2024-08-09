import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getProfile, logoutUser } from '@/services/auth';

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      console.log("token:", token);
      if (token) {
        try {
          const data = await getProfile(token);
          console.log("data", data);
          setProfile(data);
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
    <div>
      <h1>Profile</h1>
      {error && <p>{error}</p>}
      {profile ? (
        <div>
          <p>Username: {profile.username}</p>
          <p>Email: {profile.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
