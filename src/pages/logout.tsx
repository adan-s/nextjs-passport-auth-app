import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { logoutUser } from '@/services/auth';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Get the token from local storage or context
        const token = localStorage.getItem('token'); 

        if (token) {
          await logoutUser(token);
        }

        // Clear token from local storage or context if necessary
        localStorage.removeItem('token'); // or clear from context

        // Redirect to login page
        router.push('/auth/login');
      } catch (error) {
        console.error('Logout failed:', error);
        // Optionally redirect to an error page or show a message
        router.push('/auth/login');
      }
    };

    handleLogout();
  }, [router]);

  return <p>Logging out...</p>;
}
