import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getProfile,
  logoutUser,
  updateProfile,
  changePassword,
} from "@/services/auth";

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = await getProfile(token);
          setProfile(data);
          setUsername(data.username);
          setStatus(data.status);
          setEmail(data.email);
          setProfilePic(data.profilePic);
        } catch (err) {
          console.error("Error fetching profile:", err);
          setError("Failed to fetch profile");
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    };
    fetchProfile();
  }, [router]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handlePicEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("status", status);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    console.log("updated form data:", profilePic);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const updatedProfile = {
          username: username,
          status: status,
          email: email,
          profilePic: profilePic,
        };

        await updateProfile(token, updatedProfile);
        setProfile(updatedProfile);
        setProfilePic(profilePic);
      } catch (err) {
        console.error("Error updating PFP:", err);
        setError("Failed to update PFP");
      }
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        if (status !== "active" && status !== "inactive") {
          setError('Status must be either "active" or "inactive".');
          return;
        }

        const updatedProfile = {
          username: username || profile.username,
          status: status || profile.status,
          email: email,
          profilePic: profilePic,
        };

        await updateProfile(token, updatedProfile);
        setProfile(updatedProfile);
        setEditMode(false);
      } catch (err) {
        console.error("Error updating profile:", err);
        setError("Failed to update profile");
      }
    }
  };

  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const response = await changePassword(token, currentPassword, newPassword);

    if (response.message === "Current password is incorrect") {
      setError(response.message);
    } else {
      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setShowChangePassword(false);
    }
  };
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await logoutUser(token);
        localStorage.removeItem("token");
        router.push("/login");
      } catch (err) {
        console.error("Error logging out:", err);
        setError("Logout failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Profile</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}
        {profile ? (
          <div className="text-center">
            {profile.profilePic ? (
              <img
                src={`http://localhost:8000/uploads/profile-pics/${profile.profilePic}`}
                alt="Profile Picture"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
            ) : (
              <img
                src="/images/default-img.jpg"
                alt="Profile Picture"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
            )}

            <form onSubmit={handlePicEdit}>
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
                Save PFP
              </button>
            </form>
            {editMode ? (
              <div>
                <div className="mb-4">
                  <label className="block text-left">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-left">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <button
                  onClick={handleSaveChanges}
                  className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleEditToggle}
                  className="mt-2 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <p className="text-lg">
                  Username:{" "}
                  <span className="font-medium">{profile.username}</span>
                </p>
                <p className="text-lg">
                  Email: <span className="font-medium">{profile.email}</span>
                </p>
                <p className="text-lg">
                  Status: <span className="font-medium">{profile.status}</span>
                </p>
                <button
                  onClick={handleEditToggle}
                  className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Edit Profile
                </button>
              </div>
            )}

            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Change Password
            </button>

            {showChangePassword && (
              <div className="mt-4">
                <div className="mb-4">
                  <label className="block text-left">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-left">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Save New Password
                </button>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition duration-200"
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
