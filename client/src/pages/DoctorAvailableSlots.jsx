import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../api';

const pad = (value) => String(value).padStart(2, '0');

const toISODate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const todayISO = () => toISODate(new Date());

const tomorrowISO = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toISODate(date);
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

const DoctorAvailableSlots = () => {
  const { user } = useAuth();
  const doctorId = user?.id || user?._id;

  const [date, setDate] = useState(todayISO());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadedFor, setLoadedFor] = useState('');

  const minDate = useMemo(todayISO, []);

  useEffect(() => {
    if (!doctorId || !date) {
      setSlots([]);
      return undefined;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(
          `/api/appointments/available/${doctorId}/${date}`
        );
        if (!cancelled) {
          setSlots(Array.isArray(response.data?.data) ? response.data.data : []);
          setLoadedFor(date);
        }
      } catch (err) {
        if (!cancelled) {
          setSlots([]);
          setLoadedFor(date);
          setError(getErrorMessage(err, 'Could not load your availability.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [date, doctorId]);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
        Availability
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Your bookable slots are 30 minutes each, from 08:00 to 17:00. Times with an
        active appointment are hidden automatically.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: '16px',
          border: '1px solid #E6EEF5',
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', sm: 'flex-end' },
          }}
        >
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: minDate }}
            sx={{ maxWidth: { sm: 260 }, width: '100%' }}
          />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant={date === todayISO() ? 'contained' : 'outlined'}
              onClick={() => setDate(todayISO())}
              sx={{
                textTransform: 'none',
                backgroundColor: date === todayISO() ? '#00ACC1' : undefined,
                '&:hover': {
                  backgroundColor:
                    date === todayISO() ? '#0097A7' : 'rgba(0, 172, 193, 0.08)',
                },
              }}
            >
              Today
            </Button>
            <Button
              variant={date === tomorrowISO() ? 'contained' : 'outlined'}
              onClick={() => setDate(tomorrowISO())}
              sx={{
                textTransform: 'none',
                backgroundColor: date === tomorrowISO() ? '#00ACC1' : undefined,
                '&:hover': {
                  backgroundColor:
                    date === tomorrowISO() ? '#0097A7' : 'rgba(0, 172, 193, 0.08)',
                },
              }}
            >
              Tomorrow
            </Button>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 5 }}>
          <CircularProgress size={22} />
          <Typography color="text.secondary">Checking availability…</Typography>
        </Box>
      ) : loadedFor ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: '16px',
            border: '1px solid #E6EEF5',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
              mb: 2,
            }}
          >
            <EventAvailableIcon sx={{ color: '#00ACC1' }} />
            <Typography sx={{ fontWeight: 700, color: '#1A3C5A' }}>
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
              No open slots on this day. Every time may already be booked, or the day
              may be in the past.
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
      ) : (
        <Alert severity="info">Pick a date to see your open slots.</Alert>
      )}
    </Box>
  );
};

export default DoctorAvailableSlots;
