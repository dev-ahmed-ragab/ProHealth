import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import api, { getErrorMessage } from '../api';

const STATUS_META = {
  pending: { label: 'Pending', color: 'warning' },
  confirmed: { label: 'Confirmed', color: 'success' },
  completed: { label: 'Completed', color: 'info' },
  cancelled: { label: 'Cancelled', color: 'default' },
};

const EDITABLE_STATUSES = ['pending', 'confirmed', 'completed'];

const formatDate = (value) => {
  if (!value) return 'No date';
  return new Date(value).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [statusDraft, setStatusDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/appointments/${id}`);
        if (cancelled) return;
        const data = response.data?.data;
        setAppointment(data);
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

  const handleStatusChange = async () => {
    if (!statusDraft) return;
    setSavingStatus(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.patch(`/api/appointments/${id}/status`, {
        status: statusDraft,
      });
      if (response.data?.data) {
        setAppointment(response.data.data);
        setStatusDraft(response.data.data.status);
      }
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
      setSuccess('Appointment cancelled. The slot is available again.');
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
          to="/admin-dashboard/appointments"
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
  const isTerminal = ['completed', 'cancelled'].includes(appointment.status);

  return (
    <Box>
      <Button
        component={Link}
        to="/admin-dashboard/appointments"
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
        sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: '16px', border: '1px solid #E6EEF5' }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
            Appointment details
          </Typography>
          <Chip label={statusMeta.label} color={statusMeta.color} />
        </Box>

        <Divider sx={{ my: 2.5 }} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <PersonIcon sx={{ color: '#00ACC1' }} />
            <Box>
              <Typography variant="caption" sx={{ color: '#78909C', textTransform: 'uppercase' }}>
                Patient
              </Typography>
              <Typography sx={{ color: '#1A3C5A', fontWeight: 600 }}>
                {appointment.patientInfo?.name || 'Patient'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {appointment.patientInfo?.email || 'No email'}
              </Typography>
              {appointment.patientInfo?.phone && (
                <Typography variant="body2" color="text.secondary">
                  {appointment.patientInfo.phone}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <MedicalServicesIcon sx={{ color: '#00ACC1' }} />
            <Box>
              <Typography variant="caption" sx={{ color: '#78909C', textTransform: 'uppercase' }}>
                Doctor
              </Typography>
              <Typography sx={{ color: '#1A3C5A', fontWeight: 600 }}>
                Dr. {appointment.doctorInfo?.name || 'Doctor'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {appointment.doctorInfo?.specialty || 'General'}
              </Typography>
            </Box>
          </Box>

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

          {appointment.cancellationReason && (
            <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
              <Typography
                variant="caption"
                sx={{ color: '#78909C', textTransform: 'uppercase' }}
              >
                Cancellation reason
              </Typography>
              <Typography sx={{ color: '#1A3C5A', whiteSpace: 'pre-line' }}>
                {appointment.cancellationReason}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {isTerminal ? (
          <Alert severity="info">
            This appointment is {appointment.status} and can no longer be changed.
          </Alert>
        ) : (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
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
          </Stack>
        )}
      </Paper>

      <Box sx={{ mt: 2 }}>
        <Button
          onClick={() => navigate('/admin-dashboard/appointments')}
          sx={{ textTransform: 'none' }}
        >
          Back to all appointments
        </Button>
      </Box>

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
}

export default AppointmentDetails;
