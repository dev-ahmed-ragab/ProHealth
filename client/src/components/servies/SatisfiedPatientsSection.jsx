import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { MedicalServices, ThumbUp, EmojiEvents } from '@mui/icons-material';

const SatisfiedPatientsSection = () => {
  const stats = [
    {
      value: '100+',
      label: 'Qualified Doctors',
      icon: <MedicalServices sx={{ fontSize: 40, color: '#fff' }} />,
    },
    {
      value: '99%',
      label: 'Patient Satisfaction',
      icon: <ThumbUp sx={{ fontSize: 40, color: '#fff' }} />,
    },
    {
      value: '80+',
      label: 'Winning Awards',
      icon: <EmojiEvents sx={{ fontSize: 40, color: '#fff' }} />,
    },
  ];

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '400px',
        py: 8,
        backgroundImage:
          'url("https://images.unsplash.com/photo-1580281780460-82d277b0e3f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        color: '#fff',
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
          maxWidth: '1400px',
          mx: 'auto',
          px: { xs: 3, md: 5 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(5px)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#00ACC1', // Teal accent color
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: '700',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    letterSpacing: '0.5px',
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#fff',
                    opacity: 0.95,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    fontWeight: '400',
                    lineHeight: 1.5,
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SatisfiedPatientsSection;
