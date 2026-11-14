import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EventIcon from '@mui/icons-material/Event';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../api';

const roleLabel = (role = '') =>
  role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Patient';

const roleHome = (role) => {
  if (role === 'admin') {
    return { label: 'Admin dashboard', path: '/admin-dashboard' };
  }
  if (role === 'doctor') {
    return { label: 'Doctor dashboard', path: '/doctor-dashboard' };
  }
  return { label: 'My appointments', path: '/my-appointments' };
};

const ProfilePage = () => {
  const { id } = useParams();
  const {
    user: authUser,
    updateUser,
    updateProfilePicture,
    deleteAccount,
    logout,
  } = useAuth();

  const authId = authUser?.id || authUser?._id;
  const isOwnProfile = Boolean(authId && id === authId);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
  });

  const applyProfile = useCallback((nextProfile) => {
    setProfile(nextProfile);
    setFormData({
      name: nextProfile.name || '',
      email: nextProfile.email || '',
      phone: nextProfile.phone || '',
      bio: nextProfile.bio || '',
    });
  }, []);

  const loadProfile = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await api.get(`/api/users/${id}`);
      applyProfile(response.data?.user || response.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load this profile.'));
    } finally {
      setLoading(false);
    }
  }, [applyProfile, id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateProfilePicture(file);
      await loadProfile();
      setSuccess('Profile picture updated.');
    } catch (err) {
      setError(err.message || 'Could not upload the picture.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateUser(formData);
      await loadProfile();
      setEditOpen(false);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Could not update the profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword.length < 8) {
      setError('The new password must be at least 8 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('The new passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      await api.post(`/api/users/${id}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordOpen(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSuccess('Password updated successfully.');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not change the password.'));
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    setError('');
    try {
      await deleteAccount();
    } catch (err) {
      setError(err.message || 'Could not delete the account.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, py: 8 }}>
        <Alert severity="error">{error || 'Profile not found.'}</Alert>
      </Box>
    );
  }

  const home = roleHome(profile.role);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 3 }, pt: { xs: 11, md: 13 }, pb: { xs: 6, md: 8 } }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3,
            alignItems: { xs: 'center', sm: 'flex-start' },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar
              src={profile.profilePicture || undefined}
              alt={profile.name}
              sx={{ width: 110, height: 110, bgcolor: '#00ACC1', fontSize: 40 }}
            >
              {profile.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            {isOwnProfile && (
              <IconButton
                component="label"
                aria-label="Upload profile picture"
                disabled={saving}
                sx={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#00ACC1',
                  color: '#fff',
                  border: '2px solid #fff',
                  '&:hover': { backgroundColor: '#0097A7' },
                }}
              >
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                />
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
                {profile.name}
              </Typography>
              <Chip
                size="small"
                label={roleLabel(profile.role)}
                sx={{ backgroundColor: '#E0F7FA', color: '#00707E', fontWeight: 600 }}
              />
              {profile.isVerified && (
                <Chip size="small" label="Verified" color="success" variant="outlined" />
              )}
            </Box>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {profile.email}
            </Typography>
            {profile.role === 'doctor' && (
              <Typography sx={{ color: '#00ACC1', fontWeight: 600, mt: 0.5 }}>
                {profile.specialty
                  ? profile.specialty.charAt(0).toUpperCase() +
                    profile.specialty.slice(1)
                  : 'General Practitioner'}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2.5,
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: '#78909C', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Phone
            </Typography>
            <Typography sx={{ color: '#1A3C5A' }}>
              {profile.phone || 'Not added yet'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#78909C', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Member since
            </Typography>
            <Typography sx={{ color: '#1A3C5A' }}>
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : 'Unknown'}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
            <Typography variant="caption" sx={{ color: '#78909C', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Bio
            </Typography>
            <Typography sx={{ color: '#1A3C5A', whiteSpace: 'pre-line' }}>
              {profile.bio || 'No bio added yet.'}
            </Typography>
          </Box>
        </Box>

        {isOwnProfile && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => {
                  setError('');
                  setEditOpen(true);
                }}
                sx={{
                  backgroundColor: '#00ACC1',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#0097A7' },
                }}
              >
                Edit profile
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to={home.path}
                startIcon={<EventIcon />}
                sx={{ textTransform: 'none' }}
              >
                {home.label}
              </Button>
              <Button
                variant="outlined"
                startIcon={<LockResetIcon />}
                onClick={() => setPasswordOpen(true)}
                sx={{ textTransform: 'none' }}
              >
                Change password
              </Button>
              <Button
                variant="text"
                startIcon={<LogoutIcon />}
                onClick={() => logout()}
                sx={{ textTransform: 'none' }}
              >
                Log out
              </Button>
              <Button
                variant="text"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteOpen(true)}
                sx={{ textTransform: 'none', ml: { sm: 'auto' } }}
              >
                Delete account
              </Button>
            </Box>
          </>
        )}
      </Paper>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit profile</DialogTitle>
        <Box component="form" onSubmit={handleEditSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Full name"
              fullWidth
              required
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Phone"
              type="tel"
              fullWidth
              value={formData.phone}
              onChange={(event) =>
                setFormData({ ...formData, phone: event.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Bio"
              fullWidth
              multiline
              minRows={4}
              value={formData.bio}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  bio: event.target.value.slice(0, 500),
                })
              }
              helperText={`${formData.bio.length}/500`}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Change password</DialogTitle>
        <Box component="form" onSubmit={handlePasswordSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Current password"
              type="password"
              fullWidth
              required
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: event.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="New password"
              type="password"
              fullWidth
              required
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: event.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Confirm new password"
              type="password"
              fullWidth
              required
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: event.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordOpen(false)} disabled={passwordSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={passwordSaving}>
              {passwordSaving ? 'Updating…' : 'Update password'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This permanently deletes your account and all related appointments.
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} disabled={saving}>
            Keep my account
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={saving}>
            {saving ? 'Deleting…' : 'Delete account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
