import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useAuth } from '../context/AuthContext';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await forgotPassword(email);
      setMessage(response);
    } catch (err) {
      setError(err.message || 'Could not send reset instructions.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 460,
          p: { xs: 3, md: 4.5 },
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        }}
      >
        <EmailOutlinedIcon sx={{ fontSize: 44, color: '#00ACC1', mb: 1 }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1A3C5A', mb: 0.5 }}>
          Forgot password?
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Enter your email and we will send you a link to reset your password.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
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
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#0097A7' },
            }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Send reset link'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          <Button component={Link} to="/login" size="small" sx={{ textTransform: 'none' }}>
            Back to sign in
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordPage;
