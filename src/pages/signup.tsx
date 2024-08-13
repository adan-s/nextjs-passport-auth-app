import React, { useState } from "react";
import { useRouter } from "next/router";
import { registerUser } from "@/services/auth";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("active");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("status", status);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    const data = await registerUser(formData);
    if (data.message) {
      setError(data.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="container mx-auto p-4 md:p-6 lg:p-12">
        <main className="flex flex-col items-center justify-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src="/images/signup.png"
                alt="Organic Mind"
                className="w-full object-cover"
              />
              <p className="text-center my-6 text-3xl text-teal-500 font-bold py-4">
                Humanity NeuroTech
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-6">Create Your Account</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-lg font-bold mb-2"
                    htmlFor="username"
                  >
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
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-lg font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-6 relative">
                  <label
                    className="block text-gray-700 text-lg font-bold mb-2"
                    htmlFor="password"
                  >
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
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-lg font-bold mb-2"
                    htmlFor="profilePic"
                  >
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    id="profilePic"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleFileChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-3 px-5 rounded w-full mb-6 text-lg"
                >
                  Signup
                </button>
                {error && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded"
                    role="alert"
                  >
                    <p className="errorMsg">{error}</p>
                  </div>
                )}
              </form>

              <p className="text-gray-600 flex items-center justify-center text-lg">
                Already have an account?&nbsp;
                <a
                  href="#"
                  onClick={() => router.push("/login")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SignupPage;
