import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PageBanner from '../components/common/PageBanner';
import api, { API_BASE_URL, getErrorMessage, toList } from '../api';

const FALLBACK_IMAGE = '/images/team-member-4.jpg';

const SPECIALTIES = [
  'All',
  'Cardiology',
  'Pediatrics',
  'Dermatology',
  'Neurology',
];

const DOCTOR_AVATARS = {
  'sarah hassan': '/images/sarah-doctor.jpg',
  'laila mostafa': '/images/laila-doctor.jpg',
  'omar khaled': '/images/team-member-5.jpg',
  'khaled mansour': '/images/team-member-4.jpg',
};

const resolveDoctorImage = (pic, name) => {
  const cleanName = (name || '').toLowerCase().trim();
  if (DOCTOR_AVATARS[cleanName]) {
    return DOCTOR_AVATARS[cleanName];
  }
  if (!pic) return FALLBACK_IMAGE;
  if (pic.startsWith('http://') || pic.startsWith('https://')) return pic;
  if (pic.startsWith('/images/')) return pic;
  if (pic.startsWith('/uploads/')) return `${API_BASE_URL}${pic}`;
  if (pic.startsWith('uploads/')) return `${API_BASE_URL}/${pic}`;
  return pic;
};

const DoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const specialtyParam = searchParams.get('specialty') || 'All';
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    specialtyParam.toLowerCase()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/users/public/doctors');
      setDoctors(toList(response.data));
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load doctors from server.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (specialtyParam) {
      setSelectedSpecialty(specialtyParam.toLowerCase());
    }
  }, [specialtyParam]);

  const handleSpecialtyClick = (spec) => {
    const val = spec.toLowerCase();
    setSelectedSpecialty(val);
    if (val === 'all') {
      searchParams.delete('specialty');
    } else {
      searchParams.set('specialty', val);
    }
    setSearchParams(searchParams);
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        !searchTerm.trim() ||
        doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === 'all' ||
        doc.specialty?.toLowerCase() === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchTerm, selectedSpecialty]);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', pb: 10 }}>
      {/* Unified Senior Medical Banner */}
      <PageBanner
        badge="✦ Certified Medical Specialists"
        title="Meet Our Expert Doctors"
        subtitle="Book appointments with top-rated, board-certified doctors across our multidisciplinary clinical departments."
      />

      <Container maxWidth="xl" sx={{ mt: -3.5, position: 'relative', zIndex: 10, px: { xs: 2.5, sm: 4, md: 6 } }}>
        {/* Search & Filter Bar */}
        <Box
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            p: { xs: 2.5, sm: 3 },
            boxShadow: '0 8px 30px rgba(26, 60, 90, 0.08)',
            border: '1px solid #E2E8F0',
            mb: 5,
          }}
        >
          <Grid container spacing={2.5} alignItems="center">
            {/* Search Input */}
            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by doctor name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#00ACC1' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&:hover fieldset': { borderColor: '#00ACC1' },
                    '&.Mui-focused fieldset': { borderColor: '#00ACC1' },
                  },
                }}
              />
            </Grid>

            {/* Specialty Filter Chips */}
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  overflowX: 'auto',
                  py: 0.5,
                  '&::-webkit-scrollbar': { height: 4 },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: '#CBD5E1', borderRadius: 4 },
                }}
              >
                {SPECIALTIES.map((spec) => {
                  const isSelected = selectedSpecialty === spec.toLowerCase();
                  return (
                    <Chip
                      key={spec}
                      label={spec}
                      clickable
                      onClick={() => handleSpecialtyClick(spec)}
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        px: 1,
                        py: 2,
                        backgroundColor: isSelected ? '#00ACC1' : '#F1F5F9',
                        color: isSelected ? '#FFFFFF' : '#1A3C5A',
                        border: isSelected ? '1px solid #00ACC1' : '1px solid #E2E8F0',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: isSelected ? '#0097A7' : '#E2E8F0',
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Error Alert with Retry */}
        {error && (
          <Box sx={{ mb: 4 }}>
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={fetchDoctors}>
                  Retry
                </Button>
              }
              sx={{ borderRadius: '12px' }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12 }}>
            <CircularProgress size={48} sx={{ color: '#00ACC1', mb: 2 }} />
            <Typography variant="body1" sx={{ color: '#5A738E' }}>
              Loading verified doctors...
            </Typography>
          </Box>
        ) : filteredDoctors.length === 0 ? (
          /* Empty State */
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              px: 3,
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
            }}
          >
            <Typography variant="h5" sx={{ color: '#1A3C5A', fontWeight: 700, mb: 1 }}>
              No Doctors Found
            </Typography>
            <Typography variant="body2" sx={{ color: '#5A738E', mb: 3 }}>
              {doctors.length === 0
                ? 'We could not find any active doctors at the moment.'
                : 'No doctors matched your search criteria. Try a different specialty or keyword.'}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                handleSpecialtyClick('All');
              }}
              sx={{
                borderColor: '#00ACC1',
                color: '#00ACC1',
                borderRadius: '8px',
                '&:hover': { borderColor: '#0097A7', backgroundColor: '#F0FBFD' },
              }}
            >
              Reset Filters
            </Button>
          </Box>
        ) : (
          /* Doctors Grid - 3 Columns Desktop, 2 Columns Tablet, 1 Column Mobile */
          <Grid container spacing={3.5}>
            {filteredDoctors.map((doctor) => {
              const specDisplay = doctor.specialty
                ? doctor.specialty.charAt(0).toUpperCase() + doctor.specialty.slice(1)
                : 'Specialist';

              return (
                <Grid key={doctor._id || doctor.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 16px rgba(26, 60, 90, 0.06)',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 16px 32px rgba(26, 60, 90, 0.12)',
                        borderColor: '#00ACC1',
                      },
                    }}
                  >
                    {/* Doctor Photo with Top-Center Alignment to Prevent Head Cropping */}
                    <Box sx={{ position: 'relative', width: '100%', height: 280, overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
                      <CardMedia
                        component="img"
                        image={resolveDoctorImage(doctor.profilePicture, doctor.name)}
                        alt={`Dr. ${doctor.name}`}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top center',
                          transition: 'transform 0.4s ease',
                          '&:hover': { transform: 'scale(1.04)' },
                        }}
                      />

                      {/* Specialty Badge (Top-Left) */}
                      <Chip
                        label={specDisplay}
                        sx={{
                          position: 'absolute',
                          top: 14,
                          left: 14,
                          backgroundColor: 'rgba(0, 172, 193, 0.92)',
                          backdropFilter: 'blur(6px)',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          height: 28,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        }}
                      />

                      {/* Rating Badge (Top-Right) */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 14,
                          right: 14,
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(6px)',
                          borderRadius: '50px',
                          px: 1.2,
                          py: 0.3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.4,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                        }}
                      >
                        <StarIcon sx={{ color: '#FFB300', fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#1A3C5A' }}>
                          4.9
                        </Typography>
                      </Box>
                    </Box>

                    {/* Card Content */}
                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A3C5A', fontSize: '1.2rem' }}>
                          Dr. {doctor.name}
                        </Typography>
                        <VerifiedIcon sx={{ color: '#00ACC1', fontSize: 20 }} />
                      </Box>

                      <Typography
                        variant="caption"
                        sx={{
                          color: '#00ACC1',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          mb: 1.5,
                          display: 'block',
                        }}
                      >
                        {specDisplay} Consultant
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#5A738E',
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: 65,
                          mb: 2.5,
                        }}
                      >
                        {doctor.bio || 'Dedicated medical professional committed to providing patient-centered care and the latest therapeutic practices.'}
                      </Typography>

                      {/* Availability status */}
                      <Box
                        sx={{
                          mt: 'auto',
                          pt: 2,
                          borderTop: '1px solid #F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <EventAvailableIcon sx={{ fontSize: 18, color: '#00897B' }} />
                          <Typography variant="caption" sx={{ color: '#00897B', fontWeight: 700 }}>
                            Available for Booking
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                          Verified Staff
                        </Typography>
                      </Box>

                      {/* Booking CTA Button */}
                      <Button
                        component={Link}
                        to={`/book-appointment/${doctor._id || doctor.id}`}
                        variant="contained"
                        fullWidth
                        sx={{
                          backgroundColor: '#00ACC1',
                          color: '#ffffff',
                          fontWeight: 700,
                          py: 1.3,
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          boxShadow: '0 4px 12px rgba(0, 172, 193, 0.25)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: '#0097A7',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 18px rgba(0, 172, 193, 0.35)',
                          },
                        }}
                      >
                        Book Appointment
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default DoctorsPage;
