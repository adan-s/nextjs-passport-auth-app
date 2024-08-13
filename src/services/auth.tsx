const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const registerUser = async (formData: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const verifyEmail = async (token: string) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/verify-email?token=${token}`,
    {
      method: "GET",
    }
  );
  return response.json();
};

export const getProfile = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return response.json();
};

export async function logoutUser(token: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export const updateProfile = async (token: string, formData: any) => {
  const form = new FormData();
  form.append("username", formData.username);
  form.append("status", formData.status);
  form.append("email", formData.email)

  console.log('updating user with form data:', formData);

   if (formData.profilePic) {
    form.append("profilePic", formData.profilePic);
  }

  const response = await fetch(`${API_BASE_URL}/profile/update`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  return response.json();
};

export const changePassword = async (
  token: string | null,
  currentPassword: string,
  newPassword: string
) => {
  const response = await fetch(`${API_BASE_URL}/profile/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return response.json();
};
