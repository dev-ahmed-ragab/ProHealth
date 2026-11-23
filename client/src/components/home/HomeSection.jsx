import React from 'react';
import { Box, Grid, Typography, Button, Stack, Container, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import StarIcon from '@mui/icons-material/Star';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const HomeSection = () => {
  return (
    <Box sx={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Hero Banner with Clean Medical Aesthetic */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          background: 'linear-gradient(180deg, #F0F7FB 0%, #FFFFFF 100%)',
          pt: { xs: '96px', md: '110px' },
          pb: { xs: 5, md: 7 },
          boxSizing: 'border-box',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 172, 193, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '0',
            left: '-120px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 92, 151, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
        }}
        role="banner"
        aria-label="ProHealth Main Hero Banner"
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, px: { xs: 2.5, sm: 4, md: 6 } }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* Left Column: Heading, Subtitle & CTAs */}
            <Grid size={{ xs: 12, md: 6, lg: 6.5 }}>
              <Box sx={{ mb: 2 }}>
                <Chip
                  icon={<VerifiedUserIcon sx={{ color: '#00ACC1 !important', fontSize: '1.1rem' }} />}
                  label="Trusted Medical Excellence & Healthcare"
                  sx={{
                    backgroundColor: '#E0F7FA',
                    color: '#00796B',
                    fontWeight: 700,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    py: 1,
                    px: 1.5,
                    mb: 2.5,
                    border: '1px solid #B2EBF2',
                    borderRadius: '50px',
                  }}
                />
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem' },
                  fontWeight: 800,
                  lineHeight: 1.18,
                  letterSpacing: '-0.8px',
                  color: '#1A3C5A',
                  mb: 2.5,
                }}
              >
                Your Partner in <br />
                <Box
                  component="span"
                  sx={{
                    color: '#00ACC1',
                    display: 'inline-block',
                  }}
                >
                  Health &amp; Wellness
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem' },
                  lineHeight: 1.7,
                  color: '#4A6B8A',
                  mb: 4,
                  maxWidth: '560px',
                }}
              >
                We are committed to providing you with the best medical and healthcare to help you live healthier and happier. Book top certified doctors, manage appointments, and receive world-class care anytime.
              </Typography>

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4.5 }}>
                <Button
                  component={Link}
                  to="/find-doctor"
                  variant="contained"
                  size="large"
                  startIcon={<SearchIcon />}
                  sx={{
                    backgroundColor: '#00ACC1',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    px: 3.5,
                    py: 1.4,
                    borderRadius: '10px',
                    textTransform: 'none',
                    boxShadow: '0 8px 20px rgba(0, 172, 193, 0.35)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      backgroundColor: '#0097A7',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 24px rgba(0, 172, 193, 0.45)',
                    },
                  }}
                >
                  Find a Doctor
                </Button>
                <Button
                  component={Link}
                  to="/service"
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    borderColor: '#00ACC1',
                    color: '#00796B',
                    fontWeight: 700,
                    fontSize: '1rem',
                    px: 3.5,
                    py: 1.4,
                    borderRadius: '10px',
                    textTransform: 'none',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: '#0097A7',
                      backgroundColor: '#F0FBFD',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  See How We Work
                </Button>
              </Stack>

              {/* Trust Indicators Row */}
              <Box
                sx={{
                  pt: 2.5,
                  borderTop: '1px solid #E2E8F0',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: { xs: 2, sm: 3 },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Stack direction="row" spacing={0.25}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: '#FFB300', fontSize: '1.25rem' }} />
                    ))}
                  </Stack>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#1A3C5A', ml: 0.5 }}>
                    4.9 / 5
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                  (3,400+ Patient Feedback)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#00796B' }}>
                  <VerifiedUserIcon sx={{ fontSize: '1.1rem', color: '#00ACC1' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Instant Confirmation
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Column: Doctor Cutout Image + Floating Stats Cards */}
            <Grid size={{ xs: 12, md: 6, lg: 5.5 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: { xs: 340, sm: 440, md: 520 },
                }}
              >
                {/* Soft circular decorative backdrop */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: { xs: 280, sm: 380, md: 440 },
                    height: { xs: 280, sm: 380, md: 440 },
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #E0F7FA 0%, #E0F2FE 60%, transparent 100%)',
                    zIndex: 1,
                  }}
                />

                {/* Main Doctor Image */}
                <Box
                  component="img"
                  src="/images/hero1.png"
                  alt="ProHealth Certified Specialist Doctor"
                  sx={{
                    position: 'relative',
                    zIndex: 2,
                    maxHeight: { xs: 360, sm: 460, md: 520 },
                    maxWidth: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 16px 32px rgba(26, 60, 90, 0.14))',
                  }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/image-1.png';
                  }}
                />

                {/* Floating Card 1: 150K+ Patients (Top-Right) */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: '4%', sm: '8%', md: '10%' },
                    right: { xs: '0px', sm: '10px', md: '-10px' },
                    zIndex: 3,
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    p: { xs: 1.5, sm: 2 },
                    boxShadow: '0 12px 30px rgba(26, 60, 90, 0.12)',
                    border: '1px solid #EDF2F7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 38, sm: 46 },
                      height: { xs: 38, sm: 46 },
                      borderRadius: '12px',
                      backgroundColor: '#E0F7FA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00ACC1',
                    }}
                  >
                    <PeopleAltIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: '#1A3C5A',
                        fontSize: { xs: '1rem', sm: '1.2rem' },
                        lineHeight: 1.1,
                      }}
                    >
                      150K+
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#64748B',
                        fontWeight: 600,
                        display: 'block',
                        fontSize: { xs: '0.72rem', sm: '0.78rem' },
                      }}
                    >
                      Satisfied Patients
                    </Typography>
                  </Box>
                </Box>

                {/* Floating Card 2: 870+ Doctors (Bottom-Left) */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: '4%', sm: '8%', md: '8%' },
                    left: { xs: '0px', sm: '10px', md: '-15px' },
                    zIndex: 3,
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    p: { xs: 1.5, sm: 2 },
                    boxShadow: '0 12px 30px rgba(26, 60, 90, 0.12)',
                    border: '1px solid #EDF2F7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 38, sm: 46 },
                      height: { xs: 38, sm: 46 },
                      borderRadius: '12px',
                      backgroundColor: '#E0F2FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0284C7',
                    }}
                  >
                    <MedicalServicesIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: '#1A3C5A',
                        fontSize: { xs: '1rem', sm: '1.2rem' },
                        lineHeight: 1.1,
                      }}
                    >
                      870+
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#64748B',
                        fontWeight: 600,
                        display: 'block',
                        fontSize: { xs: '0.72rem', sm: '0.78rem' },
                      }}
                    >
                      Certified Specialists
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Feature Highlights Row - Perfectly Uniform in Width & Height */}
      <Container maxWidth="xl" sx={{ mt: { xs: 4, md: 5 }, mb: 8, px: { xs: 2.5, sm: 4, md: 6 } }}>
        <Grid container spacing={3}>
          {[
            {
              title: 'Easy Online Booking',
              desc: 'Select your preferred doctor, check schedule, and confirm appointment in under 2 minutes.',
              icon: <AccessTimeFilledIcon sx={{ fontSize: 26, color: '#00ACC1' }} />,
            },
            {
              title: 'Verified Specialists',
              desc: 'Over 870 board-certified physicians across cardiology, neurology, pediatrics, and dermatology.',
              icon: <VerifiedUserIcon sx={{ fontSize: 26, color: '#00ACC1' }} />,
            },
            {
              title: '24/7 Emergency Care',
              desc: 'Rapid medical response and immediate consultation ready around the clock whenever needed.',
              icon: <MedicalServicesIcon sx={{ fontSize: 26, color: '#00ACC1' }} />,
            },
            {
              title: 'Holistic Wellness',
              desc: 'Continuous personalized patient care focusing on long-term prevention and overall vitality.',
              icon: <StarIcon sx={{ fontSize: 26, color: '#00ACC1' }} />,
            },
          ].map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  backgroundColor: '#ffffff',
                  p: { xs: 3, sm: 3.5 },
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(26, 60, 90, 0.06)',
                  border: '1px solid #EEF2F6',
                  height: '100%',
                  minHeight: { xs: 'auto', md: '210px' },
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 28px rgba(0, 172, 193, 0.15)',
                    borderColor: '#00ACC1',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    backgroundColor: '#E0F7FA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A3C5A', mb: 1, fontSize: '1.1rem' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6, fontSize: '0.9rem', flexGrow: 1 }}>
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomeSection;
