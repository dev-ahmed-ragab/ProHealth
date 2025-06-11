import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Grid,
  Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const columns = [
  { field: 'id', headerName: 'Appointment ID', width: 120 },
  { field: 'patientName', headerName: 'Patient Name', width: 150 },
  { field: 'date', headerName: 'Date', width: 120 },
  { field: 'startTime', headerName: 'Start Time', width: 100 },
  { field: 'endTime', headerName: 'End Time', width: 100 },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'reason', headerName: 'Reason', width: 200 },
];

const statusOptions = ['pending', 'confirmed', 'cancelled', 'completed'];

function DoctorAppointments() {
  const [doctorId, setDoctorId] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({ status: '', from: '', to: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/doctors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(response.data);
      } catch (error) {
        toast.error('Error fetching doctors');
      }
    };
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    if (!doctorId) return;
    try {
      const token = localStorage.getItem('token');
      const query = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `/api/appointments/doctor/${doctorId}?${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(
        response.data.data.map((appt) => ({
          id: appt._id,
          patientName: appt.patientInfo?.name || 'Unknown',
          date: new Date(appt.date).toLocaleDateString('en-US'),
          startTime: appt.startTime,
          endTime: appt.endTime,
          status: appt.status,
          reason: appt.reason || 'None',
        }))
      );
    } catch (error) {
      toast.error('Error fetching appointments');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [doctorId, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
        aria-label="Doctor Appointments"
      >
        Doctor Appointments
      </Typography>
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          p: { xs: 2, md: 3 },
          mb: 3,
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Select
              fullWidth
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
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
                  fontSize: { xs: '0.85rem', md: '1rem' },
                  color: '#1A3C5A',
                },
              }}
              aria-label="Select doctor"
            >
              <MenuItem value="" disabled>
                Select a Doctor
              </MenuItem>
              {doctors.map((doctor) => (
                <MenuItem key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
                  fontSize: { xs: '0.85rem', md: '1rem' },
                  color: '#1A3C5A',
                },
              }}
              aria-label="Select status"
            >
              <MenuItem value="">All Statuses</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              name="from"
              label="From Date"
              value={filters.from}
              onChange={handleFilterChange}
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
              aria-label="Select start date"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              name="to"
              label="To Date"
              value={filters.to}
              onChange={handleFilterChange}
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
              aria-label="Select end date"
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          height: 400,
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          '& .MuiDataGrid-root': {
            border: 'none',
            '& .MuiDataGrid-cell': {
              color: '#1A3C5A',
              fontSize: { xs: '0.8rem', md: '0.9rem' },
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              color: '#1A3C5A',
              fontWeight: 600,
              fontSize: { xs: '0.85rem', md: '1rem' },
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f0f4f8',
            },
          },
        }}
      >
        <DataGrid
          rows={appointments}
          columns={[
            ...columns,
            {
              field: 'actions',
              headerName: 'Actions',
              width: 150,
              renderCell: (params) => (
                <Button
                  variant="contained"
                  onClick={() =>
                    navigate(`/doctor-dashboard/appointment/${params.row.id}`)
                  }
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
                  aria-label={`View details for appointment ${params.row.id}`}
                >
                  Details
                </Button>
              ),
            },
          ]}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default DoctorAppointments;
