import React from 'react';
import { Box, Grid, Typography, Container } from '@mui/material';
import {
  MedicalServices,
  AccessTime,
  CalendarToday,
  VerifiedUser,
} from '@mui/icons-material';

const WhyChooseUsSection = () => {
  const features = [
    {
      title: 'Professional Doctors',
      icon: <MedicalServices sx={{ fontSize: 28, color: '#00ACC1' }} />,
      description:
        'Our clinical team consists of board-certified, highly skilled medical specialists with extensive diagnostic experience.',
    },
    {
      title: '24/7 Emergency Care',
      icon: <AccessTime sx={{ fontSize: 28, color: '#00ACC1' }} />,
      description:
        'We provide round-the-clock emergency consultation and rapid medical assistance whenever you need it.',
    },
    {
      title: 'Seamless Online Booking',
      icon: <CalendarToday sx={{ fontSize: 28, color: '#00ACC1' }} />,
      description:
        'Easily schedule, reschedule, or cancel your doctor appointments anytime through our secure portal.',
    },
    {
      title: 'Certified Healthcare',
      icon: <VerifiedUser sx={{ fontSize: 28, color: '#00ACC1' }} />,
      description:
        'We operate under accredited international hospital standards ensuring patient safety and treatment excellence.',
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        width: '100%',
        backgroundColor: '#FFFFFF',
      }}
      role="region"
      aria-label="Why Choose Us Section"
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
        <Box sx={{ textAlign: 'center', maxWidth: '720px', mx: 'auto', mb: { xs: 5, md: 7 } }}>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 800,
              color: '#00ACC1',
              letterSpacing: 2,
              display: 'block',
              mb: 1,
              fontSize: '0.85rem',
            }}
          >
            OUR COMMITMENT
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '2.9rem' },
              fontWeight: 800,
              color: '#1A3C5A',
              letterSpacing: '-0.5px',
              mb: 2,
            }}
          >
            Why Choose ProHealth
          </Typography>
          <Typography variant="body1" sx={{ color: '#5A738E', lineHeight: 1.7, fontSize: '1.05rem' }}>
            We provide comprehensive, patient-centered medical care for your entire family, supported by advanced diagnostic technology.
          </Typography>
        </Box>

        {/* 4 Uniform Cards Grid */}
        <Grid container spacing={3.5}>
          {features.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  p: { xs: 3, md: 3.5 },
                  borderRadius: '18px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 16px rgba(26, 60, 90, 0.05)',
                  height: '100%',
                  minHeight: { xs: 200, md: 230 },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 14px 28px rgba(0, 172, 193, 0.14)',
                    borderColor: '#00ACC1',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: '#E0F7FA',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    flexShrink: 0,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#1A3C5A',
                    fontSize: '1.15rem',
                    mb: 1.2,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#5A738E',
                    lineHeight: 1.6,
                    fontSize: '0.9rem',
                    flexGrow: 1,
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WhyChooseUsSection;
