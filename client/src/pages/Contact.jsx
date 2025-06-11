import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Phone, Email, LocationOn } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ContactUsPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Form state for validation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Handle form submission (e.g., API call)
    console.log('Form submitted:', formData);
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Banner */}
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '50vh',
          minHeight: '500px',
          backgroundImage: 'url("/images/landing-parallax-1.jpg")',
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
            backgroundColor: 'rgba(83, 201, 207, 0.48)', // الطبقة الشفافة
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
            pl: { xs: 0, md: 3 }, // Align text with card start
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
          >
            Contact Us
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
            We are here to assist you and answer any questions you may have.
          </Typography>
          <Button
            component={Link}
            to="/find-doctor"
            variant="contained"
            aria-label="Find a Doctor"
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
            Find a Doctor
          </Button>
        </Box>
      </Box>

      {/* Contact Form */}
      <Box
        sx={{
          maxWidth: '800px',
          mx: 'auto',
          mt: { xs: -6, md: -8 },
          mb: 6,
          p: { xs: 3, md: 4 },
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: '#1A3C5A',
            textAlign: 'center',
          }}
        >
          Send Us a Message
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item width={{ sm: '100%', md: '48%' }}>
              <TextField
                variant="outlined"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                aria-label="Name"
                error={!!errors.name}
                helperText={errors.name}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Grid>
            <Grid item width={{ sm: '100%', md: '48%' }}>
              <TextField
                variant="outlined"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                aria-label="Email"
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Grid>
          </Grid>

          <TextField
            variant="outlined"
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            fullWidth
            aria-label="Subject"
            error={!!errors.subject}
            helperText={errors.subject}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />

          <TextField
            variant="outlined"
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            multiline
            rows={6}
            fullWidth
            aria-label="Message"
            error={!!errors.message}
            helperText={errors.message}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
              '& .MuiOutlinedInput-multiline': {
                padding: '16.5px 14px',
              },
            }}
          />

          <Box sx={{ textAlign: 'left' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              aria-label="Send Message"
              sx={{
                backgroundColor: '#00ACC1',
                color: '#fff',
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 600,
                px: 4,
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
              Send →
            </Button>
          </Box>
        </Stack>
      </Box>

      {/* Map and Contact Info Section */}
      <Box sx={{ py: 6 }}>
        <Box
          sx={{
            maxWidth: '1400px',
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            flexDirection: isSmallScreen ? 'column' : 'row',
            gap: 4,
          }}
        >
          {/* Contact Info */}
          <Box
            sx={{
              width: isSmallScreen ? '100%' : '40%',
              order: isSmallScreen ? 1 : 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#1A3C5A',
                mb: 3,
              }}
            >
              Contact Information
            </Typography>

            <Stack spacing={3} sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: '12px',
                  background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  },
                  minHeight: '120px',
                  maxWidth: '360px',
                  width: '100%',
                  mx: 'auto',
                }}
                role="article"
                aria-label="Phone Contact"
              >
                <Box
                  sx={{
                    width: '52px',
                    height: '52px',
                    backgroundColor: '#00ACC1',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Phone sx={{ fontSize: 28, color: '#fff' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: '#4A6B8A', fontSize: '0.9rem' }}
                  >
                    Phone
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: '#1A3C5A',
                      fontSize: '1.1rem',
                    }}
                  >
                    +966 12 345 6789
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: '12px',
                  background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  },
                  minHeight: '120px',
                  maxWidth: '360px',
                  width: '100%',
                  mx: 'auto',
                }}
                role="article"
                aria-label="Email Contact"
              >
                <Box
                  sx={{
                    width: '52px',
                    height: '52px',
                    backgroundColor: '#00ACC1',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Email sx={{ fontSize: 28, color: '#fff' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: '#4A6B8A', fontSize: '0.9rem' }}
                  >
                    Email
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: '#1A3C5A',
                      fontSize: '1.1rem',
                    }}
                  >
                    info@example.com
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: '12px',
                  background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  },
                  minHeight: '120px',
                  maxWidth: '360px',
                  width: '100%',
                  mx: 'auto',
                }}
                role="article"
                aria-label="Address Contact"
              >
                <Box
                  sx={{
                    width: '52px',
                    height: '52px',
                    backgroundColor: '#00ACC1',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <LocationOn sx={{ fontSize: 28, color: '#fff' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: '#4A6B8A', fontSize: '0.9rem' }}
                  >
                    Address
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: '#1A3C5A',
                      fontSize: '1.1rem',
                    }}
                  >
                    King Abdulaziz Street, Riyadh, Saudi Arabia
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#1A3C5A',
                mb: 3,
                mt: 4,
              }}
            >
              Working Hours
            </Typography>
            <Typography sx={{ mb: 1, color: '#4A6B8A', fontSize: '1rem' }}>
              Sunday - Thursday: 8:00 AM - 6:00 PM
            </Typography>
            <Typography sx={{ color: '#4A6B8A', fontSize: '1rem' }}>
              Friday - Saturday: 9:00 AM - 3:00 PM
            </Typography>
          </Box>

          {/* Map */}
          <Box
            sx={{
              width: isSmallScreen ? '100%' : '60%',
              height: isSmallScreen ? '400px' : '500px',
              position: 'relative',
              order: isSmallScreen ? 2 : 1,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                zIndex: 1,
                borderRadius: '12px',
              }}
            />
            <Box
              sx={{
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                position: 'relative',
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.853784851493!2d46.67527731500262!3d24.77451858408547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2ee3b9b9b9b9b9%3A0x9b9b9b9b9b9b9b9b!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactUsPage;
