import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function MyAppointmentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelAppointmentId, setCancelAppointmentId] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    date: '',
    startTime: '',
    reason: '',
  });

  // Redirect if not a user
  useEffect(() => {
    if (!user || user.user.role !== 'user') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch user appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get('/api/appointments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAppointments(
          res.data.data.filter((app) => app.status !== 'cancelled')
        );
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments');
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  // Open update dialog and populate form
  const handleOpenUpdateDialog = async (appointmentId) => {
    try {
      const res = await axios.get(`/api/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const appointment = res.data.data;
      setSelectedAppointment(appointment);
      setUpdateForm({
        date: new Date(appointment.date).toISOString().split('T')[0],
        startTime: appointment.startTime,
        reason: appointment.reason || '',
      });
      setOpenUpdateDialog(true);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointment details:', err);
      setError('Failed to load appointment details');
    }
  };

  // Close update dialog
  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedAppointment(null);
    setUpdateForm({ date: '', startTime: '', reason: '' });
  };
  // Update appointment
  const handleUpdateAppointment = async () => {
    try {
      // Validate date
      if (!updateForm.date) {
        setError('التاريخ مطلوب');
        return;
      }
      const selectedDate = new Date(updateForm.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        setError('لا يمكن تحديث الموعد إلى تاريخ في الماضي');
        return;
      }

      // Validate time format
      if (
        !updateForm.startTime ||
        !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(updateForm.startTime)
      ) {
        setError('صيغة الوقت غير صحيحة (استخدم HH:MM)');
        return;
      }
      const res = await axios.put(
        `/api/appointments/${selectedAppointment._id}`,
        updateForm,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setAppointments(
        appointments.map((app) =>
          app._id === selectedAppointment._id ? res.data.data : app
        )
      );
      setError(null);
      handleCloseUpdateDialog();
    } catch (err) {
      console.error('Error updating appointment:', err);
      const errorMessage = err.response?.data?.message || 'فشل في تحديث الموعد';
      setError(errorMessage);
    }
  };

  // Open cancel dialog
  const handleOpenCancelDialog = (appointmentId) => {
    setCancelAppointmentId(appointmentId);
    setOpenCancelDialog(true);
  };

  // Close cancel dialog
  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
    setCancelReason('');
    setCancelAppointmentId(null);
  };

  // Confirm cancel
  const handleConfirmCancel = async () => {
    try {
      const res = await axios.post(
        `/api/appointments/${cancelAppointmentId}/cancel`,
        { cancellationReason: cancelReason },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setAppointments(
        appointments.filter((app) => app._id !== cancelAppointmentId)
      );
      setError(null);
      handleCloseCancelDialog();
    } catch (err) {
      console.error('Error canceling appointment:', err);
      setError('Failed to cancel appointment');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography>Loading appointments...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (appointments.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No appointments found.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/find-doctor"
          >
            Book an Appointment
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Appointments
        </Typography>
        {isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {appointments.map((appointment) => {
              console.log(appointment);
              return (
                <TableRow
                  key={appointment._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f0f4f8',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    },
                  }}
                >
                  <TableCell sx={{ color: '#4A6B8A' }}>
                    {new Date(appointment.date).toLocaleDateString('en-US')}
                  </TableCell>
                  <TableCell sx={{ color: '#4A6B8A' }}>
                    {typeof appointment.startTime === 'object'
                      ? JSON.stringify(appointment.startTime)
                      : appointment.startTime || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: '#4A6B8A' }}>
                    {typeof appointment.endTime === 'object'
                      ? JSON.stringify(appointment.endTime)
                      : appointment.endTime || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: '#4A6B8A' }}>
                    {
                      {
                        pending: 'Pending',
                        confirmed: 'Confirmed',
                        cancelled: 'Cancelled',
                        completed: 'Completed',
                      }[appointment.status]
                    }
                  </TableCell>
                  <TableCell sx={{ color: '#4A6B8A' }}>
                    {appointment.reason}
                  </TableCell>
                  <TableCell>
                    {appointment.status === 'pending' && (
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#00ACC1',
                          color: '#fff',
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          fontWeight: 600,
                          px: 2,
                          py: 1,
                          borderRadius: '8px',
                          textTransform: 'none',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                          transition:
                            'transform 0.3s ease, box-shadow 0.3s ease',
                          '&:hover': {
                            backgroundColor: '#0097A7',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                          },
                        }}
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setOpenCancelDialog(true);
                        }}
                        aria-label={`Cancel appointment on ${new Date(
                          appointment.date
                        ).toLocaleDateString('en-US')}`}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment, index) => (
                  <TableRow
                    key={appointment._id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',
                    }}
                  >
                    <TableCell>
                      {appointment.doctorInfo?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {new Date(appointment.date).toLocaleDateString('en-US')}
                    </TableCell>
                    <TableCell>{appointment.startTime}</TableCell>
                    <TableCell>{appointment.status}</TableCell>
                    <TableCell>
                      {appointment.reason || 'Not specified'}
                    </TableCell>
                    <TableCell>
                      {appointment.status !== 'completed' && (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ mx: 1 }}
                            onClick={() =>
                              handleOpenUpdateDialog(appointment._id)
                            }
                          >
                            Update
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            sx={{ mx: 1 }}
                            onClick={() =>
                              handleOpenCancelDialog(appointment._id)
                            }
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Update Appointment Dialog */}
      <Dialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update Appointment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            value={updateForm.date}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, date: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Start Time (HH:MM)"
            fullWidth
            value={updateForm.startTime}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, startTime: e.target.value })
            }
            error={
              updateForm.startTime &&
              !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(updateForm.startTime)
            }
            helperText={
              updateForm.startTime &&
              !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(updateForm.startTime)
                ? 'Use HH:MM format (e.g., 14:30)'
                : ''
            }
          />
          <TextField
            margin="dense"
            label="Reason"
            fullWidth
            value={updateForm.reason}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, reason: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button onClick={handleUpdateAppointment} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Appointment Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={handleCloseCancelDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Reason for Cancellation (Optional)"
            fullWidth
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>Close</Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            color="secondary"
          >
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyAppointmentsPage;
