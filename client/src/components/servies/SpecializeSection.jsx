import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
  LocalHospital,
  Favorite,
  ChildCare,
  FitnessCenter,
  MedicalServices,
  Visibility,
} from '@mui/icons-material';

const SpecializeSection = () => {
  const services = [
    {
      title: 'Primary Care',
      icon: <LocalHospital sx={{ fontSize: 28, color: '#fff' }} />,
      description:
        'Comprehensive care for all ages, focusing on prevention and wellness.',
    },
    {
      title: 'General Health',
      icon: <Favorite sx={{ fontSize: 28, color: '#fff' }} />,
      description:
        'Holistic health assessments and personalized treatment plans.',
    },
    {
      title: 'Pediatrics',
      icon: <ChildCare sx={{ fontSize: 28, color: '#fff' }} />,
      description: 'Specialized care for infants, children, and adolescents.',
    },
    {
      title: 'Physical Therapy',
      icon: <FitnessCenter sx={{ fontSize: 28, color: '#fff' }} />,
      description:
        'Tailored rehabilitation programs to restore mobility and strength.',
    },
    {
      title: 'Dental Surgery',
      icon: <MedicalServices sx={{ fontSize: 28, color: '#fff' }} />,
      description: 'Advanced dental procedures with cutting-edge technology.',
    },
    {
      title: 'Eye Care',
      icon: <Visibility sx={{ fontSize: 28, color: '#fff' }} />,
      description:
        'Expert vision care, from routine exams to complex treatments.',
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={4}>
          {/* Left Side: Heading and Text */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              pl: { xs: 0, md: 3 }, // Align text with card start
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
                fontWeight: 700,
                color: '#005C97',
                mb: 2,
                lineHeight: 1.3,
                letterSpacing: '-0.5px',
              }}
            >
              Specialized <br /> Medical Expertise
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
                color: '#4A6B8A',
                mb: 3,
                lineHeight: 1.6,
                maxWidth: '95%',
              }}
            >
              Our expert team delivers world-class medical services across
              diverse specialties, backed by cutting-edge facilities.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                color: '#005C97',
                fontWeight: 600,
                letterSpacing: '0.5px',
                lineHeight: 1.5,
              }}
            >
              EMERGENCY CALL: <br /> 1-800-373-5678
            </Typography>
          </Grid>

          {/* Right Side: Service Cards */}
          <Grid item xs={12} md={8}>
            <Grid
              container
              spacing={{ xs: 2, sm: 3, md: 3 }}
              justifyContent="center"
            >
              {services.map((service, index) => (
                <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
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
                    aria-label={`Service: ${service.title}`}
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
                      {service.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#1A3C5A',
                          fontSize: '1.1rem',
                          mb: 0.5,
                        }}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#4A6B8A',
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                        }}
                      >
                        {service.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SpecializeSection;
