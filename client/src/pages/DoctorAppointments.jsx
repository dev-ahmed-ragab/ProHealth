import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api, { getErrorMessage, toList } from '../api';

const STATUS_STYLES = {
  pending: { label: 'Pending', color: 'warning' },
  confirmed: { label: 'Confirmed', color: 'success' },
  completed: { label: 'Completed', color: 'info' },
  cancelled: { label: 'Cancelled', color: 'default' },
};

const formatDate = (value) => {
  if (!value) return 'No date';
  return new Date(value).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function DoctorAppointments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const doctorFromUrl = searchParams.get('doctor') || '';

  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState(doctorFromUrl);
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({ status: '', from: '', to: '' });
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await api.get('/api/users/protected/doctors');
        if (cancelled) return;
        const list = toList(response.data).sort((a, b) =>
          String(a.name || '').localeCompare(String(b.name || ''))
        );
        setDoctors(list);
        if (!doctorFromUrl && list.length > 0) {
          setDoctorId(list[0]._id);
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, 'Could not load doctors.'));
      } finally {
        if (!cancelled) setLoadingDoctors(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [doctorFromUrl]);

  const loadAppointments = useCallback(async () => {
    if (!doctorId) {
      setAppointments([]);
      return;
    }

    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      params.limit = 100;

      const response = await api.get(`/api/appointments/doctor/${doctorId}`, { params });
      setAppointments(toList(response.data));
      setError('');
    } catch (err) {
      setAppointments([]);
      setError(getErrorMessage(err, "Could not load this doctor's appointments."));
    } finally {
      setLoading(false);
    }
  }, [doctorId, filters]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor._id === doctorId),
    [doctors, doctorId]
  );

  const handleDoctorChange = (event) => {
    const value = event.target.value;
    setDoctorId(value);
    if (value) setSearchParams({ doctor: value });
    else setSearchParams({});
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
          Doctor appointments
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review one doctor's schedule and filter by status or date.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: 3,
          borderRadius: '16px',
          border: '1px solid #E6EEF5',
        }}
      >
        {loadingDoctors ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CircularProgress size={22} />
            <Typography color="text.secondary">Loading doctors…</Typography>
          </Box>
        ) : doctors.length === 0 ? (
          <Alert severity="info">No doctors are registered yet.</Alert>
        ) : (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Select
                fullWidth
                size="small"
                value={doctorId}
                onChange={handleDoctorChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Select doctor' }}
                sx={{ backgroundColor: '#fff' }}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor._id} value={doctor._id}>
                    {doctor.name}
                    {doctor.specialty ? ` · ${doctor.specialty}` : ''}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <Select
                fullWidth
                size="small"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Filter by status' }}
                sx={{ backgroundColor: '#fff' }}
              >
                <MenuItem value="">All statuses</MenuItem>
                {Object.entries(STATUS_STYLES).map(([value, meta]) => (
                  <MenuItem key={value} value={value}>
                    {meta.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                name="from"
                label="From"
                value={filters.from}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                name="to"
                label="To"
                value={filters.to}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        )}
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : appointments.length === 0 ? (
        <Paper
          elevation={0}
          sx={{ p: 5, textAlign: 'center', borderRadius: '16px', border: '1px solid #E6EEF5' }}
        >
          <Typography variant="h6" sx={{ color: '#1A3C5A', mb: 1 }}>
            No appointments found
          </Typography>
          <Typography color="text.secondary">
            {selectedDoctor
              ? `${selectedDoctor.name} has no appointments matching these filters.`
              : 'Choose a doctor to see their appointments.'}
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: '16px', border: '1px solid #E6EEF5', overflowX: 'auto' }}
        >
          <Table sx={{ minWidth: 720 }} aria-label="Doctor appointments">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>When</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => {
                const meta = STATUS_STYLES[appointment.status] || {
                  label: appointment.status,
                  color: 'default',
                };
                return (
                  <TableRow key={appointment._id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, color: '#1A3C5A' }}>
                        {appointment.patientInfo?.name || 'Patient'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.patientInfo?.email || 'No email'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#1A3C5A' }}>
                        {formatDate(appointment.date)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.startTime}
                        {appointment.endTime ? ` – ${appointment.endTime}` : ''}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 240 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {appointment.reason || 'Not specified'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={meta.label} color={meta.color} />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        component={Link}
                        to={`/admin-dashboard/appointment/${appointment._id}`}
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        sx={{ textTransform: 'none' }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default DoctorAppointments;
