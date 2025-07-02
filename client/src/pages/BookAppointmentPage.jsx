import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Define the theme for consistent styling
const theme = createTheme({
  palette: {
    primary: {
      main: '#005C97',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

// BookAppointmentPage component
const BookAppointmentPage = () => {
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { doctorId } = useParams();
  const token = localStorage.getItem('token');

  // Fetch doctor information on component mount or when doctorId changes
  useEffect(() => {
    async function fetchDoctorInfo() {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/users/public/doctors/${doctorId}`
        );
        console.log('Doctor data:', response.data);
        setDoctor(response.data.data);
      } catch (err) {
        setError('Error fetching doctor information: ' + err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctorInfo();
  }, [doctorId]);

  // Fetch available appointment slots when date changes
  useEffect(() => {
    if (!date) return;
    async function fetchAvailableSlots() {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/appointments/available/${doctorId}/${date}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Available slots:', response.data.data);
        setSlots(response.data.data);
        setStartTime('');
      } catch (err) {
        setError('Error fetching available slots: ' + err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAvailableSlots();
  }, [date, doctorId, token]);

  // Handle form submission to create an appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !startTime) {
      setError('Please select a date and time');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        '/api/appointments',
        {
          doctorId,
          date,
          startTime,
          reason,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert('Appointment booked successfully!');
        setDate('');
        setStartTime('');
        setReason('');
        setError('');
      } else {
        setError(response.data.message || 'Failed to create appointment');
      }
    } catch (err) {
      setError('Error creating appointment: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="lg"
        sx={{
          my: { xs: 10, md: 12.5 }, // 50px (xs) and 100px (md) margins top/bottom
        }}
      >
        {' '}
        {/* مسافة بين الهيدر و المحتوى */}
        <Grid container spacing={4}>
          {/* Doctor Info Section (Left Sidebar) */}
          <Grid
            item
            sx={{
              width: { sm: '100%', md: '34%' },
            }}
          >
            <Card
              sx={{
                width: '100%',
                height: '100%',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardMedia
                component="img"
                height="auto"
                image={
                  `${doctor?.profilePicture}` ||
                  '/default-doctor.jpg'
                }
                alt={doctor?.name || 'Doctor'}
                sx={{ borderRadius: '12px 12px 0 0', objectFit: 'fit' }}
              />
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: '#1A3C5A', mb: 1 }}
                >
                  Dr. {doctor?.name || 'Loading...'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4A6B8A', mb: 2 }}>
                  Specialty: {doctor?.specialty || 'Not specified'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#4A6B8A' }}>
                  Bio: {doctor?.bio || 'No biography available'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Appointment Form Section (Right Main Content) */}
          <Grid
            sx={{
              width: { sm: '100%', md: '60%' },
            }}
          >
            <Typography variant="h4" gutterBottom>
              Book a New Appointment
            </Typography>
            {loading && <Typography>Loading...</Typography>}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                required
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Available Time</InputLabel>
                <Select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                >
                  <MenuItem value="">Select appointment time</MenuItem>
                  {slots.map((slot) => (
                    <MenuItem key={slot.startTime} value={slot.startTime}>
                      {`${slot.startTime} - ${slot.endTime}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Reason for Appointment (Optional)"
                multiline
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{
                  backgroundColor: '#00ACC1',
                  '&:hover': { backgroundColor: '#0097A7' },
                }}
              >
                Book Appointment
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default BookAppointmentPage;
