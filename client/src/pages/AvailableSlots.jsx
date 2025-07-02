import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

// AvailableSlots component to fetch and display available appointment slots
const AvailableSlots = () => {
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);

  // Fetch list of doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/doctors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(response.data);
      } catch (error) {
        toast.error('Error fetching doctors list');
      }
    };
    fetchDoctors();
  }, []);

  // Fetch available slots when doctorId or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (doctorId && date) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `/api/appointments/available/${doctorId}/${date}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setSlots(response.data.data);
        } catch (error) {
          toast.error('Error fetching available slots');
        }
      }
    };
    fetchSlots();
  }, [doctorId, date]);

  return (
    <Box
      sx={{
        maxWidth: '800px',
        mx: 'auto',
        p: { xs: 3, md: 4 },
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        my: 8,
      }}
      role="form"
      aria-label="Available Appointment Slots"
    >
      <Typography
        variant="h5"
        sx={{
          fontSize: { xs: '1.25rem', md: '1.5rem' },
          fontWeight: 600,
          color: '#1A3C5A',
          mb: 3,
          textAlign: 'left',
        }}
      >
        Available Appointments
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: '52px',
                height: '52px',
                backgroundColor: '#00ACC1',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              <PersonIcon sx={{ fontSize: 28, color: '#fff' }} />
            </Box>
            <Select
              fullWidth
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              displayEmpty
              variant="outlined"
              sx={{
                borderRadius: '8px',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1A3C5A',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00ACC1',
                },
              }}
              aria-label="Select Doctor"
            >
              <MenuItem value="" disabled>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#4A6B8A',
                    fontSize: { xs: '0.95rem', md: '1rem' },
                  }}
                >
                  Select Doctor
                </Typography>
              </MenuItem>
              {doctors.map((doctor) => (
                <MenuItem key={doctor._id} value={doctor._id}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#1A3C5A',
                      fontSize: { xs: '0.95rem', md: '1rem' },
                    }}
                  >
                    {doctor.name}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: '52px',
                height: '52px',
                backgroundColor: '#00ACC1',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 28, color: '#fff' }} />
            </Box>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              sx={{
                borderRadius: '8px',
                '.MuiInputLabel-root': { color: '#1A3C5A' },
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1A3C5A',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00ACC1',
                },
              }}
              aria-label="Select Appointment Date"
            />
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#1A3C5A',
            fontSize: '1.1rem',
            mb: 2,
            textAlign: 'left',
          }}
        >
          Available Slots:
        </Typography>
        <List>
          {slots.length > 0 ? (
            slots.map((slot, index) => (
              <ListItem
                key={index}
                sx={{
                  borderRadius: '12px',
                  background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  mb: 1,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  },
                }}
                role="article"
                aria-label={`Available slot: from ${slot.startTime} to ${slot.endTime}`}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#1A3C5A',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        fontWeight: 600,
                      }}
                    >
                      {`From ${slot.startTime} to ${slot.endTime}`}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{ color: '#4A6B8A', fontSize: '0.9rem', lineHeight: 1.5 }}
            >
              No available slots
            </Typography>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default AvailableSlots;