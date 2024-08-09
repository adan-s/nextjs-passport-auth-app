import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { logoutUser } from '@/services/auth';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const token = localStorage.getItem('token'); 

        if (token) {
          await logoutUser(token);
        }

        localStorage.removeItem('token');

        router.push('/auth/login');
      } catch (error) {
        console.error('Logout failed:', error);
        router.push('/auth/login');
      }
    };

    handleLogout();
  }, [router]);

  return <p>Logging out...</p>;
}
