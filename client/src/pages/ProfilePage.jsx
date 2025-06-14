import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: logout, token } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
  });

  const updateUser = async (userData) => {
    try {
      const response = await axios.put(`/api/users/${id}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = response.data.user || response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, msg: 'Profile updated successfully' };
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
      throw err.response?.data?.msg || 'Failed to update profile';
    }
  };

  const updateProfilePicture = async (file) => {
    try {
      if (!file || !['image/jpeg', 'image/png'].includes(file.type)) {
        throw new Error('Please upload a valid image (JPEG or PNG)');
      }
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await axios.post(
        `/api/users/${id}/profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const updatedUser = {
        ...user,
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
        err.response?.data?.msg ||
        err.message ||
        'Failed to update profile picture'
      );
    }
  };

  const deleteAccount = async () => {
    try {
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      return { success: true, msg: 'Account deleted successfully' };
    } catch (err) {
      throw err.response?.data?.msg || 'Failed to delete account';
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view the profile');
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get(`/api/users/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setUser(data);
        setProfilePicture(data.profilePicture || '');
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(
          error.response?.data?.msg ||
            'Failed to fetch user data. Please try again later.'
        );
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const result = await updateProfilePicture(file);
        if (result.success) {
          setProfilePicture(result.profilePicture);
          setUser((prev) => ({
            ...prev,
            profilePicture: result.profilePicture,
          }));
        }
      } catch (err) {
        console.error('Upload error:', err);
        setError(
          err.message ||
            'An error occurred while uploading the profile picture.'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => {
    setEditOpen(false);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateUser(formData);
      if (result.success) {
        setUser((prev) => ({
          ...prev,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
        }));
        handleEditClose();
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'An error occurred while updating the profile');
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOpen = () => setDeleteOpen(true);
  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setError('');
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await deleteAccount();
      navigate('/login');
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'An error occurred while deleting the account.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
        <Alert severity="error">{error || 'Unable to load user data'}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: '1400px',
        mx: 'auto',
        width: '100%',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 10, md: 16 },
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          mx: 'auto',
          p: { xs: 2, md: 3 },
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" flexDirection="column" mb={3}>
            <Avatar
              src={
                profilePicture
                  ? `https://pro-health-backend.vercel.app/${profilePicture}`
                  : undefined
              }
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <IconButton
              component="label"
              sx={{
                backgroundColor: '#1A3C5A',
                color: '#fff',
                '&:hover': { backgroundColor: '#005C97' },
                borderRadius: '50%',
                p: 1,
              }}
              aria-label="Upload profile picture"
            >
              <input
                type="file"
                hidden
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
              />
              <PhotoCameraIcon />
            </IconButton>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.5rem' },
              fontWeight: 700,
              color: '#005C97',
              lineHeight: 1.3,
              letterSpacing: '-0.5px',
            }}
          >
            {user.name || 'Not available'}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: '#4A6B8A', fontSize: { xs: '0.85rem', md: '1rem' } }}
          >
            <strong>Email:</strong> {user.email || 'Not available'}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: '#4A6B8A', fontSize: { xs: '0.85rem', md: '1rem' } }}
          >
            <strong>Phone:</strong> {user.phone || 'Not available'}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: '#4A6B8A', fontSize: { xs: '0.85rem', md: '1rem' } }}
          >
            <strong>Bio:</strong> {user.bio || 'Not available'}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: '#4A6B8A', fontSize: { xs: '0.85rem', md: '1rem' } }}
          >
            <strong>Role:</strong>{' '}
            {user.role
              ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
              : 'Not available'}
          </Typography>
          <Stack direction="column" spacing={2} mt={4}>
            <Button
              variant="contained"
              onClick={handleEditOpen}
              startIcon={<EditIcon />}
              sx={{
                backgroundColor: '#00ACC1',
                color: '#fff',
                fontSize: { xs: '0.85rem', md: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
                py: 1.5,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  backgroundColor: '#0097A7',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
              }}
              aria-label="Edit profile"
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteOpen}
              startIcon={<DeleteIcon />}
              sx={{
                borderColor: '#d32f2f',
                color: '#d32f2f',
                fontSize: { xs: '0.85rem', md: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
                py: 1.5,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#ffebee',
                  borderColor: '#b71c1c',
                  color: '#b71c1c',
                },
              }}
              aria-label="Delete account"
            >
              Delete Account
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/doctor-dashboard/appointments"
              sx={{
                borderColor: '#1A3C5A',
                color: '#1A3C5A',
                fontSize: { xs: '0.85rem', md: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
                py: 1.5,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#f0f4f8',
                  borderColor: '#005C97',
                  color: '#005C97',
                },
              }}
              aria-label="View my appointments"
            >
              My Appointments
            </Button>
            <Button
              variant="outlined"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                borderColor: '#1A3C5A',
                color: '#1A3C5A',
                fontSize: { xs: '0.85rem', md: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
                py: 1.5,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#f0f4f8',
                  borderColor: '#005C97',
                  color: '#005C97',
                },
              }}
              aria-label="Log out"
            >
              Log Out
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form id="edit-form" onSubmit={handleEditSubmit}>
            <TextField
              name="name"
              label="Name"
              type="text"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              required
              margin="normal"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#1A3C5A' },
                  '&:hover fieldset': { borderColor: '#00ACC1' },
                },
                '& .MuiInputLabel-root': {
                  color: '#1A3C5A',
                  fontSize: { xs: '0.85rem', md: '1rem' },
                },
              }}
              aria-label="Enter name"
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
              required
              margin="normal"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#1A3C5A' },
                  '&:hover fieldset': { borderColor: '#00ACC1' },
                },
                '& .MuiInputLabel-root': {
                  color: '#1A3C5A',
                  fontSize: { xs: '0.85rem', md: '1rem' },
                },
              }}
              aria-label="Enter email"
            />
            <TextField
              name="phone"
              label="Phone"
              type="tel"
              fullWidth
              value={formData.phone}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#1A3C5A' },
                  '&:hover fieldset': { borderColor: '#00ACC1' },
                },
                '& .MuiInputLabel-root': {
                  color: '#1A3C5A',
                  fontSize: { xs: '0.85rem', md: '1rem' },
                },
              }}
              aria-label="Enter phone number"
            />
            <TextField
              name="bio"
              label="Bio"
              type="text"
              fullWidth
              value={formData.bio}
              onChange={handleInputChange}
              multiline
              rows={4}
              margin="normal"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#1A3C5A' },
                  '&:hover fieldset': { borderColor: '#00ACC1' },
                },
                '& .MuiInputLabel-root': {
                  color: '#1A3C5A',
                  fontSize: { xs: '0.85rem', md: '1rem' },
                },
              }}
              aria-label="Enter bio"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="edit-form" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogContentText>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={loading}
            color="error"
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
