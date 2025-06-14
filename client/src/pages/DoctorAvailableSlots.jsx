import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DoctorAvailableSlots = () => {
  const { user } = useAuth();
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios
        .get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status < 500,
        })
        .then((res) => {
          setDoctorId(res.data.user.id || '');
        })
        .catch((error) => {
          console.error('Auth verification failed:', error);
        });
    }
  }, [token]);

  const handleFetchSlots = async () => {
    try {
      setError(null);
      if (!doctorId) {
        setError('Doctor ID not available');
        return;
      }
      if (!date) {
        setError('Please enter a date');
        return;
      }

      const res = await axios.get(
        `https://pro-health-backend.vercel.app/api/appointments/available/${doctorId}/${date}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSlots(res.data.data || []);
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError(
        err.response?.data?.message || 'Failed to fetch slots: Unknown error'
      );
      setSlots([]);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: '1400px',
        mx: 'auto',
        width: '100%',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 4, md: 6 },
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.5rem' },
          fontWeight: 700,
          color: '#005C97',
          lineHeight: 1.3,
          letterSpacing: '-0.5px',
          mb: 3,
        }}
        aria-label="Available Slots"
      >
        Available Slots
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mb: 3,
          maxWidth: '800px',
          mx: 'auto',
          p: { xs: 2, md: 3 },
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.1rem' },
            color: '#4A6B8A',
            lineHeight: 1.6,
          }}
        >
          Doctor ID: {doctorId || 'Not available'}
        </Typography>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': { borderColor: '#1A3C5A' },
              '&:hover fieldset': { borderColor: '#00ACC1' },
            },
            '& .MuiInputLabel-root': {
              color: '#1A3C5A',
              fontSize: { xs: '0.85rem', md: '1rem' },
            },
          }}
          aria-label="Select date for available slots"
        />
        <Button
          variant="contained"
          onClick={handleFetchSlots}
          disabled={!doctorId || !date}
          sx={{
            backgroundColor: '#00ACC1',
            color: '#fff',
            fontSize: { xs: '0.85rem', md: '1rem' },
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            py: 1.5,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              backgroundColor: '#0097A7',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            },
            '&:disabled': {
              backgroundColor: 'rgba(0, 172, 193, 0.5)',
              color: '#fff',
            },
          }}
          aria-label="Fetch available slots"
        >
          Show Slots
        </Button>
      </Box>
      {error && (
        <Typography
          variant="body1"
          sx={{
            color: '#d32f2f',
            fontSize: { xs: '0.85rem', md: '1.1rem' },
            mb: 2,
            textAlign: 'center',
          }}
          aria-label="Error message"
        >
          {error}
        </Typography>
      )}
      {slots.length > 0 ? (
        <List
          sx={{
            maxWidth: '800px',
            mx: 'auto',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            p: 2,
          }}
        >
          {slots.map((slot, index) => (
            <ListItem
              key={index}
              sx={{
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#f0f4f8',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
              role="article"
              aria-label={`Slot from ${slot.startTime} to ${slot.endTime}`}
            >
              <ListItemText
                primary={`From ${slot.startTime} to ${slot.endTime}`}
                primaryTypographyProps={{
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 600,
                  color: '#1A3C5A',
                }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        date &&
        doctorId &&
        !error && (
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.85rem', md: '1.1rem' },
              color: '#4A6B8A',
              textAlign: 'center',
              mt: 2,
            }}
          >
            No slots available for this date
          </Typography>
        )
      )}
    </Box>
  );
};

export default DoctorAvailableSlots;
