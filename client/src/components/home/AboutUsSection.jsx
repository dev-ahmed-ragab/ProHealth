import React from 'react';
import { Box, Grid, Typography, Button, Stack, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const AboutUsSection = () => {
  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 8, md: 12 },
        backgroundColor: '#ffffff',
      }}
      role="region"
      aria-label="About Us Section"
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={{ xs: 4, md: 8 }}
          alignItems="center"
        >
          {/* Left Side: Professional Image Composition */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', maxWidth: '560px', mx: 'auto' }}>
              <Box
                component="img"
                src="/images/download.jpg"
                alt="Doctor with patient in consultation"
                sx={{
                  width: '100%',
                  height: { xs: '320px', sm: '420px', md: '480px' },
                  objectFit: 'cover',
                  borderRadius: '24px',
                  boxShadow: '0 16px 40px rgba(0, 92, 151, 0.12)',
                  display: 'block',
                }}
              />

              {/* Floating Top Care Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: -16, sm: -24 },
                  right: { xs: -8, sm: -20 },
                  backgroundColor: '#ffffff',
                  border: '3px solid #00ACC1',
                  borderRadius: '20px',
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  boxShadow: '0 12px 28px rgba(0, 172, 193, 0.2)',
                }}
              >
                <VerifiedIcon sx={{ color: '#00ACC1', fontSize: { xs: 28, sm: 36 } }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1A3C5A', lineHeight: 1.1 }}>
                    Certified Clinic
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#5A738E', fontWeight: 600 }}>
                    International Standards
                  </Typography>
                </Box>
              </Box>

              {/* Floating Experience Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: { xs: -16, sm: -24 },
                  left: { xs: 8, sm: -20 },
                  backgroundColor: '#005C97',
                  color: '#ffffff',
                  borderRadius: '16px',
                  px: 2.5,
                  py: 1.5,
                  boxShadow: '0 12px 28px rgba(0, 92, 151, 0.25)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>
                  15+ Years
                </Typography>
                <Typography variant="caption" sx={{ color: '#A7FFEB', fontWeight: 600 }}>
                  Of Medical Excellence
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Side: Text & Key Highlights */}
          <Grid item xs={12} md={6}>
            <Box sx={{ maxWidth: '580px' }}>
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 800,
                  color: '#00ACC1',
                  letterSpacing: 2,
                  display: 'block',
                  mb: 1,
                }}
              >
                ABOUT PROHEALTH
              </Typography>
              
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: '-0.5px',
                  color: '#1A3C5A',
                  mb: 2.5,
                }}
              >
                Dedicated to Patient Care & Advanced Medicine
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.7,
                  color: '#5A738E',
                  mb: 3.5,
                }}
              >
                ProHealth is a premier multidisciplinary healthcare clinic. We bring together
                distinguished specialists, state-of-the-art diagnostic facilities, and a compassionate
                patient-first philosophy to ensure the highest standards of physical and mental wellness.
              </Typography>

              {/* Highlight Points */}
              <Stack spacing={2} sx={{ mb: 4 }}>
                {[
                  'Board-certified specialists across all major clinical disciplines',
                  'Comprehensive electronic health records & easy appointment scheduling',
                  'Emergency response support & preventative care consultations',
                  'Transparent patient communication and follow-up monitoring',
                ].map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <CheckCircleIcon sx={{ color: '#00ACC1', fontSize: 22, mt: 0.2, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: '#1A3C5A', fontWeight: 600, fontSize: '0.95rem' }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {/* Button */}
              <Button
                component={Link}
                to="/service"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  backgroundColor: '#005C97',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  px: 3.5,
                  py: 1.4,
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 6px 18px rgba(0, 92, 151, 0.25)',
                  '&:hover': {
                    backgroundColor: '#004775',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Learn More About Our Services
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUsSection;
