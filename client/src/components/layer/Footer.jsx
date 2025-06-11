import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return 'Email is required';
    } else if (!emailRegex.test(value)) {
      return 'Please enter a valid email';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateEmail(email);
    setEmailError(error);
    if (!error) {
      // Handle subscription logic (e.g., API call)
      console.log('Subscribed with:', email);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'rgba(0, 92, 151, 0.75)',
        color: '#fff',
        py: { xs: 6, md: 8 },
        position: 'relative',
      }}
      role="contentinfo"
      aria-label="Footer"
    >
      <Box
        sx={{
          maxWidth: '1400px',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
          {/* Newsletter Subscription */}
          <Grid item xs={12} md={5}>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 600,
                color: '#fff',
                mb: 2,
                pl: { xs: 0, md: 3 },
              }}
            >
              Subscribe to Our Newsletter
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.9rem',
                lineHeight: 1.5,
                color: '#fff',
                opacity: 0.95,
                mb: 2,
                pl: { xs: 0, md: 3 },
              }}
            >
              Stay updated with our latest news and health tips.
            </Typography>
            <Box
              component="form"
              sx={{ mt: 2, pl: { xs: 0, md: 3 } }}
              onSubmit={handleSubmit}
            >
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Your email address"
                    variant="outlined"
                    value={email}
                    onChange={handleEmailChange}
                    error={!!emailError}
                    helperText={emailError}
                    aria-label="Email address for newsletter"
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': { borderColor: 'transparent' },
                        '&:hover fieldset': { borderColor: 'transparent' },
                        '&.Mui-focused fieldset': { borderColor: '#00ACC1' },
                      },
                      '& .MuiInputBase-input': {
                        color: '#1A3C5A',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#1A3C5A',
                        fontSize: '0.8rem',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    sx={{
                      height: '40px',
                      backgroundColor: '#00ACC1',
                      color: '#fff',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#0097A7',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    Subscribe
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 600,
                color: '#fff',
                mb: 2,
              }}
            >
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/find-doctor', label: 'Find a Doctor' },
                { to: '/services', label: 'Services' },
                { to: '/contact', label: 'Contact Us' },
              ].map((link, index) => (
                <Box component="li" sx={{ mb: 1 }} key={index}>
                  <Button
                    component={Link}
                    to={link.to}
                    variant="inherit"
                    aria-label={link.label}
                    sx={{
                      color: '#fff',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      fontWeight: 600,
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      p: 0,
                      '&:hover': {
                        color: '#00ACC1',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 600,
                color: '#fff',
                mb: 2,
              }}
            >
              Services
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {['Emergency Care', 'Cardiology', 'Dental Care', 'Neurology'].map(
                (service, index) => (
                  <Box component="li" sx={{ mb: 1 }} key={index}>
                    <Button
                      component={Link}
                      to="/services"
                      variant="inherit"
                      aria-label={service}
                      sx={{
                        color: '#fff',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        fontWeight: 600,
                        textTransform: 'none',
                        justifyContent: 'flex-start',
                        p: 0,
                        '&:hover': {
                          color: '#00ACC1',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      {service}
                    </Button>
                  </Box>
                )
              )}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 600,
                color: '#fff',
                mb: 2,
              }}
            >
              Contact Us
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  color: '#fff',
                  opacity: 0.95,
                }}
              >
                123 Medical Street, Health City
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  color: '#fff',
                  opacity: 0.95,
                }}
              >
                HC 12345, Country
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  color: '#fff',
                  opacity: 0.95,
                }}
              >
                Phone: +1 234 567 890
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  color: '#fff',
                  opacity: 0.95,
                }}
              >
                Email: info@ProHealth.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {[
                {
                  icon: <FacebookIcon sx={{ fontSize: 28, color: '#fff' }} />,
                  label: 'Facebook',
                },
                {
                  icon: <TwitterIcon sx={{ fontSize: 28, color: '#fff' }} />,
                  label: 'Twitter',
                },
                {
                  icon: <InstagramIcon sx={{ fontSize: 28, color: '#fff' }} />,
                  label: 'Instagram',
                },
                {
                  icon: <LinkedInIcon sx={{ fontSize: 28, color: '#fff' }} />,
                  label: 'LinkedIn',
                },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  aria-label={social.label}
                  sx={{
                    color: '#fff',
                    backgroundColor: '#00ACC1',
                    borderRadius: '8px',
                    width: '40px',
                    height: '40px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#0097A7',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Copyright and Back to Top */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.9rem',
              lineHeight: 1.5,
              color: '#fff',
              opacity: 0.95,
            }}
          >
            © {new Date().getFullYear()} ProHealth. All rights reserved.
          </Typography>
          <IconButton
            onClick={scrollToTop}
            aria-label="Scroll to top"
            sx={{
              backgroundColor: '#00ACC1',
              color: '#fff',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                backgroundColor: '#0097A7',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            <KeyboardArrowUpIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
