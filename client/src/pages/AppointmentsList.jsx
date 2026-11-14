import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api, { getErrorMessage, toList } from '../api';

const STATUS_STYLES = {
  pending: { label: 'Pending', color: 'warning' },
  confirmed: { label: 'Confirmed', color: 'success' },
  completed: { label: 'Completed', color: 'info' },
  cancelled: { label: 'Cancelled', color: 'default' },
};

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];

const formatDate = (value) => {
  if (!value) return 'No date';
  return new Date(value).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const StatusChip = ({ status }) => {
  const meta = STATUS_STYLES[status] || { label: status || 'Unknown', color: 'default' };
  return <Chip size="small" label={meta.label} color={meta.color} />;
};

function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ status: '', from: '', to: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (filters.status) params.status = filters.status;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const response = await api.get('/api/appointments', { params });
      setAppointments(toList(response.data));
      setPagination(response.data?.pagination || null);
      setError('');
    } catch (err) {
      setAppointments([]);
      setError(getErrorMessage(err, 'Could not load appointments.'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const counts = useMemo(
    () =>
      appointments.reduce((acc, appointment) => {
        acc[appointment.status] = (acc[appointment.status] || 0) + 1;
        return acc;
      }, {}),
    [appointments]
  );

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const clearFilters = () => setFilters({ status: '', from: '', to: '' });

  const replaceAppointment = (updated) => {
    if (!updated?._id) return;
    setAppointments((current) =>
      current.map((item) => (item._id === updated._id ? { ...item, ...updated } : item))
    );
  };

  const handleStatusChange = async (appointment, status) => {
    setUpdatingId(appointment._id);
    setError('');
    setSuccess('');
    try {
      const response = await api.patch(`/api/appointments/${appointment._id}/status`, {
        status,
      });
      replaceAppointment(response.data?.data || { ...appointment, status });
      setSuccess('Appointment status updated.');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update the appointment status.'));
    } finally {
      setUpdatingId('');
    }
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.post(`/api/appointments/${cancelTarget._id}/cancel`, {
        cancellationReason: cancelReason.trim() || undefined,
      });
      replaceAppointment(response.data?.data || { ...cancelTarget, status: 'cancelled' });
      setCancelTarget(null);
      setCancelReason('');
      setSuccess('Appointment cancelled. The slot is available again.');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not cancel the appointment.'));
    } finally {
      setCancelling(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError('');
    setSuccess('');
    try {
      await api.delete(`/api/appointments/${deleteTarget._id}`);
      setAppointments((current) =>
        current.filter((item) => item._id !== deleteTarget._id)
      );
      setDeleteTarget(null);
      setSuccess('Appointment deleted permanently.');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete the appointment.'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
          All appointments
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Filter by status or date, confirm requests, and manage bookings.
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

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: 3,
          borderRadius: '16px',
          border: '1px solid #E6EEF5',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <Select
              fullWidth
              size="small"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Filter by status' }}
              sx={{ backgroundColor: '#fff' }}
            >
              <MenuItem value="">All statuses</MenuItem>
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {STATUS_STYLES[status].label}
                  {counts[status] ? ` (${counts[status]})` : ''}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              name="from"
              label="From date"
              value={filters.from}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              name="to"
              label="To date"
              value={filters.to}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack direction="row" spacing={1}>
              <Button
                onClick={loadAppointments}
                variant="outlined"
                sx={{ textTransform: 'none' }}
              >
                Refresh
              </Button>
              <Button onClick={clearFilters} sx={{ textTransform: 'none' }}>
                Clear
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {pagination && pagination.total > appointments.length && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Showing {appointments.length} of {pagination.total} appointments. Narrow the
            date range to see the rest.
          </Typography>
        )}
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : appointments.length === 0 ? (
        <Paper
          elevation={0}
          sx={{ p: 5, textAlign: 'center', borderRadius: '16px', border: '1px solid #E6EEF5' }}
        >
          <Typography variant="h6" sx={{ color: '#1A3C5A', mb: 1 }}>
            No appointments found
          </Typography>
          <Typography color="text.secondary">
            Try clearing the filters. New bookings will appear here.
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: '16px', border: '1px solid #E6EEF5', overflowX: 'auto' }}
        >
          <Table sx={{ minWidth: 900 }} aria-label="All appointments">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Doctor</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>When</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => {
                const isTerminal = ['completed', 'cancelled'].includes(
                  appointment.status
                );
                return (
                  <TableRow key={appointment._id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, color: '#1A3C5A' }}>
                        {appointment.patientInfo?.name || 'Patient'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.patientInfo?.email || 'No email'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#1A3C5A' }}>
                        {appointment.doctorInfo?.name || 'Doctor'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.doctorInfo?.specialty || 'General'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#1A3C5A' }}>
                        {formatDate(appointment.date)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.startTime}
                        {appointment.endTime ? ` – ${appointment.endTime}` : ''}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {appointment.reason || 'Not specified'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {isTerminal ? (
                        <StatusChip status={appointment.status} />
                      ) : (
                        <Select
                          size="small"
                          value={appointment.status}
                          disabled={updatingId === appointment._id}
                          onChange={(event) =>
                            handleStatusChange(appointment, event.target.value)
                          }
                          inputProps={{
                            'aria-label': `Status for ${
                              appointment.patientInfo?.name || 'appointment'
                            }`,
                          }}
                          sx={{ minWidth: 130, backgroundColor: '#fff' }}
                        >
                          {STATUS_OPTIONS.filter((status) => status !== 'cancelled').map(
                            (status) => (
                              <MenuItem key={status} value={status}>
                                {STATUS_STYLES[status].label}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Button
                          component={Link}
                          to={`/admin-dashboard/appointment/${appointment._id}`}
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          sx={{ textTransform: 'none' }}
                        >
                          Details
                        </Button>
                        {!isTerminal && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => {
                              setCancelTarget(appointment);
                              setCancelReason('');
                            }}
                            sx={{ textTransform: 'none' }}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          size="small"
                          color="inherit"
                          onClick={() => setDeleteTarget(appointment)}
                          sx={{ textTransform: 'none', color: '#7A5C5C' }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Cancel appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {cancelTarget
              ? `Cancel ${cancelTarget.patientInfo?.name || 'this patient'}'s visit on ${formatDate(
                  cancelTarget.date
                )} at ${cancelTarget.startTime}? The slot becomes bookable again.`
              : ''}
          </Typography>
          <TextField
            label="Reason (optional)"
            fullWidth
            multiline
            minRows={2}
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelTarget(null)} disabled={cancelling}>
            Keep appointment
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling…' : 'Cancel appointment'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Delete appointment permanently</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {deleteTarget
              ? `This removes the record for ${
                  deleteTarget.patientInfo?.name || 'this patient'
                } on ${formatDate(deleteTarget.date)} at ${
                  deleteTarget.startTime
                }. This cannot be undone.`
              : ''}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Keep record
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AppointmentsList;
