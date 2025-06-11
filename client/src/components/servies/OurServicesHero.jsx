import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const OurServicesHero = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        minHeight: '600px',
        backgroundImage: 'url("/images/h3-img-2.jpg")',
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
          pl: { xs: 0, md: 3 }, // Align text with card start as in SpecializeSection
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
          Our Services
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
          Our administrative and clinical team is second to none. We reiterate
          the pledge to help all and give hope.
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
  );
};

export default OurServicesHero;
