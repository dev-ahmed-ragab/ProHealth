import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const homeForRole = (role) => {
  if (role === 'admin') return '/admin-dashboard';
  if (role === 'doctor') return '/doctor-dashboard';
  return '/';
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const tokenRef = useRef(token);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const persistSession = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem('token', nextToken);
    } else {
      localStorage.removeItem('token');
    }

    if (nextUser) {
      localStorage.setItem('user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('user');
    }

    setToken(nextToken || null);
    setUser(nextUser || null);
  }, []);

  const logout = useCallback(
    (options = {}) => {
      persistSession(null, null);
      if (options.redirect !== false) {
        navigate('/login', { replace: true });
      }
    },
    [navigate, persistSession]
  );

  // Session expiry is broadcast by the axios interceptor in src/api.js.
  useEffect(() => {
    const handleUnauthorized = () => {
      if (tokenRef.current) {
        persistSession(null, null);
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () =>
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [navigate, persistSession]);

  // Validate any stored token once on load and refresh the cached profile.
  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/auth/me');
        if (cancelled) return;
        persistSession(storedToken, response.data?.user || null);
      } catch (error) {
        if (cancelled) return;
        // Keep the cached user on a network/server hiccup; only clear the
        // session when the server explicitly rejects the token.
        if (error?.response?.status === 401) {
          persistSession(null, null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadSession();
    return () => {
      cancelled = true;
    };
  }, [persistSession]);

  const login = useCallback(
    async (email, password, redirectTo) => {
      try {
        const response = await api.post('/api/auth/login', {
          email: email.trim().toLowerCase(),
          password,
        });

        const nextToken = response.data?.token;
        const nextUser = response.data?.user;

        if (!nextToken || !nextUser) {
          throw new Error('Unexpected response from the server');
        }

        persistSession(nextToken, nextUser);
        navigate(redirectTo || homeForRole(nextUser.role), { replace: true });
        return nextUser;
      } catch (error) {
        throw new Error(getErrorMessage(error, 'Login failed'));
      }
    },
    [navigate, persistSession]
  );

  const register = useCallback(async (name, email, password) => {
    try {
      const response = await api.post('/api/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      return response.data?.msg || 'Account created successfully';
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Registration failed'));
    }
  }, []);

  const verifyEmail = useCallback(async (verificationToken) => {
    try {
      const response = await api.get(
        `/api/auth/verify-email/${verificationToken}`
      );
      return response.data?.msg || 'Email verified successfully';
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Email verification failed'));
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      const response = await api.post('/api/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });
      return (
        response.data?.msg ||
        'If an account exists with that email, reset instructions were sent.'
      );
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not send reset email'));
    }
  }, []);

  const resetPassword = useCallback(async (resetToken, password) => {
    try {
      const response = await api.post(
        `/api/auth/reset-password/${resetToken}`,
        { password }
      );
      return response.data?.msg || 'Password reset successfully';
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Could not reset password'));
    }
  }, []);

  const updateUser = useCallback(
    async (userData) => {
      if (!user?.id && !user?._id) {
        throw new Error('You need to sign in again');
      }
      const id = user.id || user._id;
      try {
        const response = await api.put(`/api/users/${id}`, userData);
        const updatedUser = response.data?.user;
        if (updatedUser) {
          persistSession(tokenRef.current, updatedUser);
        }
        return response.data?.msg || 'Profile updated successfully';
      } catch (error) {
        throw new Error(getErrorMessage(error, 'Failed to update profile'));
      }
    },
    [persistSession, user]
  );

  const updateProfilePicture = useCallback(
    async (file) => {
      if (!file || !['image/jpeg', 'image/png'].includes(file.type)) {
        throw new Error('Please upload a valid image (JPEG or PNG)');
      }

      const id = user?.id || user?._id;
      if (!id) throw new Error('You need to sign in again');

      const formData = new FormData();
      formData.append('profilePicture', file);

      try {
        const response = await api.post(
          `/api/users/${id}/profile-picture`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        const updatedUser =
          response.data?.user ||
          (user
            ? { ...user, profilePicture: response.data?.profilePicture }
            : null);

        if (updatedUser) {
          persistSession(tokenRef.current, updatedUser);
        }

        return response.data?.msg || 'Profile picture updated successfully';
      } catch (error) {
        throw new Error(
          getErrorMessage(error, 'Failed to update profile picture')
        );
      }
    },
    [persistSession, user]
  );

  const deleteAccount = useCallback(async () => {
    const id = user?.id || user?._id;
    if (!id) throw new Error('You need to sign in again');

    try {
      await api.delete(`/api/users/${id}`);
      persistSession(null, null);
      navigate('/', { replace: true });
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete account'));
    }
  }, [navigate, persistSession, user]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      verifyEmail,
      forgotPassword,
      resetPassword,
      updateUser,
      updateProfilePicture,
      deleteAccount,
    }),
    [
      user,
      token,
      loading,
      login,
      register,
      logout,
      verifyEmail,
      forgotPassword,
      resetPassword,
      updateUser,
      updateProfilePicture,
      deleteAccount,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}

export default AuthContext;
