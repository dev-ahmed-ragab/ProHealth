import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '../context/AuthContext';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Your password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      setCreated(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (created) {
    return (
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          pt: { xs: 11, md: 12 },
          pb: 6,
        }}
      >
        <Paper
          elevation={0}
          sx={{ maxWidth: 500, p: { xs: 3, md: 5 }, textAlign: 'center', borderRadius: '16px' }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#00ACC1', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A3C5A', mb: 1 }}>
            Account created
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            We sent a verification link to your email, but you can sign in
            right away and start booking appointments.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login', { replace: true })}
            sx={{
              backgroundColor: '#00ACC1',
              textTransform: 'none',
              px: 4,
              '&:hover': { backgroundColor: '#0097A7' },
            }}
          >
            Go to sign in
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: { xs: 11, md: 12 },
        pb: { xs: 6, md: 8 },
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 480,
          p: { xs: 3, md: 4.5 },
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1A3C5A', mb: 0.5 }}>
          Create your account
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Book appointments and keep your visits in one place.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Full name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            helperText="At least 8 characters"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((value) => !value)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={submitting}
            sx={{
              mt: 2.5,
              py: 1.3,
              backgroundColor: '#00ACC1',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#0097A7' },
            }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Create account'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: '#4A6B8A' }}>
          Already have an account?{' '}
          <Button component={Link} to="/login" size="small" sx={{ textTransform: 'none' }}>
            Sign in
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}

export default RegisterPage;
