import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Grid,
  Container,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { toast } from 'react-toastify';

const columns = [
  { field: 'id', headerName: 'Appointment ID', width: 120 },
  { field: 'patientName', headerName: 'Patient Name', width: 150 },
  { field: 'doctorName', headerName: 'Doctor Name', width: 150 },
  { field: 'date', headerName: 'Date', width: 120 },
  { field: 'startTime', headerName: 'Start Time', width: 100 },
  { field: 'endTime', headerName: 'End Time', width: 100 },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'reason', headerName: 'Reason', width: 200 },
];

const statusOptions = ['pending', 'confirmed', 'cancelled', 'completed'];

function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({ status: '', from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }
      const query = new URLSearchParams(filters).toString();
      const response = await axios.get(`/api/appointments?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('API Response:', response.data); // Debugging log
      if (response.data.data && Array.isArray(response.data.data)) {
        const mappedAppointments = response.data.data.map((appt) => ({
          id: appt._id,
          patientName: appt.patientInfo?.name || 'Unknown',
          doctorName: appt.doctorInfo?.name || 'Unknown',
          date: new Date(appt.date).toLocaleDateString('en-US'),
          startTime: appt.startTime || '',
          endTime: appt.endTime || '',
          status: appt.status || 'pending',
          reason: appt.reason || 'None',
        }));
        console.log('Mapped Appointments:', mappedAppointments); // Debugging log
        setAppointments(mappedAppointments);
      } else {
        toast.info('No appointments found.');
        setAppointments([]);
      }
    } catch (error) {
      console.error(
        'Fetch Appointments Error:',
        error.response || error.message
      ); // Debugging log
      toast.error(
        `Failed to fetch appointments: ${
          error.response?.data?.message || 'Server error'
        }`
      );
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please log in.');
        return;
      }
      await axios.patch(
        `/api/appointments/${appointmentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated successfully');
      fetchAppointments();
    } catch (error) {
      toast.error(
        `Error updating status: ${
          error.response?.data?.message || 'Server error'
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    const reason = prompt('Enter cancellation reason (optional):');
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please log in.');
        return;
      }
      await axios.post(
        `/api/appointments/${appointmentId}/cancel`,
        { cancellationReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Appointment canceled successfully');
      fetchAppointments();
    } catch (error) {
      toast.error(
        `Error canceling appointment: ${
          error.response?.data?.message || 'Server error'
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No authentication token found. Please log in.');
          return;
        }
        await axios.delete(`/api/appointments/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Appointment deleted successfully');
        fetchAppointments();
      } catch (error) {
        toast.error(
          `Error deleting appointment: ${
            error.response?.data?.message || 'Server error'
          }`
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box
      sx={{
        width: '100vw' - '240px',
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg" sx={{ maxWidth: '900px', mx: 'auto' }}>
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          }}
          role="main"
          aria-label="Appointments List"
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
            All Appointments
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3, md: 3 }} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Select
                fullWidth
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                displayEmpty
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
                aria-label="Select Status Filter"
              >
                <MenuItem
                  value=""
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    color: '#1A3C5A',
                  }}
                >
                  All Statuses
                </MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem
                    key={status}
                    value={status}
                    sx={{
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      color: '#1A3C5A',
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                name="from"
                label="From Date"
                value={filters.from}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
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
                aria-label="From Date"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                name="to"
                label="To Date"
                value={filters.to}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
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
                aria-label="To Date"
              />
            </Grid>
          </Grid>

          <Box sx={{ height: 'auto', width: '100%' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress
                  sx={{ color: '#00ACC1' }}
                  aria-label="Loading appointments"
                />
              </Box>
            ) : appointments.length === 0 ? (
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  color: '#4A6B8A',
                  textAlign: 'center',
                  my: 4,
                }}
              >
                No appointments available.
              </Typography>
            ) : (
              <DataGrid
                rows={appointments}
                columns={[
                  ...columns,
                  {
                    field: 'actions',
                    headerName: 'Actions',
                    width: 300,
                    renderCell: (params) => (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Select
                          value={params.row.status}
                          onChange={(e) =>
                            handleStatusChange(params.row.id, e.target.value)
                          }
                          size="small"
                          sx={{
                            minWidth: 100,
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
                          aria-label={`Select status for appointment ${params.row.id}`}
                        >
                          {statusOptions.map((status) => (
                            <MenuItem
                              key={status}
                              value={status}
                              sx={{
                                fontSize: { xs: '0.9rem', md: '1rem' },
                                color: '#1A3C5A',
                              }}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                        <Button
                          variant="contained"
                          onClick={() =>
                            navigate(
                              `/admin-dashboard/appointment/${params.row.id}`
                            )
                          }
                          size="small"
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
                          aria-label={`View details for appointment ${params.row.id}`}
                        >
                          Details
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleCancel(params.row.id)}
                          size="small"
                          disabled={['cancelled', 'completed'].includes(
                            params.row.status
                          )}
                          sx={{
                            backgroundColor: '#d32f2f',
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
                              backgroundColor: '#b71c1c',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            },
                            '&.Mui-disabled': {
                              backgroundColor: 'rgba(0, 0, 0, 0.12)',
                              color: 'rgba(0, 0, 0, 0.26)',
                            },
                          }}
                          aria-label={`Cancel appointment ${params.row.id}`}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleDelete(params.row.id)}
                          size="small"
                          sx={{
                            backgroundColor: '#4A6B8A',
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
                              backgroundColor: '#3a536f',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            },
                          }}
                          aria-label={`Delete appointment ${params.row.id}`}
                        >
                          Delete
                        </Button>
                      </Box>
                    ),
                  },
                ]}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                sx={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fff',
                  '& .MuiDataGrid-columnHeaders': {
                    background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    fontWeight: 600,
                    color: '#1A3C5A',
                  },
                  '& .MuiDataGrid-row': {
                    '&:nth-of-type(even)': {
                      backgroundColor: '#f9fbfc',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 172, 193, 0.1)',
                    },
                  },
                  '& .MuiDataGrid-cell': {
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    color: '#4A6B8A',
                  },
                  '& .MuiTablePagination-root': {
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    color: '#1A3C5A',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    backgroundColor: '#f0f4f8',
                    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                  },
                }}
                aria-label="Appointments Data Grid"
              />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default AppointmentsList;
