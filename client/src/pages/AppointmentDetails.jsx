import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Container,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const statusOptions = ['pending', 'confirmed', 'cancelled', 'completed'];

function AppointmentDetails() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointment(response.data.data);
        setStatus(response.data.data.status);
      } catch (error) {
        toast.error('Error fetching appointment details');
      }
    };
    fetchAppointment();
  }, [id]);

  const handleStatusChange = async () => {
    if (!status) {
      toast.error('Please select a status');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `/api/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated successfully');
      const response = await axios.get(`/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointment(response.data.data);
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const handleCancel = async () => {
    const reason = prompt('Enter cancellation reason (optional):');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/appointments/${id}/cancel`,
        { cancellationReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Appointment cancelled successfully');
      navigate('/admin-dashboard/appointments');
    } catch (error) {
      toast.error('Error cancelling appointment');
    }
  };

  if (!appointment) {
    return (
      <Container
        maxWidth="sm"
        sx={{ maxWidth: '800px', mx: 'auto', py: { xs: 6, md: 8 } }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
            color: '#4A6B8A',
            textAlign: 'center',
          }}
        >
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="sm" sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          }}
          role="article"
          aria-label="Appointment Details"
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
              fontWeight: 700,
              color: '#005C97',
              mb: 3,
              lineHeight: 1.3,
              letterSpacing: '-0.5px',
            }}
          >
            Appointment Details
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
                color: '#4A6B8A',
                lineHeight: 1.6,
                mb: 1,
              }}
            >
              <strong>Appointment ID:</strong> {appointment._id}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
                color: '#4A6B8A',
                lineHeight: 1.6,
                mb: 1,
              }}
            >
              <strong>Patient Name:</strong>{' '}
              {appointment.patientInfo?.name || 'Unknown'}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
                color: '#4A6B8A',
                lineHeight: 1.6,
                mb: 1,
              }}
            >
              <strong>Doctor Name:</strong>{' '}
              {appointment.doctorInfo?.name || 'Unknown'}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
                color: '#4A6B8A',
                lineHeight: 1.6,
                mb: 1,
              }}
            >
              <strong>Date:</strong>{' '}
              {new Date(appointment.date).toLocaleDateString('en-US')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
                color: '#4A6B8A',
                lineHeight: 1.6,
                mb: 1,
              }}
            >
              <strong>Start Time:</strong> {appointment.startTime}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
                color: '#4A6B8A',
                lineHeight: 1.6,
                mb: 1,
              }}
            >
              <strong>End Time:</strong> {appointment.endTime}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
                color: '#4A6B8A',
                lineHeight: 1.6,
                mb: 1,
              }}
            >
              <strong>Reason:</strong> {appointment.reason || 'None'}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
                color: '#4A6B8A',
                lineHeight: 1.6,
                mb: 1,
              }}
            >
              <strong>Notes:</strong> {appointment.notes || 'None'}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
                color: '#4A6B8A',
                lineHeight: 1.6,
                mb: 1,
              }}
            >
              <strong>Status:</strong> {appointment.status}
            </Typography>
          </Box>
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{
                minWidth: 150,
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
              aria-label="Select Appointment Status"
            >
              {statusOptions.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    color: '#1A3C5A',
                  }}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              onClick={handleStatusChange}
              sx={{
                backgroundColor: '#00ACC1',
                color: '#fff',
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 600,
                px: 3,
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
              }}
              aria-label="Update Status"
            >
              Update Status
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleCancel}
              disabled={['cancelled', 'completed'].includes(appointment.status)}
              sx={{
                backgroundColor: '#d32f2f',
                color: '#fff',
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                },
              }}
              aria-label="Cancel Appointment"
            >
              Cancel Appointment
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/admin-dashboard/appointments')}
              sx={{
                backgroundColor: '#4A6B8A',
                color: '#fff',
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  backgroundColor: '#3a536f',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
              }}
              aria-label="Back to Appointments"
            >
              Back
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default AppointmentDetails;
