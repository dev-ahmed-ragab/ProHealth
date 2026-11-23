import React, { useState } from 'react';
import {
  Alert,
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Stack,
  Container,
} from '@mui/material';
import { Phone, Email, LocationOn } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    if (feedback) setFeedback(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      await api.post('/api/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      setFeedback({
        type: 'success',
        message: 'Thanks for reaching out! Our medical care team will reply by email shortly.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(
          err,
          'We could not send your message. Please try again in a moment.'
        ),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 10, width: '100%', overflowX: 'hidden' }}>
      {/* Original Beloved Parallax Hero Banner */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: '380px', md: '440px' },
          backgroundImage: 'url("/images/landing-parallax-1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: '#ffffff',
          pt: { xs: '96px', md: '110px' },
          pb: { xs: 8, md: 10 },
          boxSizing: 'border-box',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 150, 166, 0.68)', // The original vibrant ProHealth teal overlay
          },
        }}
        role="banner"
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, px: { xs: 2.5, sm: 4, md: 6 } }}>
          <Box sx={{ maxWidth: '700px' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.4rem' },
                fontWeight: 800,
                color: '#ffffff',
                mb: 2,
                lineHeight: 1.2,
                letterSpacing: '-0.5px',
              }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                color: 'rgba(255, 255, 255, 0.95)',
                mb: 4,
                lineHeight: 1.6,
                maxWidth: '90%',
              }}
            >
              We are here to assist you and answer any questions you may have about our clinical departments, doctor appointments, and personalized patient care.
            </Typography>
            <Button
              component={Link}
              to="/find-doctor"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#ffffff',
                color: '#00796B',
                fontSize: '1rem',
                fontWeight: 700,
                px: 3.5,
                py: 1.3,
                borderRadius: '10px',
                textTransform: 'none',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: '#E0F7FA',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Find a Doctor
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Floating Contact Form - Exactly matching the original layout */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10, mt: { xs: -5, md: -7 }, mb: 8 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 3, sm: 4.5 },
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            boxShadow: '0 12px 36px rgba(26, 60, 90, 0.12)',
            border: '1px solid #E2E8F0',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1,
              color: '#1A3C5A',
              fontSize: { xs: '1.5rem', sm: '1.8rem' },
            }}
          >
            Send Us a Message
          </Typography>
          <Typography variant="body2" sx={{ color: '#5A738E', mb: 3.5 }}>
            Fill in the form below and our medical team will get in touch with you promptly.
          </Typography>

          {feedback && (
            <Alert
              severity={feedback.type}
              sx={{ mb: 3, borderRadius: '10px' }}
              onClose={() => setFeedback(null)}
            >
              {feedback.message}
            </Alert>
          )}

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                variant="outlined"
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&:hover fieldset': { borderColor: '#00ACC1' },
                    '&.Mui-focused fieldset': { borderColor: '#00ACC1' },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                variant="outlined"
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&:hover fieldset': { borderColor: '#00ACC1' },
                    '&.Mui-focused fieldset': { borderColor: '#00ACC1' },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                variant="outlined"
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.subject}
                helperText={errors.subject}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&:hover fieldset': { borderColor: '#00ACC1' },
                    '&.Mui-focused fieldset': { borderColor: '#00ACC1' },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                variant="outlined"
                label="Your Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                error={!!errors.message}
                helperText={errors.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&:hover fieldset': { borderColor: '#00ACC1' },
                    '&.Mui-focused fieldset': { borderColor: '#00ACC1' },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                size="large"
                fullWidth
                sx={{
                  backgroundColor: '#00ACC1',
                  color: '#ffffff',
                  fontWeight: 700,
                  py: 1.4,
                  fontSize: '1rem',
                  borderRadius: '10px',
                  boxShadow: '0 4px 14px rgba(0, 172, 193, 0.35)',
                  '&:hover': {
                    backgroundColor: '#0097A7',
                    boxShadow: '0 6px 18px rgba(0, 172, 193, 0.45)',
                  },
                }}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Contact Information & Map Section - Original Layout */}
      <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="stretch">
          {/* Left Column: Contact Details & Working Hours */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 18px rgba(26, 60, 90, 0.06)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A3C5A', mb: 3 }}>
                Get In Touch
              </Typography>

              <Stack spacing={2.5} sx={{ mb: 4 }}>
                {[
                  {
                    icon: <Phone sx={{ fontSize: 24, color: '#00ACC1' }} />,
                    label: 'Emergency & Hotline',
                    value: '+1 234 567 890',
                  },
                  {
                    icon: <Email sx={{ fontSize: 24, color: '#00ACC1' }} />,
                    label: 'Official Email',
                    value: 'info@ProHealth.com',
                  },
                  {
                    icon: <LocationOn sx={{ fontSize: 24, color: '#00ACC1' }} />,
                    label: 'Hospital Address',
                    value: '123 Medical Center Boulevard, Suite 400',
                  },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #EDF2F7',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        backgroundColor: '#E0F7FA',
                        borderColor: '#B2EBF2',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: '0 2px 8px rgba(0, 172, 193, 0.15)',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#5A738E', fontWeight: 600, display: 'block' }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid #EDF2F7' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A3C5A', mb: 1.5 }}>
                  Working Hours
                </Typography>
                <Typography variant="body2" sx={{ color: '#5A738E', mb: 0.8 }}>
                  <strong style={{ color: '#1A3C5A' }}>Monday - Friday:</strong> 8:00 AM – 8:00 PM
                </Typography>
                <Typography variant="body2" sx={{ color: '#5A738E' }}>
                  <strong style={{ color: '#1A3C5A' }}>Saturday - Sunday:</strong> 9:00 AM – 5:00 PM (Emergency 24/7)
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Google Map */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                height: { xs: 350, md: '100%' },
                minHeight: { md: 450 },
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 4px 18px rgba(26, 60, 90, 0.08)',
                border: '1px solid #E2E8F0',
              }}
            >
              <iframe
                title="ProHealth Clinic Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.853784851493!2d46.67527731500262!3d24.77451858408547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2ee3b9b9b9b9b9%3A0x9b9b9b9b9b9b9b9b!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '350px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactUsPage;
