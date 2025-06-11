import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';

const VerifyEmailSentPage = () => {
  return (
    <Box
      sx={{
        maxWidth: '1400px',
        mx: 'auto',
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4 },
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
        aria-label="Verification Email Sent"
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
            <EmailIcon sx={{ fontSize: 28, color: '#fff' }} />
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
            Verification Email Sent
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
            color: '#4A6B8A',
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          Please check your email and click on the verification link to activate
          your account.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: '#4A6B8A',
            fontSize: '0.9rem',
            lineHeight: 1.5,
          }}
        >
          <Link
            to="/"
            style={{
              color: '#1A3C5A',
              textDecoration: 'none',
              fontWeight: 600,
            }}
            onMouseOver={(e) => (e.target.style.color = '#00ACC1')}
            onMouseOut={(e) => (e.target.style.color = '#1A3C5A')}
            aria-label="Go to Homepage"
          >
            Go to Homepage
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default VerifyEmailSentPage;
