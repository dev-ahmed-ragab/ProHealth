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

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed'];

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

const DoctorViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [filter, setFilter] = useState('all');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/appointments', {
        params: { limit: 100 },
      });
      setAppointments(toList(response.data));
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load your appointments.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const counts = useMemo(() => {
    return appointments.reduce(
      (acc, appointment) => {
        acc[appointment.status] = (acc[appointment.status] || 0) + 1;
        return acc;
      },
      { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
    );
  }, [appointments]);

  const visibleAppointments = useMemo(() => {
    const list =
      filter === 'all'
        ? appointments
        : appointments.filter((appointment) => appointment.status === filter);

    return [...list].sort((a, b) =>
      `${a.date || ''} ${a.startTime || ''}`.localeCompare(
        `${b.date || ''} ${b.startTime || ''}`
      )
    );
  }, [appointments, filter]);

  const handleStatusChange = async (appointment, status) => {
    setUpdatingId(appointment._id);
    setError('');
    setSuccess('');
    try {
      const response = await api.patch(`/api/appointments/${appointment._id}/status`, {
        status,
      });
      const updated = response.data?.data || { ...appointment, status };
      setAppointments((current) =>
        current.map((item) => (item._id === appointment._id ? { ...item, ...updated } : item))
      );
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
      const updated = response.data?.data || { ...cancelTarget, status: 'cancelled' };
      setAppointments((current) =>
        current.map((item) =>
          item._id === cancelTarget._id ? { ...item, ...updated } : item
        )
      );
      setCancelTarget(null);
      setCancelReason('');
      setSuccess('Appointment cancelled.');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not cancel the appointment.'));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
            My appointments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Confirm requests, mark visits as completed, or cancel a slot.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Select
            size="small"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            inputProps={{ 'aria-label': 'Filter appointments by status' }}
            sx={{ minWidth: 150, backgroundColor: '#fff' }}
          >
            <MenuItem value="all">All statuses</MenuItem>
            {Object.entries(STATUS_STYLES).map(([value, meta]) => (
              <MenuItem key={value} value={value}>
                {meta.label} ({counts[value] || 0})
              </MenuItem>
            ))}
          </Select>
          <Button
            onClick={loadAppointments}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Refresh
          </Button>
        </Box>
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : visibleAppointments.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: '14px',
            border: '1px solid #E6EEF5',
          }}
        >
          <Typography variant="h6" sx={{ color: '#1A3C5A', mb: 1 }}>
            No appointments to show
          </Typography>
          <Typography color="text.secondary">
            {appointments.length === 0
              ? 'New bookings from patients will appear here.'
              : 'There are no appointments with this status.'}
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: '14px',
            border: '1px solid #E6EEF5',
            overflowX: 'auto',
          }}
        >
          <Table sx={{ minWidth: 720 }} aria-label="My appointments">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>When</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleAppointments.map((appointment) => {
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
                      <Typography variant="body2" sx={{ color: '#1A3C5A' }}>
                        {formatDate(appointment.date)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.startTime}
                        {appointment.endTime ? ` – ${appointment.endTime}` : ''}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 240 }}>
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
                            'aria-label': `Status for ${appointment.patientInfo?.name || 'appointment'}`,
                          }}
                          sx={{ minWidth: 130, backgroundColor: '#fff' }}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <MenuItem key={status} value={status}>
                              {STATUS_STYLES[status].label}
                            </MenuItem>
                          ))}
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
                          to={`/doctor-dashboard/appointment/${appointment._id}`}
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
                            variant="text"
                            onClick={() => {
                              setCancelTarget(appointment);
                              setCancelReason('');
                            }}
                            sx={{ textTransform: 'none' }}
                          >
                            Cancel
                          </Button>
                        )}
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
              ? `Cancel the visit with ${
                  cancelTarget.patientInfo?.name || 'this patient'
                } on ${formatDate(cancelTarget.date)} at ${cancelTarget.startTime}?`
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
    </Box>
  );
};

export default DoctorViewAppointments;
