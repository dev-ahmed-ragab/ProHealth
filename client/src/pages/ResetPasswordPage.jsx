import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { Container } from '@mui/system';

function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setMessage(
        'Password reset successfully. You can now login with your new password.'
      );
      setError('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to reset password');
      setMessage('');
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 6, md: 8 },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          p: { xs: 3, md: 4 },
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
            fontWeight: 700,
            color: '#005C97',
            mb: 2,
            lineHeight: 1.3,
            letterSpacing: '-0.5px',
            textAlign: 'center',
          }}
        >
          Reset Password
        </Typography>
        {error && (
          <Typography
            color="error"
            sx={{
              textAlign: 'center',
              mb: 2,
            }}
          >
            {error}
          </Typography>
        )}
        {message && (
          <Typography
            color="success.main"
            sx={{
              textAlign: 'center',
              mb: 2,
            }}
          >
            {message}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="New Password"
            sx={{
              borderRadius: '8px',
              '& .MuiInputBase-input': {
                color: '#1A3C5A',
              },
              '& .MuiInputLabel-root': {
                color: '#1A3C5A',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#00ACC1',
                },
                '&:hover fieldset': {
                  borderColor: '#0097A7',
                },
              },
            }}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            aria-label="Confirm New Password"
            sx={{
              borderRadius: '8px',
              '& .MuiInputBase-input': {
                color: '#1A3C5A',
              },
              '& .MuiInputLabel-root': {
                color: '#1A3C5A',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#00ACC1',
                },
                '&:hover fieldset': {
                  borderColor: '#0097A7',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
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
              mt: 3,
              mb: 2,
              '&:hover': {
                backgroundColor: '#0097A7',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            Reset Password
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ResetPasswordPage;
