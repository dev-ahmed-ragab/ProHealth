import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        maxWidth: '1400px',
        mx: 'auto',
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4 },
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: '800px',
          mx: 'auto',
          p: { xs: 3, md: 4 },
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
        role="main"
        aria-label="Page Not Found"
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
          }}
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
            <ErrorOutlineIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
              fontWeight: 700,
              color: '#005C97',
              lineHeight: 1.3,
              letterSpacing: '-0.5px',
            }}
          >
            Page Not Found
          </Typography>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 600,
            color: '#1A3C5A',
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
            color: '#4A6B8A',
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </Typography>

        <Button
          component={Link}
          to="/"
          variant="contained"
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
          aria-label="Return to Homepage"
        >
          Return to Homepage
        </Button>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
