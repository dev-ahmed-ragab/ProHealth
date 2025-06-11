import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const { register } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNameError('');
    setEmailError('');

    if (!name) {
      setNameError('Name is required');
      return;
    }
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="sm" sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          role="form"
          aria-label="Registration Form"
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
              fontWeight: 700,
              color: '#005C97',
              mb: 2,
              lineHeight: 1.3,
              letterSpacing: '-0.5px',
            }}
          >
            Register
          </Typography>
          {error && (
            <Typography
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
                color: '#d32f2f',
                mb: 2,
                lineHeight: 1.6,
              }}
            >
              {error}
            </Typography>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 2, width: '100%' }}
          >
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              variant="outlined"
              error={!!nameError}
              helperText={nameError}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#1A3C5A' },
                  '&:hover fieldset': { borderColor: '#00ACC1' },
                },
                '& .MuiInputLabel-root': { color: '#1A3C5A' },
              }}
              aria-label="Name"
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
              error={!!emailError}
              helperText={emailError}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#1A3C5A' },
                  '&:hover fieldset': { borderColor: '#00ACC1' },
                },
                '& .MuiInputLabel-root': { color: '#1A3C5A' },
              }}
              aria-label="Email Address"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#1A3C5A' },
                  '&:hover fieldset': { borderColor: '#00ACC1' },
                },
                '& .MuiInputLabel-root': { color: '#1A3C5A' },
              }}
              aria-label="Password"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                mb: 2,
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
              aria-label="Register"
            >
              Register
            </Button>
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.9rem',
                color: '#4A6B8A',
                lineHeight: 1.5,
                textAlign: 'center',
              }}
            >
              Already have an account?{' '}
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: '#1A3C5A',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    color: '#00ACC1',
                    backgroundColor: 'transparent',
                  },
                }}
                aria-label="Login"
              >
                Login
              </Button>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default RegisterPage;
