import React from 'react';
import { Box, Grid, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const HomeSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh', // ارتفاع الشاشة بالكامل
        minHeight: '600px', // الحد الأدنى للارتفاع
        backgroundImage: 'url("/images/image-1.png")',
        backgroundSize: 'auto 90%', // الصورة بارتفاع 90% من الشاشة، العرض يتكيف تلقائيًا
        backgroundPosition: 'bottom right', // الصورة في أسفل يمين الشاشة
        backgroundRepeat: 'no-repeat', // بدون تكرار
        display: 'flex',
        alignItems: 'flex-end', // المحتوى في الأسفل
        justifyContent: 'flex-end', // المحتوى على اليمين
        color: '#fff',
        marginLeft: 'calc(-50vw + 50%)', // توسيط العنصر أفقيًا
        marginTop: '-64px', // تعديل الموضع العمودي
        paddingTop: '64px', // المساحة العلوية
        paddingRight: '16px', // حشوة على اليمين لتحسين المظهر
        boxSizing: 'border-box', // التأكد من أن الحشوة لا تؤثر على الأبعاد
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(83, 201, 207, 0.69)', // الطبقة الشفافة
          zIndex: 1, // التأكد من أن الطبقة فوق الصورة الخلفية
        },
        '& > *': {
          position: 'relative',
          zIndex: 2, // التأكد من أن المحتوى داخل العنصر فوق الطبقة الشفافة
        },
      }}
      role="banner"
      aria-label="Home Hero Section"
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1400px',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: 6,
          textAlign: 'left',
          pl: { xs: 0, md: 3 },
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: '-0.5px',
                color: '#fff',
                mb: 2,
              }}
            >
              Your Partner in Health and Wellness
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
                lineHeight: 1.6,
                color: '#fff',
                opacity: 0.95,
                mb: 4,
                maxWidth: '95%',
              }}
            >
              We are committed to providing you with the best medical and
              healthcare to help you live healthier and happier.
            </Typography>
            <Button
              component={Link}
              to="/about"
              variant="contained"
              startIcon={<PlayArrowIcon />}
              aria-label="See how we work"
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
                '&:hover': {
                  backgroundColor: '#0097A7',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              See how we work
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-end' },
              alignItems: 'center',
              mt: { xs: 4, md: 0 },
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, sm: 3 }}
              sx={{
                background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                borderRadius: '12px',
                p: 3,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <Box textAlign="center">
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 600,
                    color: '#1A3C5A',
                  }}
                >
                  150K+
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    color: '#4A6B8A',
                  }}
                >
                  Patient Feedback
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 600,
                    color: '#1A3C5A',
                  }}
                >
                  870+
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    color: '#4A6B8A',
                  }}
                >
                  Doctors
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomeSection;
