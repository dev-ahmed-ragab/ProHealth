import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`/api/auth/verify-email/${token}`);
        setMessage('Email verified successfully! You can now login.');
      } catch (err) {
        setError(err.response?.data?.msg || 'Email verification failed');
      }
    };

    verifyEmail();
  }, [token]);

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
        aria-label="Email Verification"
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
            <CheckCircleIcon sx={{ fontSize: 28, color: '#fff' }} />
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
            Email Verification
          </Typography>
        </Box>

        {(error || message) && (
          <Alert
            severity={error ? 'error' : 'success'}
            sx={{
              my: 2,
              background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              color: '#1A3C5A',
              fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
              lineHeight: 1.6,
            }}
          >
            {error || message}
          </Alert>
        )}

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
            to="/login"
            style={{
              color: '#1A3C5A',
              textDecoration: 'none',
              fontWeight: 600,
            }}
            onMouseOver={(e) => (e.target.style.color = '#00ACC1')}
            onMouseOut={(e) => (e.target.style.color = '#1A3C5A')}
            aria-label="Go to Login"
          >
            Go to Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default VerifyEmailPage;
