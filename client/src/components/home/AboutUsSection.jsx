import React from 'react';
import { Box, Grid, Typography, Stack } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import CircularIconText from './CircularIconText';

const AboutUsSection = () => {
  return (
    <Box
      sx={{
        maxWidth: '1400px',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 6, md: 8 },
      }}
      role="region"
      aria-label="About Us Section"
    >
      <Grid
        container
        spacing={{ xs: 2, sm: 3, md: 3 }}
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
        }}
      >
        {/* Left Side: Image */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ position: 'relative', mb: { xs: 4, md: 0 } }}
          width={{ sm: '100%', md: '55%' }}
        >
          <Box
            component="img"
            src="/images/download.jpg"
            alt="Doctor with patient"
            sx={{
              width: '100%',
              height: { xs: '300px', sm: '350px', md: '450px' },
              objectFit: 'cover',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: { xs: '-20px', sm: '-30px', md: '-40px' },
              right: { xs: '-10px', sm: '-15px', md: '-20px' },
              zIndex: 10,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: '60px', sm: '70', md: '80px' },
                height: { xs: '60px', sm: '70', md: '80px' },
                background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.14)' },
                  '100%': { transform: 'scale(1)' },
                },
              }}
            >
              {/* <CircularIconText /> */}
            </Box>
          </Box>
        </Grid>

        {/* Right Side: Text Content */}
        <Grid item xs={12} md={6} width={{ sm: '100%', md: '38%' }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: '-0.5px',
              color: '#005C97',
              mb: 2,
              textAlign: { xs: 'left', md: 'left' },
              pl: { xs: 0, md: 3 },
            }}
          >
            About Us
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 600,
              color: '#1A3C5A',
              mb: 2.5,
              textAlign: { xs: 'left', md: 'left' },
              pl: { xs: 0, md: 3 },
            }}
          >
            PRO HEALTH
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
              lineHeight: 1.6,
              color: '#4A6B8A',
              textAlign: { xs: 'left', md: 'left' },
              maxWidth: { xs: '95%', md: '600px' },
              mx: { xs: 'auto', md: 0 },
              pl: { xs: 0, md: 3 },
            }}
          >
            ProHealth is a team of experienced medical professionals dedicated
            to providing top-quality healthcare services. We embrace a holistic
            approach, focusing on treating the whole person, not just the
            illness or symptoms, to ensure comprehensive care and lasting
            wellness.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutUsSection;
