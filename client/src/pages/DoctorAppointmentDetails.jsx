import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DoctorAppointmentDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    reason: '',
    status: '',
    cancellationReason: '',
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/appointments/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const appt = res.data.data;
        setAppointment(appt);
        setFormData({
          date: appt.date.split('T')[0],
          startTime: appt.startTime,
          reason: appt.reason || '',
          status: appt.status,
          cancellationReason: '',
        });
      } catch (err) {
        console.error('Error fetching appointment:', err);
      }
    };
    fetchAppointment();
  }, [id, token]);

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setFormData({ ...formData, date, startTime: '' });
    if (date) {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/appointments/available-slots/${user.user._id}/${date}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAvailableSlots(res.data.data);
      } catch (err) {
        console.error('Error fetching available slots:', err);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/appointments/${id}`,
        {
          date: formData.date,
          startTime: formData.startTime,
          reason: formData.reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointment(res.data.data);
      alert('Appointment updated successfully');
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert(
        'Failed to update appointment: ' +
          (err.response?.data.message || 'Unknown error')
      );
    }
  };

  const handleStatusChange = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/appointments/${id}/status`,
        { status: formData.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointment(res.data.data);
      alert('Appointment status updated successfully');
    } catch (err) {
      console.error('Error updating status:', err);
      alert(
        'Failed to update status: ' +
          (err.response?.data.message || 'Unknown error')
      );
    }
  };

  const handleCancel = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/appointments/${id}/cancel`,
        { cancellationReason: formData.cancellationReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointment(res.data.data);
      alert('Appointment cancelled successfully');
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert(
        'Failed to cancel appointment: ' +
          (err.response?.data.message || 'Unknown error')
      );
    }
  };

  if (!appointment) {
    return (
      <Box
        sx={{
          maxWidth: '1400px',
          mx: 'auto',
          width: '100%',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 4, md: 6 },
          textAlign: 'center',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '0.85rem', md: '1.1rem' },
            color: '#4A6B8A',
            lineHeight: 1.6,
          }}
          aria-label="Loading"
        >
          Loading...
        </Typography>
      </Box>
    );
  }

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
        aria-label="Appointment Details"
      >
        Appointment Details
      </Typography>
      <Box
        sx={{
          maxWidth: '800px',
          mx: 'auto',
          p: { xs: 2, md: 3 },
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <TextField
          fullWidth
          margin="normal"
          label="Patient"
          value={appointment.patientInfo?.name || 'Not available'}
          InputProps={{ readOnly: true }}
          variant="outlined"
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
          aria-label="Patient name"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
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
          aria-label="Select appointment date"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel
            sx={{
              color: '#1A3C5A',
              fontSize: { xs: '0.85rem', md: '1rem' },
            }}
          >
            Time
          </InputLabel>
          <Select
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            sx={{
              borderRadius: '8px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1A3C5A' },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00ACC1',
              },
            }}
            aria-label="Select appointment time"
          >
            <MenuItem value="">Select a time</MenuItem>
            {availableSlots.map((slot) => (
              <MenuItem key={slot} value={slot}>
                {slot}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          multiline
          rows={6}
          variant="outlined"
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
          aria-label="Appointment reason"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel
            sx={{
              color: '#1A3C5A',
              fontSize: { xs: '0.85rem', md: '1rem' },
            }}
          >
            Status
          </InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            sx={{
              borderRadius: '8px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1A3C5A' },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00ACC1',
              },
            }}
            aria-label="Select appointment status"
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleUpdate}
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
            }}
            aria-label="Update appointment"
          >
            Update Appointment
          </Button>
          <Button
            variant="contained"
            onClick={handleStatusChange}
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
            }}
            aria-label="Update status"
          >
            Update Status
          </Button>
        </Box>
        {formData.status !== 'cancelled' && (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Cancellation Reason"
              name="cancellationReason"
              value={formData.cancellationReason}
              onChange={handleChange}
              multiline
              rows={2}
              variant="outlined"
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
              aria-label="Cancellation reason"
            />
            <Button
              variant="contained"
              onClick={handleCancel}
              sx={{
                backgroundColor: '#d32f2f',
                color: '#fff',
                fontSize: { xs: '0.85rem', md: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
                py: 1.5,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
                mt: 2,
              }}
              aria-label="Cancel appointment"
            >
              Cancel Appointment
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DoctorAppointmentDetails;
