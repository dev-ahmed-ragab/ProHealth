import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import api, { getErrorMessage, toList } from '../api';

const pad = (value) => String(value).padStart(2, '0');

const toISODate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const todayISO = () => toISODate(new Date());

const formatDate = (value) => {
  if (!value) return '';
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const AvailableSlots = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(todayISO());
  const [slots, setSlots] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [loadedFor, setLoadedFor] = useState('');

  const minDate = useMemo(todayISO, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await api.get('/api/users/protected/doctors');
        if (cancelled) return;
        const list = toList(response.data).sort((a, b) =>
          String(a.name || '').localeCompare(String(b.name || ''))
        );
        setDoctors(list);
        if (list.length > 0) setDoctorId(list[0]._id);
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Could not load the doctor list.'));
        }
      } finally {
        if (!cancelled) setLoadingDoctors(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!doctorId || !date) {
      setSlots([]);
      setLoadedFor('');
      return undefined;
    }

    let cancelled = false;
    const load = async () => {
      setLoadingSlots(true);
      setError('');
      try {
        const response = await api.get(`/api/appointments/available/${doctorId}/${date}`);
        if (cancelled) return;
        setSlots(Array.isArray(response.data?.data) ? response.data.data : []);
        setLoadedFor(date);
      } catch (err) {
        if (!cancelled) {
          setSlots([]);
          setLoadedFor(date);
          setError(getErrorMessage(err, 'Could not load available slots.'));
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [doctorId, date]);

  const selectedDoctor = doctors.find((doctor) => doctor._id === doctorId);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
        Availability lookup
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Check which 30-minute slots are still open for a doctor on a given day.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: '16px',
          border: '1px solid #E6EEF5',
          mb: 3,
        }}
      >
        {loadingDoctors ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CircularProgress size={22} />
            <Typography color="text.secondary">Loading doctors…</Typography>
          </Box>
        ) : doctors.length === 0 ? (
          <Alert severity="info">
            No doctors are registered yet. Promote a user to the doctor role to see
            availability here.
          </Alert>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr auto' },
              gap: 2,
              alignItems: 'center',
            }}
          >
            <Select
              size="small"
              value={doctorId}
              onChange={(event) => setDoctorId(event.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Select doctor' }}
              sx={{ backgroundColor: '#fff' }}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor._id} value={doctor._id}>
                  {doctor.name}
                  {doctor.specialty ? ` · ${doctor.specialty}` : ''}
                </MenuItem>
              ))}
            </Select>
            <TextField
              size="small"
              type="date"
              label="Date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: minDate }}
            />
            <Button
              variant="outlined"
              onClick={() => setDate(todayISO())}
              sx={{ textTransform: 'none' }}
            >
              Today
            </Button>
          </Box>
        )}
      </Paper>

      {loadingSlots ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 5 }}>
          <CircularProgress size={22} />
          <Typography color="text.secondary">Checking availability…</Typography>
        </Box>
      ) : loadedFor ? (
        <Paper
          elevation={0}
          sx={{ p: { xs: 2.5, md: 3 }, borderRadius: '16px', border: '1px solid #E6EEF5' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <EventAvailableIcon sx={{ color: '#00ACC1' }} />
            <Typography sx={{ fontWeight: 700, color: '#1A3C5A' }}>
              {selectedDoctor ? `${selectedDoctor.name} · ` : ''}
              {formatDate(loadedFor)}
            </Typography>
            <Chip
              size="small"
              label={`${slots.length} open ${slots.length === 1 ? 'slot' : 'slots'}`}
              sx={{ backgroundColor: '#E0F7FA', color: '#00707E', fontWeight: 600 }}
            />
          </Box>

          {slots.length === 0 ? (
            <Alert severity="info">
              No open slots on this day. Every time may already be booked, or the day may
              be in the past.
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {slots.map((slot) => {
                const start = typeof slot === 'string' ? slot : slot.startTime;
                const end = typeof slot === 'string' ? '' : slot.endTime;
                return (
                  <Chip
                    key={`${start}-${end}`}
                    label={end ? `${start} – ${end}` : start}
                    sx={{
                      backgroundColor: '#F0F7F8',
                      color: '#1A3C5A',
                      fontWeight: 600,
                      py: 2,
                    }}
                  />
                );
              })}
            </Box>
          )}
        </Paper>
      ) : null}
    </Box>
  );
};

export default AvailableSlots;
