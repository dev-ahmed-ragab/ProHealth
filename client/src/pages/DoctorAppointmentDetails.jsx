import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import api, { getErrorMessage } from '../api';

const STATUS_META = {
  pending: { label: 'Pending', color: 'warning' },
  confirmed: { label: 'Confirmed', color: 'success' },
  completed: { label: 'Completed', color: 'info' },
  cancelled: { label: 'Cancelled', color: 'default' },
};

const EDITABLE_STATUSES = ['pending', 'confirmed', 'completed'];

const pad = (value) => String(value).padStart(2, '0');

const todayISO = () => {
  const date = new Date();
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const dateKey = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const formatDate = (value) => {
  if (!value) return 'No date';
  return new Date(value).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const DoctorAppointmentDetails = () => {
  const { id } = useParams();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [form, setForm] = useState({ date: '', startTime: '', reason: '' });
  const [statusDraft, setStatusDraft] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingReschedule, setSavingReschedule] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const minDate = useMemo(todayISO, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/appointments/${id}`);
        if (cancelled) return;
        const data = response.data?.data;
        setAppointment(data);
        setForm({
          date: dateKey(data?.date) || todayISO(),
          startTime: data?.startTime || '',
          reason: data?.reason || '',
        });
        setStatusDraft(data?.status || 'pending');
        setLoadError('');
      } catch (err) {
        if (!cancelled) {
          setLoadError(getErrorMessage(err, 'Could not load this appointment.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const doctorId = appointment?.doctor || null;
  const currentDate = appointment ? dateKey(appointment.date) : '';

  useEffect(() => {
    if (!doctorId || !form.date) {
      setSlots([]);
      return undefined;
    }

    let cancelled = false;
    const load = async () => {
      setSlotsLoading(true);
      try {
        const response = await api.get(
          `/api/appointments/available/${doctorId}/${form.date}`
        );
        if (cancelled) return;
        const list = Array.isArray(response.data?.data) ? response.data.data : [];

        // The appointment itself occupies its slot, so the server hides it.
        // Keep the current time selectable when the date did not change.
        if (
          appointment &&
          form.date === currentDate &&
          appointment.startTime &&
          !list.some((slot) => slot.startTime === appointment.startTime)
        ) {
          list.unshift({
            startTime: appointment.startTime,
            endTime: appointment.endTime || '',
          });
        }

        setSlots(list);
      } catch (err) {
        if (!cancelled) {
          setSlots([]);
          setError(getErrorMessage(err, 'Could not load available times.'));
        }
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [appointment, currentDate, doctorId, form.date]);

  const isTerminal = ['completed', 'cancelled'].includes(appointment?.status);

  const handleDateChange = (value) => {
    setForm((current) => ({
      ...current,
      date: value,
      startTime: value === currentDate ? appointment?.startTime || '' : '',
    }));
  };

  const handleReschedule = async (event) => {
    event.preventDefault();
    if (!form.date || !form.startTime) {
      setError('Choose a date and a time before saving.');
      return;
    }

    setSavingReschedule(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.put(`/api/appointments/${id}`, {
        date: form.date,
        startTime: form.startTime,
        reason: form.reason.trim() || undefined,
      });
      const updated = response.data?.data;
      if (updated) {
        setAppointment(updated);
        setForm({
          date: dateKey(updated.date) || form.date,
          startTime: updated.startTime || form.startTime,
          reason: updated.reason || '',
        });
        setStatusDraft(updated.status || statusDraft);
      }
      setSuccess('Appointment updated successfully.');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update the appointment.'));
    } finally {
      setSavingReschedule(false);
    }
  };

  const handleStatusChange = async () => {
    if (!statusDraft) return;
    setSavingStatus(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.patch(`/api/appointments/${id}/status`, {
        status: statusDraft,
      });
      if (response.data?.data) setAppointment(response.data.data);
      setSuccess('Appointment status updated.');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update the appointment status.'));
    } finally {
      setSavingStatus(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.post(`/api/appointments/${id}/cancel`, {
        cancellationReason: cancelReason.trim() || undefined,
      });
      if (response.data?.data) {
        setAppointment(response.data.data);
        setStatusDraft(response.data.data.status);
      }
      setCancelOpen(false);
      setCancelReason('');
      setSuccess('Appointment cancelled.');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not cancel the appointment.'));
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loadError || !appointment) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError || 'Appointment not found.'}
        </Alert>
        <Button
          component={Link}
          to="/doctor-dashboard/appointments"
          startIcon={<ArrowBackIcon />}
          sx={{ textTransform: 'none' }}
        >
          Back to appointments
        </Button>
      </Box>
    );
  }

  const statusMeta = STATUS_META[appointment.status] || {
    label: appointment.status,
    color: 'default',
  };

  return (
    <Box>
      <Button
        component={Link}
        to="/doctor-dashboard/appointments"
        startIcon={<ArrowBackIcon />}
        sx={{ textTransform: 'none', mb: 2 }}
      >
        Back to appointments
      </Button>

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
          p: { xs: 2.5, md: 3.5 },
          borderRadius: '16px',
          border: '1px solid #E6EEF5',
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#E0F7FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PersonIcon sx={{ color: '#00707E' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
                {appointment.patientInfo?.name || 'Patient'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {appointment.patientInfo?.email || 'No email provided'}
                {appointment.patientInfo?.phone
                  ? ` · ${appointment.patientInfo.phone}`
                  : ''}
              </Typography>
            </Box>
          </Box>
          <Chip label={statusMeta.label} color={statusMeta.color} />
        </Box>

        <Divider sx={{ my: 2.5 }} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: '#78909C', textTransform: 'uppercase' }}>
              Date
            </Typography>
            <Typography sx={{ color: '#1A3C5A', fontWeight: 600 }}>
              {formatDate(appointment.date)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#78909C', textTransform: 'uppercase' }}>
              Time
            </Typography>
            <Typography sx={{ color: '#1A3C5A', fontWeight: 600 }}>
              {appointment.startTime}
              {appointment.endTime ? ` – ${appointment.endTime}` : ''}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
            <Typography variant="caption" sx={{ color: '#78909C', textTransform: 'uppercase' }}>
              Reason for visit
            </Typography>
            <Typography sx={{ color: '#1A3C5A', whiteSpace: 'pre-line' }}>
              {appointment.reason || 'No reason provided.'}
            </Typography>
          </Box>
          {appointment.notes && (
            <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
              <Typography
                variant="caption"
                sx={{ color: '#78909C', textTransform: 'uppercase' }}
              >
                Notes
              </Typography>
              <Typography sx={{ color: '#1A3C5A', whiteSpace: 'pre-line' }}>
                {appointment.notes}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {isTerminal ? (
        <Alert severity="info">
          This appointment is {appointment.status} and can no longer be changed.
        </Alert>
      ) : (
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{ p: { xs: 2.5, md: 3 }, borderRadius: '16px', border: '1px solid #E6EEF5' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A3C5A', mb: 2 }}>
              Update status
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Select
                size="small"
                value={statusDraft}
                onChange={(event) => setStatusDraft(event.target.value)}
                inputProps={{ 'aria-label': 'Appointment status' }}
                sx={{ minWidth: 170, backgroundColor: '#fff' }}
              >
                {EDITABLE_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {STATUS_META[status].label}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                onClick={handleStatusChange}
                disabled={savingStatus || statusDraft === appointment.status}
                sx={{
                  backgroundColor: '#00ACC1',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#0097A7' },
                }}
              >
                {savingStatus ? 'Saving…' : 'Save status'}
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={() => setCancelOpen(true)}
                sx={{ textTransform: 'none', ml: { sm: 'auto' } }}
              >
                Cancel appointment
              </Button>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{ p: { xs: 2.5, md: 3 }, borderRadius: '16px', border: '1px solid #E6EEF5' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A3C5A', mb: 0.5 }}>
              Reschedule
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Move this visit to another open 30-minute slot.
            </Typography>

            <Box component="form" onSubmit={handleReschedule}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <TextField
                  label="New date"
                  type="date"
                  value={form.date}
                  onChange={(event) => handleDateChange(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: minDate }}
                  fullWidth
                />
                <TextField
                  select
                  label="New time"
                  value={form.startTime}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, startTime: event.target.value }))
                  }
                  disabled={slotsLoading}
                  fullWidth
                  helperText={
                    slotsLoading
                      ? 'Loading available times…'
                      : slots.length === 0
                      ? 'No open times on this date.'
                      : `${slots.length} open ${
                          slots.length === 1 ? 'slot' : 'slots'
                        } on this date.`
                  }
                >
                  {slots.map((slot) => (
                    <MenuItem
                      key={`${slot.startTime}-${slot.endTime}`}
                      value={slot.startTime}
                    >
                      {slot.endTime
                        ? `${slot.startTime} – ${slot.endTime}`
                        : slot.startTime}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <TextField
                label="Reason for visit"
                fullWidth
                multiline
                minRows={3}
                value={form.reason}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    reason: event.target.value.slice(0, 500),
                  }))
                }
                helperText={`${form.reason.length}/500`}
                sx={{ mt: 2 }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={savingReschedule || slotsLoading || !form.startTime}
                sx={{
                  mt: 2,
                  backgroundColor: '#00ACC1',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#0097A7' },
                }}
              >
                {savingReschedule ? 'Saving…' : 'Save changes'}
              </Button>
            </Box>
          </Paper>
        </Stack>
      )}

      <Dialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Cancel appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This frees the {appointment.startTime} slot on {formatDate(appointment.date)}{' '}
            for other patients.
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
          <Button onClick={() => setCancelOpen(false)} disabled={cancelling}>
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

export default DoctorAppointmentDetails;
