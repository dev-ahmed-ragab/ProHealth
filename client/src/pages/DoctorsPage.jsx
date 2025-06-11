import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
} from '@mui/material';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('/api/users/public/doctors');
        setDoctors(res.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(doctors);
  return (
    <Box sx={{ width: '100%' }}>
      {/* Banner */}
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          minHeight: '600px',
          backgroundImage: 'url("/images/services-img-1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          marginLeft: 'calc(-50vw + 50%)',
          marginTop: '-64px',
          paddingTop: '64px',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(83, 201, 207, 0.69)', // الطبقة الشفافة
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1400px',
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: 6,
            textAlign: 'left',
            pl: { xs: 0, md: 3 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
              fontWeight: 700,
              color: '#fff',
              mb: 2,
              lineHeight: 1.3,
              letterSpacing: '-0.5px',
            }}
            aria-label="Meet Our Expert Doctors"
          >
            Meet Our Expert Doctors
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
              color: '#fff',
              opacity: 0.95,
              mb: 4,
              lineHeight: 1.6,
              maxWidth: '95%',
            }}
          >
            Discover the best care with our dedicated team.
          </Typography>
          <TextField
            label="Search Doctors"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search doctors by name or specialty"
            sx={{
              mb: 4,
              maxWidth: '500px',
              width: '100%',
              backgroundColor: '#fff', // خلفية بيضاء كما طُلب
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': { borderColor: '#1A3C5A' },
                '&:hover fieldset': { borderColor: '#00ACC1' },
                '&.Mui-focused fieldset': { borderColor: '#00ACC1' },
              },
              '& .MuiInputBase-input': {
                color: '#1A3C5A',
                fontSize: { xs: '0.95rem', md: '1rem' },
              },
              '& .MuiInputLabel-root': {
                color: '#1A3C5A',
                fontSize: { xs: '0.95rem', md: '1rem' },
              },
            }}
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          maxWidth: '1400px',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 6, md: 8 },
          mt: { xs: 4, sm: 6, md: 8 }, // مسافة أكبر بين البنر وبطاقات الأطباء
        }}
        role="region"
        aria-label="Doctors Page"
      >
        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
          {filteredDoctors.map((doctor) => (
            <Grid item key={doctor._id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '450px',
                  width: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '12px',
                  background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  },
                }}
                role="article"
                aria-label={`Doctor: ${doctor.name}`}
              >
                <CardMedia
                  component="img"
                  image={
                    `http://localhost:5000${doctor.profilePicture}` ||
                    '/default-doctor.jpg'
                  }
                  alt={doctor.name}
                  sx={{
                    borderRadius: '12px 12px 0 0',
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ flexGrow: 1, px: 2.5, pt: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#1A3C5A',
                      fontSize: '1.1rem',
                      mb: 0.5,
                    }}
                  >
                    Dr. {doctor.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      color: '#4A6B8A',
                    }}
                  >
                    {doctor.specialty || 'General Practitioner'}
                  </Typography>
                </CardContent>
                <Box sx={{ px: 2.5, pb: 2 }}>
                  <Button
                    component={Link}
                    to={`/book-appointment/${doctor._id}`}
                    variant="contained"
                    fullWidth
                    aria-label={`Book appointment with Dr. ${doctor.name}`}
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
                  >
                    Book Appointment
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DoctorsPage;
