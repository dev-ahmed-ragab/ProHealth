import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import api, { getErrorMessage, toList } from '../api';

const ROLE_COLORS = {
  admin: 'secondary',
  doctor: 'info',
  user: 'default',
};

const SPECIALTIES = [
  { value: '', label: 'Not specified' },
  { value: 'general', label: 'General' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'dermatology', label: 'Dermatology' },
];

const EMPTY_FORM = { name: '', email: '', role: 'user', specialty: '' };

const formatJoined = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 200 };
      if (search) params.search = search;
      const response = await api.get('/api/users', { params });
      setUsers(toList(response.data));
      setPagination(response.data?.pagination || null);
      setError('');
    } catch (err) {
      setUsers([]);
      setError(getErrorMessage(err, 'Could not load users.'));
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const counts = useMemo(
    () =>
      users.reduce(
        (acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        },
        { user: 0, doctor: 0, admin: 0 }
      ),
    [users]
  );

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      specialty: user.specialty || '',
    });
    setError('');
    setSuccess('');
  };

  const closeEdit = () => {
    if (saving) return;
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!form.name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError('Enter a valid email address.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      };
      if (form.role === 'doctor') payload.specialty = form.specialty || null;

      const response = await api.put(`/api/users/${editing._id}`, payload);
      const updated = response.data?.user;
      if (updated) {
        setUsers((current) =>
          current.map((user) => (user._id === updated._id ? { ...user, ...updated } : user))
        );
      }
      setEditing(null);
      setForm(EMPTY_FORM);
      setSuccess(`${payload.name}'s account was updated.`);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update this user.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError('');
    setSuccess('');
    try {
      await api.delete(`/api/users/${deleteTarget._id}`);
      setUsers((current) => current.filter((user) => user._id !== deleteTarget._id));
      setDeleteTarget(null);
      setSuccess(`${deleteTarget.name}'s account was removed.`);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete this user.'));
    } finally {
      setDeleting(false);
    }
  };

  const submitSearch = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
          User management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {pagination?.total ?? users.length} accounts · {counts.doctor} doctors ·{' '}
          {counts.admin} admins
        </Typography>
      </Box>

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

      <Box
        component="form"
        onSubmit={submitSearch}
        sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}
      >
        <TextField
          size="small"
          placeholder="Search by name or email"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: { xs: '100%', sm: 300 }, backgroundColor: '#fff' }}
        />
        <Button type="submit" variant="outlined" sx={{ textTransform: 'none' }}>
          Search
        </Button>
        {search && (
          <Button
            onClick={() => {
              setSearchInput('');
              setSearch('');
            }}
            sx={{ textTransform: 'none' }}
          >
            Clear
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : users.length === 0 ? (
        <Paper
          elevation={0}
          sx={{ p: 5, textAlign: 'center', borderRadius: '16px', border: '1px solid #E6EEF5' }}
        >
          <Typography variant="h6" sx={{ color: '#1A3C5A', mb: 1 }}>
            No users found
          </Typography>
          <Typography color="text.secondary">
            {search ? 'Try a different search term.' : 'Registered accounts will appear here.'}
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: '16px', border: '1px solid #E6EEF5', overflowX: 'auto' }}
        >
          <Table sx={{ minWidth: 760 }} aria-label="Registered users">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Account</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Specialty</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Joined</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={user.profilePicture || undefined}
                        alt={user.name}
                        sx={{ width: 36, height: 36, bgcolor: '#00ACC1', fontSize: '0.9rem' }}
                      >
                        {user.name?.charAt(0)?.toUpperCase() || <PersonIcon fontSize="small" />}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600, color: '#1A3C5A' }} noWrap>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={user.role}
                      color={ROLE_COLORS[user.role] || 'default'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>
                    {user.specialty || '—'}
                  </TableCell>
                  <TableCell>{formatJoined(user.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="View profile">
                        <IconButton
                          component={Link}
                          to={`/profile/${user._id}`}
                          size="small"
                          aria-label={`View ${user.name}'s profile`}
                        >
                          <PersonIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit account">
                        <IconButton
                          size="small"
                          onClick={() => openEdit(user)}
                          aria-label={`Edit ${user.name}`}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete account">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteTarget(user)}
                          aria-label={`Delete ${user.name}`}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={Boolean(editing)} onClose={closeEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Changes apply immediately. Changing a role to doctor unlocks that account's
            dashboard.
          </Typography>
          <Stack spacing={2}>
            <TextField label="Name" name="name" fullWidth value={form.name} onChange={handleChange} />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />
            <TextField select label="Role" name="role" fullWidth value={form.role} onChange={handleChange}>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            {form.role === 'doctor' && (
              <TextField
                select
                label="Specialty"
                name="specialty"
                fullWidth
                value={form.specialty}
                onChange={handleChange}
              >
                {SPECIALTIES.map((option) => (
                  <MenuItem key={option.value || 'none'} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{
              backgroundColor: '#00ACC1',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#0097A7' },
            }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} fullWidth maxWidth="sm">
        <DialogTitle>Delete account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {deleteTarget
              ? `Remove ${deleteTarget.name} (${deleteTarget.email})? Their appointments stay in the system but the account can no longer sign in.`
              : ''}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Keep account
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList;
