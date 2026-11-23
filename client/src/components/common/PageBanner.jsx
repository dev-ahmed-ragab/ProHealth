import React from 'react';
import { Box, Container, Typography, Chip } from '@mui/material';

const PageBanner = ({ badge, title, subtitle, children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: 260, md: 310 },
        background: 'linear-gradient(135deg, #0E2A47 0%, #006D80 50%, #00ACC1 100%)',
        pt: { xs: '100px', md: '112px' },
        pb: { xs: 5, md: 7 },
        color: '#ffffff',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 172, 193, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-80px',
          left: '-40px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
      role="banner"
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {badge && (
          <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'center' }}>
            <Chip
              label={badge}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(8px)',
                color: '#E0F7FA',
                fontWeight: 700,
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                py: 0.5,
                px: 1,
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            />
          </Box>
        )}

        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.1rem' },
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.2,
            letterSpacing: '-0.5px',
            mb: 1.5,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.15rem' },
              color: 'rgba(255, 255, 255, 0.92)',
              maxWidth: 680,
              mx: 'auto',
              lineHeight: 1.6,
              mb: children ? 3 : 0,
            }}
          >
            {subtitle}
          </Typography>
        )}

        {children && <Box sx={{ mt: 2.5 }}>{children}</Box>}
      </Container>
    </Box>
  );
};

export default PageBanner;
