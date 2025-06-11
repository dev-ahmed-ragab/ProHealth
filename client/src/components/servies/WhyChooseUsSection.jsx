import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
  MedicalServices,
  AccessTime,
  CalendarToday,
} from '@mui/icons-material';

const WhyChooseUsSection = () => {
  const features = [
    {
      title: 'Professional Doctors',
      icon: <MedicalServices sx={{ fontSize: 28, color: '#fff' }} />,
      description:
        'Our team consists of highly skilled and experienced doctors.',
    },
    {
      title: '24/7 Services',
      icon: <AccessTime sx={{ fontSize: 28, color: '#fff' }} />,
      description:
        'We provide round-the-clock medical services for your needs.',
    },
    {
      title: 'Online Appointment',
      icon: <CalendarToday sx={{ fontSize: 28, color: '#fff' }} />,
      description: 'Book your appointments easily through our online system.',
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
          {/* Left Side: Text and Features */}
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
              Why Choose Us
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
              We provide the best medical care for your family
            </Typography>
            <Grid
              container
              spacing={{ xs: 2, sm: 3, md: 3 }}
              justifyContent="center"
            >
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
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
                    aria-label={`Feature: ${feature.title}`}
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
                      {feature.icon}
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
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#4A6B8A',
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                        }}
                      >
                        {feature.description}
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

export default WhyChooseUsSection;
