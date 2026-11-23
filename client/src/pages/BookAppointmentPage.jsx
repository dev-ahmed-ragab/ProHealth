import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import api, { API_BASE_URL, getErrorMessage } from '../api';

const FALLBACK_IMAGE = '/images/team-member-4.jpg';

const resolveDoctorImage = (pic) => {
  if (!pic) return FALLBACK_IMAGE;
  if (pic.startsWith('http://') || pic.startsWith('https://')) return pic;
  if (pic.startsWith('/images/')) return pic;
  if (pic.startsWith('/uploads/')) return `${API_BASE_URL}${pic}`;
  if (pic.startsWith('uploads/')) return `${API_BASE_URL}/${pic}`;
  return pic;
};

const todayISO = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const formatDate = (value) => {
  if (!value) return '';
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const BookAppointmentPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const minDate = useMemo(todayISO, []);
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchDoctor = async () => {
      setLoadingDoctor(true);
      try {
        const response = await api.get(`/api/users/public/doctors/${doctorId}`);
        if (!cancelled) {
          setDoctor(response.data?.data || null);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Could not load this doctor.'));
        }
      } finally {
        if (!cancelled) setLoadingDoctor(false);
      }
    };

    fetchDoctor();
    return () => {
      cancelled = true;
    };
  }, [doctorId]);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      setStartTime('');
      return undefined;
    }

    let cancelled = false;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setError('');
      try {
        const response = await api.get(
          `/api/appointments/available/${doctorId}/${date}`
        );
        if (!cancelled) {
          setSlots(Array.isArray(response.data?.data) ? response.data.data : []);
          setStartTime('');
        }
      } catch (err) {
        if (!cancelled) {
          setSlots([]);
          setError(getErrorMessage(err, 'Could not load available times.'));
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    };

    fetchSlots();
    return () => {
      cancelled = true;
    };
  }, [date, doctorId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!date) {
      setError('Please choose an appointment date.');
      return;
    }
    if (!startTime) {
      setError('Please choose an available time.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/api/appointments', {
        doctorId,
        date,
        startTime,
        reason: reason.trim() || undefined,
      });

      setConfirmed(response.data?.data || { date, startTime });
      setDate('');
      setSlots([]);
      setStartTime('');
      setReason('');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not book the appointment.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctor) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 2, py: 8 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" component={Link} to="/find-doctor">
              Browse doctors
            </Button>
          }
        >
          {error || 'This doctor could not be found.'}
        </Alert>
      </Box>
    );
  }

  if (confirmed) {
    return (
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 2, py: { xs: 6, md: 10 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            textAlign: 'center',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#00ACC1', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A3C5A', mb: 1 }}>
            Appointment requested
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Your request with Dr. {doctor.name} was sent. You will see it in your
            appointments with a pending status until the doctor confirms it.
          </Typography>
          <Box
            sx={{
              backgroundColor: '#F0F7F8',
              borderRadius: '12px',
              p: 2.5,
              mb: 4,
              textAlign: 'left',
            }}
          >
            <Typography sx={{ color: '#1A3C5A', fontWeight: 600 }}>
              {formatDate(confirmed.date || date)}
            </Typography>
            <Typography color="text.secondary">
              {confirmed.startTime || startTime}
              {confirmed.endTime ? ` – ${confirmed.endTime}` : ''}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate('/my-appointments')}
              sx={{
                backgroundColor: '#00ACC1',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#0097A7' },
              }}
            >
              View my appointments
            </Button>
            <Button variant="outlined" onClick={() => setConfirmed(null)}>
              Book another time
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 5, md: 8 } }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: 700, color: '#1A3C5A', mb: 1 }}
      >
        Book an appointment
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Choose a day and an available 30-minute slot.
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            elevation={0}
            sx={{ borderRadius: '14px', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)' }}
          >
            <CardMedia
              component="img"
              height="240"
              image={resolveDoctorImage(doctor.profilePicture)}
              alt={`Dr. ${doctor.name}`}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1A3C5A' }}>
                Dr. {doctor.name}
              </Typography>
              <Chip
                label={
                  doctor.specialty
                    ? doctor.specialty.charAt(0).toUpperCase() +
                      doctor.specialty.slice(1)
                    : 'General Practitioner'
                }
                size="small"
                sx={{ my: 1, backgroundColor: '#E0F7FA', color: '#00707E' }}
              />
              <Typography variant="body2" color="text.secondary">
                {doctor.bio || 'This doctor has not added a biography yet.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{ p: { xs: 2.5, md: 4 }, borderRadius: '14px', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)' }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Appointment date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: minDate }}
                required
                sx={{ mb: 3 }}
              />

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: '#1A3C5A', mb: 1 }}
              >
                Available times
              </Typography>

              {!date ? (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Pick a date to see the doctor&apos;s available times.
                </Typography>
              ) : loadingSlots ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2, mb: 2 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">
                    Checking availability…
                  </Typography>
                </Box>
              ) : slots.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  No times are available on this day. Please try another date.
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {slots.map((slot) => {
                    const value =
                      typeof slot === 'string' ? slot : slot.startTime;
                    const selected = startTime === value;
                    return (
                      <Chip
                        key={value}
                        label={
                          typeof slot === 'string'
                            ? slot
                            : `${slot.startTime} – ${slot.endTime}`
                        }
                        onClick={() => setStartTime(value)}
                        color={selected ? 'primary' : 'default'}
                        icon={selected ? <EventAvailableIcon /> : undefined}
                        sx={{
                          px: 0.5,
                          py: 2,
                          fontWeight: 600,
                          backgroundColor: selected ? '#00ACC1' : '#F0F4F8',
                          color: selected ? '#fff' : '#1A3C5A',
                          '& .MuiChip-icon': { color: '#fff' },
                          '&:hover': {
                            backgroundColor: selected ? '#0097A7' : '#E0F7FA',
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              <TextField
                fullWidth
                label="Reason for visit (optional)"
                multiline
                minRows={3}
                value={reason}
                onChange={(event) => setReason(event.target.value.slice(0, 500))}
                helperText={`${reason.length}/500`}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting || !date || !startTime}
                sx={{
                  backgroundColor: '#00ACC1',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': { backgroundColor: '#0097A7' },
                }}
              >
                {submitting ? 'Booking…' : 'Confirm appointment'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookAppointmentPage;
