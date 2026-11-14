import { Link } from 'react-router-dom';
import { Box, Button, Paper, Typography } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

const VerifyEmailSentPage = () => (
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
      <EmailOutlinedIcon sx={{ fontSize: 64, color: '#00ACC1', mb: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A3C5A', mb: 1 }}>
        Check your email
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        We sent you a verification link. Verifying is optional — you can sign in
        now and start booking appointments.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
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
        <Button component={Link} to="/" variant="outlined">
          Back to home
        </Button>
      </Box>
    </Paper>
  </Box>
);

export default VerifyEmailSentPage;
