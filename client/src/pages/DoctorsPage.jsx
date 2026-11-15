import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import api, { getErrorMessage, toList } from '../api';

const FALLBACK_IMAGE = '/images/team-member-4.jpg';

const DoctorsPage = () => {
  const [searchParams] = useSearchParams();
  const specialtyParam = searchParams.get('specialty') || '';
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState(specialtyParam);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (specialtyParam) {
      setSearchTerm(specialtyParam);
    }
  }, [specialtyParam]);

  useEffect(() => {
    let cancelled = false;
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/api/users/public/doctors');
        if (!cancelled) {
          setDoctors(toList(response.data));
          setError('');
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, 'Could not load doctors.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDoctors();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return doctors;
    return doctors.filter(
      (doctor) =>
        doctor.name?.toLowerCase().includes(query) ||
        doctor.specialty?.toLowerCase().includes(query)
    );
  }, [doctors, searchTerm]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: 380, md: 460 },
          borderRadius: '0 0 24px 24px',
          backgroundImage: 'url("/images/services-img-1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          mt: '-64px',
          pt: '64px',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 92, 151, 0.72)',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '1200px',
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 6, md: 8 },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontSize: { xs: '1.9rem', sm: '2.4rem', md: '3rem' },
              fontWeight: 700,
              color: '#fff',
              mb: 1.5,
            }}
          >
            Meet Our Expert Doctors
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.15rem' },
              color: 'rgba(255,255,255,0.92)',
              mb: 3,
              maxWidth: 620,
            }}
          >
            Find the right specialist and book an appointment in a few clicks.
          </Typography>
          <TextField
            placeholder="Search by doctor name or specialty"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search doctors by name or specialty"
            sx={{
              maxWidth: 480,
              width: '100%',
              backgroundColor: '#fff',
              borderRadius: '10px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#4A6B8A' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 5, md: 7 },
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredDoctors.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#1A3C5A', mb: 1 }}>
              No doctors found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {doctors.length === 0
                ? 'There are no doctors available at the moment. Please check back soon.'
                : 'Try a different name or specialty.'}
            </Typography>
            {searchTerm && (
              <Button onClick={() => setSearchTerm('')} variant="outlined">
                Clear search
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredDoctors.map((doctor) => (
              <Grid item key={doctor._id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '14px',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="240"
                    image={doctor.profilePicture || FALLBACK_IMAGE}
                    alt={`Dr. ${doctor.name}`}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1A3C5A' }}>
                      Dr. {doctor.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#00ACC1', fontWeight: 600, mb: 1 }}
                    >
                      {doctor.specialty
                        ? doctor.specialty.charAt(0).toUpperCase() +
                          doctor.specialty.slice(1)
                        : 'General Practitioner'}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#4A6B8A',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: 60,
                      }}
                    >
                      {doctor.bio || 'This doctor has not added a biography yet.'}
                    </Typography>
                  </CardContent>
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Button
                      component={Link}
                      to={`/book-appointment/${doctor._id}`}
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: '#00ACC1',
                        color: '#fff',
                        fontWeight: 600,
                        py: 1.2,
                        borderRadius: '8px',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#0097A7' },
                      }}
                    >
                      Book Appointment
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default DoctorsPage;
