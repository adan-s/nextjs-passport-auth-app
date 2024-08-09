"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/auth';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        router.push('/profile');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    }
  };

  const clearError = () => {
    setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black  " style={{fontFamily:"Times New Roman"}}>
      <div className="container mx-auto p-4 md:p-6 lg:p-12 ">
        <main className="flex flex-col items-center justify-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
            <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col justify-center">
              <h2 className="text-5xl font-bold mb-6">Welcome Back!</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-lg font-bold mb-2" htmlFor="username">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-lg font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-3 px-5 text-lg rounded w-full mb-6"
                >
                  Login
                </button>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded" role="alert">
                  <p className='errorMsg'>{error}</p>
                  <button onClick={clearError} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>}
              </form>

              <p className="text-gray-600 flex text-lg  items-center justify-center">
                Don't have an account?&nbsp;
                <a href="#" onClick={() => router.push('/signup')} className="text-blue-600 hover:text-blue-800">
                SignUp
                </a>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src="/images/login.png" alt="Organic Mind" className="w-full object-cover" />
              <p className="text-center my-6 text-3xl text-teal-400 font-bold py-4">Humanity NeuroTech</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
