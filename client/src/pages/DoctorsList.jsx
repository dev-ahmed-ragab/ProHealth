import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import api, { getErrorMessage, toList } from '../api';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await api.get('/api/users/protected/doctors');
        if (!cancelled) {
          setDoctors(
            toList(response.data).sort((a, b) =>
              String(a.name || '').localeCompare(String(b.name || ''))
            )
          );
          setError('');
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, 'Could not load doctors.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleDoctors = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return doctors;
    return doctors.filter((doctor) =>
      [doctor.name, doctor.email, doctor.specialty]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [doctors, query]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
          Doctors
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {doctors.length} {doctors.length === 1 ? 'doctor' : 'doctors'} available for
          bookings.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TextField
        size="small"
        placeholder="Search by name, email, or specialty"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ width: '100%', maxWidth: 420, mb: 3, backgroundColor: '#fff' }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : visibleDoctors.length === 0 ? (
        <Box
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: '16px',
            border: '1px solid #E6EEF5',
            backgroundColor: '#fff',
          }}
        >
          <MedicalServicesIcon sx={{ fontSize: 40, color: '#B0C4D3', mb: 1 }} />
          <Typography variant="h6" sx={{ color: '#1A3C5A', mb: 1 }}>
            {doctors.length === 0 ? 'No doctors yet' : 'No matching doctors'}
          </Typography>
          <Typography color="text.secondary">
            {doctors.length === 0
              ? 'Promote a user to the doctor role from the Users page to get started.'
              : 'Try a different search term.'}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2.5,
          }}
        >
          {visibleDoctors.map((doctor) => (
            <Card
              key={doctor._id}
              elevation={0}
              sx={{ borderRadius: '16px', border: '1px solid #E6EEF5', height: '100%' }}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 2 }}>
                  <Avatar
                    src={doctor.profilePicture || undefined}
                    alt={doctor.name}
                    sx={{ width: 52, height: 52, bgcolor: '#E0F7FA', color: '#00707E' }}
                  >
                    {doctor.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, color: '#1A3C5A' }} noWrap>
                      Dr. {doctor.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {doctor.specialty || 'General practitioner'}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" noWrap>
                  {doctor.email || 'No email'}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>
                  {doctor.phone || 'No phone number'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
                  <Button
                    component={Link}
                    to={`/profile/${doctor._id}`}
                    size="small"
                    variant="outlined"
                    startIcon={<PersonIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Profile
                  </Button>
                  <Button
                    component={Link}
                    to={`/admin-dashboard/doctor-appointments?doctor=${doctor._id}`}
                    size="small"
                    variant="outlined"
                    startIcon={<CalendarMonthIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Appointments
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DoctorsList;
