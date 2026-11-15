import React from 'react';
import { Box, Grid, Typography, Button, Stack, Container, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import StarIcon from '@mui/icons-material/Star';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const HomeSection = () => {
  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* Hero Banner */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: '650px', md: '720px' },
          background: 'linear-gradient(135deg, rgba(0, 92, 151, 0.92) 0%, rgba(0, 172, 193, 0.82) 100%), url("/images/hero.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          pt: { xs: '84px', md: '96px' },
          pb: { xs: 8, md: 10 },
          boxSizing: 'border-box',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40px',
            background: 'linear-gradient(to top, #f8fafc, transparent)',
            zIndex: 1,
          },
        }}
        role="banner"
        aria-label="ProHealth Main Hero Banner"
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Left Content */}
            <Grid item xs={12} md={7}>
              <Box sx={{ mb: 2 }}>
                <Chip
                  icon={<VerifiedUserIcon sx={{ color: '#fff !important', fontSize: '1rem' }} />}
                  label="Trusted Medical Excellence & Healthcare"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    py: 0.5,
                    px: 1,
                    mb: 2,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.2rem', sm: '3rem', md: '3.75rem' },
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-1px',
                  color: '#ffffff',
                  mb: 2.5,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                }}
              >
                Your Partner in <br />
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(90deg, #A7FFEB, #FFFFFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Health & Wellness
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                  lineHeight: 1.7,
                  color: 'rgba(255, 255, 255, 0.95)',
                  mb: 4,
                  maxWidth: '620px',
                }}
              >
                Book top-certified doctors, manage your health appointments seamlessly, 
                and receive world-class personalized medical care anytime.
              </Typography>

              {/* Action Buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 4 }}
              >
                <Button
                  component={Link}
                  to="/find-doctor"
                  variant="contained"
                  size="large"
                  startIcon={<SearchIcon />}
                  sx={{
                    backgroundColor: '#ffffff',
                    color: '#005C97',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    px: 4,
                    py: 1.6,
                    borderRadius: '12px',
                    textTransform: 'none',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#E0F7FA',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
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
                  startIcon={<MedicalServicesIcon />}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.75)',
                    borderWidth: '2px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    px: 3.5,
                    py: 1.6,
                    borderRadius: '12px',
                    textTransform: 'none',
                    backdropFilter: 'blur(6px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#ffffff',
                      backgroundColor: 'rgba(255, 255, 255, 0.22)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Explore Services
                </Button>
              </Stack>

              {/* Quick trust highlights */}
              <Stack
                direction="row"
                spacing={{ xs: 2, sm: 4 }}
                alignItems="center"
                sx={{ pt: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ color: '#FFD700', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
                    4.9 / 5 (3,400+ Reviews)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeFilledIcon sx={{ color: '#A7FFEB', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
                    Instant Confirmation
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Right Side: Interactive Quick Stats Card */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                  maxWidth: { xs: '100%', sm: '420px' },
                  mx: { xs: 'auto', md: '0 0 0 auto' },
                }}
              >
                {/* Stat Card 1 */}
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '16px',
                    p: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateX(6px)' },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      backgroundColor: '#ffffff',
                      color: '#005C97',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      flexShrink: 0,
                    }}
                  >
                    <PeopleAltIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                      150,000+
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', mt: 0.5 }}>
                      Satisfied Patients Treated
                    </Typography>
                  </Box>
                </Box>

                {/* Stat Card 2 */}
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '16px',
                    p: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateX(6px)' },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      backgroundColor: '#ffffff',
                      color: '#00ACC1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      flexShrink: 0,
                    }}
                  >
                    <MedicalServicesIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                      870+
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', mt: 0.5 }}>
                      Licensed Specialists & Doctors
                    </Typography>
                  </Box>
                </Box>

                {/* Stat Card 3 */}
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '16px',
                    p: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateX(6px)' },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      backgroundColor: '#ffffff',
                      color: '#00796B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      flexShrink: 0,
                    }}
                  >
                    <AccessTimeFilledIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                      24/7
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', mt: 0.5 }}>
                      Emergency & Online Assistance
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Feature Highlights Row */}
      <Container maxWidth="xl" sx={{ mt: { xs: -4, md: -5 }, position: 'relative', zIndex: 10, mb: 6 }}>
        <Grid container spacing={2.5}>
          {[
            {
              title: 'Easy Online Booking',
              desc: 'Select preferred doctor and slot in under 2 minutes.',
              color: '#005C97',
              icon: <AccessTimeFilledIcon sx={{ fontSize: 28, color: '#005C97' }} />,
            },
            {
              title: 'Verified Specialists',
              desc: 'Over 800 certified doctors across all medical fields.',
              color: '#00ACC1',
              icon: <VerifiedUserIcon sx={{ fontSize: 28, color: '#00ACC1' }} />,
            },
            {
              title: 'Emergency Care',
              desc: 'Rapid response care ready around the clock 24/7.',
              color: '#D32F2F',
              icon: <MedicalServicesIcon sx={{ fontSize: 28, color: '#D32F2F' }} />,
            },
            {
              title: 'Holistic Care',
              desc: 'Continuous follow-up and modern health monitoring.',
              color: '#00796B',
              icon: <StarIcon sx={{ fontSize: 28, color: '#00796B' }} />,
            },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box
                sx={{
                  backgroundColor: '#ffffff',
                  p: 3,
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #edf2f7',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 14px 30px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '12px',
                    backgroundColor: `${item.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A3C5A', mb: 1, fontSize: '1.1rem' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#5A738E', lineHeight: 1.6 }}>
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
