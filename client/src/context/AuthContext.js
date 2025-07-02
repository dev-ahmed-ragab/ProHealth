import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL ='https://pro-health-backend.vercel.app';
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check auth on initial load
  useEffect(() => {
    if (token) {
      axios
        .get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status < 500,
        })
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      navigate(
        res.data.user.role === 'admin'
          ? '/admin-dashboard'
          : res.data.user.role === 'doctor'
          ? '/doctor-dashboard'
          : '/'
      );
    } catch (err) {
      throw err.response.data.msg || 'Login failed';
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      await axios.post('/api/auth/register', { name, email, password });
      navigate('/verify-email-sent');
    } catch (err) {
      throw err.response.data.msg || 'Registration failed';
    }
  };

  // Verify email function
  const verifyEmail = async (token) => {
    try {
      await axios.get(`/api/auth/verify-email/${token}`);
      navigate('/login');
    } catch (err) {
      throw err.response.data.msg || 'Email verification failed';
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const response = await axios.put(`/api/users/${user.user.id}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, msg: 'Profile updated successfully' };
    } catch (err) {
      if (err.response && err.response.status === 401) {
        logout(); // Only logout on authentication failure
      }
      throw err.response?.data.msg || 'Failed to update profile';
    }
  };

  // Update profile picture
  const updateProfilePicture = async (file) => {
    try {
      if (!file || !['image/jpeg', 'image/png'].includes(file.type)) {
        throw new Error('Please upload a valid image (JPEG or PNG)');
      }
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await axios.post(
        `/api/users/${user.user.id}/profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedUser = {
        ...user.user,
        profilePicture: response.data.profilePicture,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return {
        success: true,
        msg: 'Profile picture updated successfully',
        profilePicture: response.data.profilePicture,
      };
    } catch (err) {
      console.error('Upload error:', err);
      throw (
        err.response?.data.msg ||
        err.message ||
        'Failed to update profile picture'
      );
    }
  };

  // Delete account
  const deleteAccount = async () => {
    try {
      await axios.delete(`/api/users/${user.user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      return { success: true, msg: 'Account deleted successfully' };
    } catch (err) {
      throw err.response.data.msg || 'Failed to delete account';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        verifyEmail,
        updateUser,
        updateProfilePicture,
        deleteAccount,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
