import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Container,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

function CreateAppointment() {
  const [form, setForm] = useState({
    doctorId: '',
    date: '',
    startTime: '',
    reason: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No authentication token found. Please log in.');
          return;
        }
        const response = await axios.get('/api/users/doctors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Doctors API Response:', response.data); // Debugging log
        setDoctors(response.data);
      } catch (error) {
        toast.error(
          `Failed to fetch doctors: ${
            error.response?.data?.message || 'Server error'
          }`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (form.doctorId && form.date) {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            toast.error('No authentication token found. Please log in.');
            return;
          }
          const response = await axios.get(
            `/api/appointments/available/${form.doctorId}/${form.date}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('Available Slots API Response:', response.data.data); // Debugging log
          setAvailableSlots(response.data.data || []);
        } catch (error) {
          toast.error(
            `Failed to fetch available slots: ${
              error.response?.data?.message || 'Server error'
            }`
          );
          setAvailableSlots([]);
        } finally {
          setLoading(false);
        }
      } else {
        setAvailableSlots([]);
      }
    };
    fetchAvailableSlots();
  }, [form.doctorId, form.date]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.doctorId || !form.date || !form.startTime) {
      toast.error(
        'Please fill in all required fields: Doctor, Date, and Start Time.'
      );
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please log in.');
        return;
      }
      const response = await axios.post('/api/appointments', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Created Appointment:', response.data); // Debugging log
      toast.success('Appointment created successfully');
      navigate('/admin-dashboard/appointments');
    } catch (error) {
      toast.error(
        `Failed to create appointment: ${
          error.response?.data?.message || 'Server error'
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg" sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          }}
          role="main"
          aria-label="Create Appointment"
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
              fontWeight: 700,
              color: '#005C97',
              mb: 4,
              lineHeight: 1.3,
              letterSpacing: '-0.5px',
              textAlign: 'left',
              pl: { xs: 0, md: 3 },
            }}
          >
            Create New Appointment
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress
                sx={{ color: '#00ACC1' }}
                aria-label="Loading form data"
              />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Select
                    fullWidth
                    name="doctorId"
                    value={form.doctorId}
                    onChange={handleChange}
                    displayEmpty
                    required
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1A3C5A',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00ACC1',
                      },
                      '& .MuiSelect-select': {
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: '#1A3C5A',
                      },
                    }}
                    aria-label="Select Doctor"
                  >
                    <MenuItem
                      value=""
                      disabled
                      sx={{
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: '#1A3C5A',
                      }}
                    >
                      Select a Doctor
                    </MenuItem>
                    {doctors.map((doctor) => (
                      <MenuItem
                        key={doctor._id}
                        value={doctor._id}
                        sx={{
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          color: '#1A3C5A',
                        }}
                      >
                        {doctor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    name="date"
                    label="Date"
                    value={form.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': { borderColor: '#1A3C5A' },
                        '&:hover fieldset': { borderColor: '#00ACC1' },
                      },
                      '& .MuiInputLabel-root': { color: '#1A3C5A' },
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: '#1A3C5A',
                      },
                    }}
                    aria-label="Select Date"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Select
                    fullWidth
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    displayEmpty
                    required
                    disabled={!form.doctorId || !form.date}
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1A3C5A',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00ACC1',
                      },
                      '& .MuiSelect-select': {
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: '#1A3C5A',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                    aria-label="Select Start Time"
                  >
                    <MenuItem
                      value=""
                      disabled
                      sx={{
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: '#1A3C5A',
                      }}
                    >
                      Select Start Time
                    </MenuItem>
                    {availableSlots.map((slot, index) => (
                      <MenuItem
                        key={index}
                        value={slot}
                        sx={{
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          color: '#1A3C5A',
                        }}
                      >
                        {slot}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="reason"
                    label="Reason for Appointment"
                    value={form.reason}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': { borderColor: '#1A3C5A' },
                        '&:hover fieldset': { borderColor: '#00ACC1' },
                      },
                      '& .MuiInputLabel-root': { color: '#1A3C5A' },
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        color: '#1A3C5A',
                      },
                    }}
                    aria-label="Enter Reason for Appointment"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      backgroundColor: '#00ACC1',
                      color: '#fff',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: '8px',
                      textTransform: 'none',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#0097A7',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(0, 0, 0, 0.12)',
                        color: 'rgba(0, 0, 0, 0.26)',
                      },
                    }}
                    aria-label="Create Appointment"
                  >
                    {loading ? 'Creating...' : 'Create Appointment'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default CreateAppointment;
