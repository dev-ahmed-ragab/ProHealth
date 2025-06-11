import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DoctorViewAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/appointments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };
    fetchAppointments();
  }, [token]);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(
        appointments.map((appt) =>
          appt._id === id ? { ...appt, status } : appt
        )
      );
    } catch (err) {
      console.error('Error updating appointment status:', err);
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
        aria-label="My Appointments"
      >
        My Appointments
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Table aria-label="Appointments table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.85rem', md: '1rem' },
                  color: '#1A3C5A',
                }}
              >
                Patient
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.85rem', md: '1rem' },
                  color: '#1A3C5A',
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.85rem', md: '1rem' },
                  color: '#1A3C5A',
                }}
              >
                Time
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.85rem', md: '1rem' },
                  color: '#1A3C5A',
                }}
              >
                Reason
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.85rem', md: '1rem' },
                  color: '#1A3C5A',
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.85rem', md: '1rem' },
                  color: '#1A3C5A',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appt) => (
              <TableRow
                key={appt._id}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f0f4f8',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <TableCell
                  sx={{
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                    color: '#4A6B8A',
                  }}
                >
                  {appt.patientInfo?.name || 'Not available'}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                    color: '#4A6B8A',
                  }}
                >
                  {new Date(appt.date).toLocaleDateString('en-US')}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                    color: '#4A6B8A',
                  }}
                >
                  {appt.startTime}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                    color: '#4A6B8A',
                  }}
                >
                  {appt.reason || 'Not specified'}
                </TableCell>
                <TableCell>
                  <Select
                    value={appt.status}
                    onChange={(e) =>
                      handleStatusChange(appt._id, e.target.value)
                    }
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1A3C5A',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00ACC1',
                      },
                      fontSize: { xs: '0.8rem', md: '0.9rem' },
                      color: '#1A3C5A',
                    }}
                    aria-label={`Change status for appointment ${appt._id}`}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/doctor-dashboard/appointment/${appt._id}`}
                    variant="contained"
                    sx={{
                      backgroundColor: '#00ACC1',
                      color: '#fff',
                      fontSize: { xs: '0.75rem', md: '0.85rem' },
                      fontWeight: 600,
                      textTransform: 'none',
                      px: 2,
                      py: 0.5,
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      '&:hover': {
                        backgroundColor: '#0097A7',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                    aria-label={`View details for appointment ${appt._id}`}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DoctorViewAppointments;
