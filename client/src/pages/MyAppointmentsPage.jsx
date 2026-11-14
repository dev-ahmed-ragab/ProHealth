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
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import api, { getErrorMessage, toList } from '../api';

const STATUS_STYLES = {
  pending: { label: 'Pending', color: 'warning' },
  confirmed: { label: 'Confirmed', color: 'success' },
  completed: { label: 'Completed', color: 'info' },
  cancelled: { label: 'Cancelled', color: 'default' },
};

const todayISO = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const formatDate = (value) => {
  if (!value) return 'Date not set';
  return new Date(value).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const StatusChip = ({ status }) => {
  const style = STATUS_STYLES[status] || {
    label: status || 'Unknown',
    color: 'default',
  };
  return <Chip size="small" label={style.label} color={style.color} />;
};

function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tab, setTab] = useState('upcoming');

  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);

  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const fetchAppointments = useCallback(async () => {
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
    fetchAppointments();
  }, [fetchAppointments]);

  const now = useMemo(() => new Date(), []);

  const filtered = useMemo(() => {
    return appointments.filter((appointment) => {
      const isCancelled = appointment.status === 'cancelled';
      const appointmentDate = new Date(appointment.date);
      const isPast =
        appointment.status === 'completed' || appointmentDate < now;

      if (tab === 'cancelled') return isCancelled;
      if (tab === 'past') return !isCancelled && isPast;
      return !isCancelled && !isPast;
    });
  }, [appointments, now, tab]);

  const counts = useMemo(
    () => ({
      upcoming: appointments.filter(
        (a) =>
          a.status !== 'cancelled' &&
          a.status !== 'completed' &&
          new Date(a.date) >= now
      ).length,
      past: appointments.filter(
        (a) =>
          a.status !== 'cancelled' &&
          (a.status === 'completed' || new Date(a.date) < now)
      ).length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    }),
    [appointments, now]
  );

  const openReschedule = (appointment) => {
    setRescheduleTarget(appointment);
    setRescheduleDate(
      new Date(appointment.date).toISOString().slice(0, 10) || todayISO()
    );
    setRescheduleTime(appointment.startTime || '');
    setRescheduleSlots([]);
    setError('');
  };

  useEffect(() => {
    if (!rescheduleTarget || !rescheduleDate) {
      setRescheduleSlots([]);
      return undefined;
    }

    let cancelled = false;
    const loadSlots = async () => {
      setLoadingSlots(true);
      try {
        const doctorId =
          rescheduleTarget.doctor || rescheduleTarget.doctorInfo?._id;
        const response = await api.get(
          `/api/appointments/available/${doctorId}/${rescheduleDate}`
        );
        if (!cancelled) {
          const slots = toList(response.data);
          // Keep the current slot selectable when the user just changes the reason.
          const current = rescheduleTarget.startTime;
          const hasCurrent = slots.some(
            (slot) => (slot.startTime || slot) === current
          );
          setRescheduleSlots(
            hasCurrent || !current
              ? slots
              : [
                  {
                    startTime: current,
                    endTime: rescheduleTarget.endTime || '',
                  },
                  ...slots,
                ]
          );
        }
      } catch (err) {
        if (!cancelled) {
          setRescheduleSlots([]);
          setError(getErrorMessage(err, 'Could not load available times.'));
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    };

    loadSlots();
    return () => {
      cancelled = true;
    };
  }, [rescheduleTarget, rescheduleDate]);

  const handleReschedule = async () => {
    if (!rescheduleTarget) return;
    setSaving(true);
    setError('');
    try {
      await api.put(`/api/appointments/${rescheduleTarget._id}`, {
        date: rescheduleDate,
        startTime: rescheduleTime,
        reason: rescheduleTarget.reason || undefined,
      });
      setRescheduleTarget(null);
      setSuccess('Your appointment was updated.');
      await fetchAppointments();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update the appointment.'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setSaving(true);
    setError('');
    try {
      await api.post(`/api/appointments/${cancelTarget._id}/cancel`, {
        cancellationReason: cancelReason.trim() || undefined,
      });
      setCancelTarget(null);
      setCancelReason('');
      setSuccess('Your appointment was cancelled.');
      await fetchAppointments();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not cancel the appointment.'));
    } finally {
      setSaving(false);
    }
  };

  const canModify = (appointment) =>
    ['pending', 'confirmed'].includes(appointment.status) &&
    new Date(appointment.date) >= new Date(new Date().toDateString());

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 2, md: 3 }, pt: { xs: 11, md: 13 }, pb: { xs: 6, md: 8 } }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
            My Appointments
          </Typography>
          <Typography color="text.secondary">
            Track, reschedule, or cancel your visits.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/find-doctor"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: '#00ACC1',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#0097A7' },
          }}
        >
          Book new appointment
        </Button>
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

      <Paper elevation={0} sx={{ borderRadius: '14px', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)' }}>
        <Tabs
          value={tab}
          onChange={(event, value) => setTab(value)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ borderBottom: '1px solid #E5EAF0', px: 1 }}
        >
          <Tab value="upcoming" label={`Upcoming (${counts.upcoming})`} />
          <Tab value="past" label={`Past (${counts.past})`} />
          <Tab value="cancelled" label={`Cancelled (${counts.cancelled})`} />
        </Tabs>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {filtered.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <EventBusyIcon sx={{ fontSize: 52, color: '#B0BEC5', mb: 1 }} />
              <Typography variant="h6" sx={{ color: '#1A3C5A' }}>
                Nothing here yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {tab === 'upcoming'
                  ? 'You have no upcoming appointments.'
                  : tab === 'past'
                  ? 'You have no past appointments.'
                  : 'You have no cancelled appointments.'}
              </Typography>
              {tab === 'upcoming' && (
                <Button
                  component={Link}
                  to="/find-doctor"
                  variant="outlined"
                  startIcon={<AddIcon />}
                >
                  Find a doctor
                </Button>
              )}
            </Box>
          ) : (
            <Stack spacing={2}>
              {filtered.map((appointment) => (
                <Box
                  key={appointment._id}
                  sx={{
                    border: '1px solid #E5EAF0',
                    borderRadius: '12px',
                    p: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    alignItems: { xs: 'stretch', md: 'center' },
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontWeight: 700, color: '#1A3C5A' }}>
                        Dr. {appointment.doctorInfo?.name || 'Unknown doctor'}
                      </Typography>
                      <StatusChip status={appointment.status} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(appointment.date)} · {appointment.startTime}
                      {appointment.endTime ? ` – ${appointment.endTime}` : ''}
                    </Typography>
                    {appointment.reason && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Reason: {appointment.reason}
                      </Typography>
                    )}
                  </Box>

                  {canModify(appointment) && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => openReschedule(appointment)}
                      >
                        Reschedule
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setCancelTarget(appointment);
                          setCancelReason('');
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>

      <Dialog
        open={Boolean(rescheduleTarget)}
        onClose={() => setRescheduleTarget(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Reschedule appointment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="New date"
            type="date"
            fullWidth
            value={rescheduleDate}
            onChange={(event) => setRescheduleDate(event.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: todayISO() }}
          />

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: '#1A3C5A' }}>
            Available times
          </Typography>

          {loadingSlots ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Loading times…
              </Typography>
            </Box>
          ) : rescheduleSlots.length === 0 ? (
            <Alert severity="info">No times available on that date.</Alert>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {rescheduleSlots.map((slot) => {
                const value = slot.startTime || slot;
                const selected = rescheduleTime === value;
                return (
                  <Chip
                    key={value}
                    label={slot.endTime ? `${slot.startTime} – ${slot.endTime}` : value}
                    onClick={() => setRescheduleTime(value)}
                    sx={{
                      fontWeight: 600,
                      backgroundColor: selected ? '#00ACC1' : '#F0F4F8',
                      color: selected ? '#fff' : '#1A3C5A',
                      '&:hover': { backgroundColor: selected ? '#0097A7' : '#E0F7FA' },
                    }}
                  />
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRescheduleTarget(null)}>Close</Button>
          <Button
            variant="contained"
            onClick={handleReschedule}
            disabled={saving || !rescheduleDate || !rescheduleTime}
            sx={{ backgroundColor: '#00ACC1', '&:hover': { backgroundColor: '#0097A7' } }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogActions>
      </Dialog>

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
              ? `Cancel your visit with Dr. ${
                  cancelTarget.doctorInfo?.name || 'this doctor'
                } on ${formatDate(cancelTarget.date)}?`
              : ''}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField
            label="Reason for cancellation (optional)"
            fullWidth
            multiline
            minRows={2}
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelTarget(null)}>Keep appointment</Button>
          <Button color="error" variant="contained" onClick={handleCancel} disabled={saving}>
            {saving ? 'Cancelling…' : 'Cancel appointment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyAppointmentsPage;
