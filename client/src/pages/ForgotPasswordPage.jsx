import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setMessage('Password reset instructions sent to your email');
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send reset instructions');
      setMessage('');
    }
  };

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
        }}
        role="form"
        aria-label="Forgot Password Form"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
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
            Forgot Password
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
            }}
          >
            {error || message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{
                borderRadius: '8px',
                '.MuiInputLabel-root': { color: '#1A3C5A' },
                '.MuiOutlinedInput-notchedOutline': { borderColor: '#1A3C5A' },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00ACC1',
                },
              }}
              required
              aria-label="Email Address"
              error={!!error && !message}
              helperText={
                error && !message ? 'Please enter a valid email address' : ''
              }
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 4,
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
            aria-label="Send Reset Instructions"
          >
            Send Reset Instructions
          </Button>
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: '#4A6B8A',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              textAlign: 'center',
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
              aria-label="Back to Login"
            >
              Back to Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
