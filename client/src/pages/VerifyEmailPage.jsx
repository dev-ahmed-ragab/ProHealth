import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useAuth } from '../context/AuthContext';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email…');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const response = await verifyEmail(token);
        if (!cancelled) {
          setMessage(response);
          setStatus('success');
        }
      } catch (err) {
        if (!cancelled) {
          setMessage(err.message || 'This verification link is invalid or expired.');
          setStatus('error');
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [token, verifyEmail]);

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
        sx={{ width: '100%', maxWidth: 500, p: { xs: 3, md: 5 }, textAlign: 'center', borderRadius: '16px' }}
      >
        {status === 'loading' && (
          <>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#1A3C5A' }}>
              Verifying your email…
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#00ACC1', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A3C5A', mb: 1 }}>
              Email verified
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                backgroundColor: '#00ACC1',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#0097A7' },
              }}
            >
              Go to sign in
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorOutlineIcon sx={{ fontSize: 64, color: '#d32f2f', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A3C5A', mb: 1 }}>
              Verification failed
            </Typography>
            <Alert severity="error" sx={{ my: 2, textAlign: 'left' }}>
              {message}
            </Alert>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              You can still sign in and use your account. Request a new link from
              your account settings if email verification is required.
            </Typography>
            <Button component={Link} to="/login" variant="outlined">
              Go to sign in
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmailPage;
