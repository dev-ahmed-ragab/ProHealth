import React from 'react';
import { Box, Grid, Typography, Container } from '@mui/material';
import { MedicalServices, ThumbUp, EmojiEvents } from '@mui/icons-material';

const SatisfiedPatientsSection = () => {
  const stats = [
    {
      value: '100+',
      label: 'Qualified Specialists',
      desc: 'Top certified doctors across all medical departments.',
      icon: <MedicalServices sx={{ fontSize: 32, color: '#00ACC1' }} />,
    },
    {
      value: '99%',
      label: 'Patient Satisfaction',
      desc: 'Positive treatment ratings and verified feedback.',
      icon: <ThumbUp sx={{ fontSize: 32, color: '#00ACC1' }} />,
    },
    {
      value: '80+',
      label: 'Healthcare Awards',
      desc: 'Recognized for hospital and clinical care standards.',
      icon: <EmojiEvents sx={{ fontSize: 32, color: '#00ACC1' }} />,
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 8, md: 10 },
        background: 'linear-gradient(135deg, #0A3C5A 0%, #007A99 50%, #00ACC1 100%)',
        position: 'relative',
        color: '#ffffff',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 172, 193, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
      role="region"
      aria-label="Satisfied Patients Statistics"
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 2.5, sm: 4, md: 6 } }}>
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: { xs: 3.5, md: 4 },
                  borderRadius: '18px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.18)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 68,
                    height: 68,
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 0.8,
                    color: '#ffffff',
                    fontSize: { xs: '2.4rem', md: '3rem' },
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#E0F7FA',
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                  }}
                >
                  {stat.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SatisfiedPatientsSection;
