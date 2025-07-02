import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Stack,
  Card,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const ReviewsSection = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const reviews = [
    {
      name: 'Paulo Hubert',
      location: 'New York, USA',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      review:
        'I recently had to bring my child to ProHealth for a minor injury, and was so impressed with the care he received. The pediatrician was great with him and made him feel at ease, and the entire staff was kind and attentive.',
    },
    {
      name: 'Laurence Vendetta',
      location: 'California, USA',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      review:
        'The team at ProHealth was incredibly supportive during my treatment. Their holistic approach made all the difference, and I felt truly cared for throughout the process.',
    },
    {
      name: 'Cassandra Raul',
      location: 'Florida, USA',
      avatar:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      review:
        'ProHealth exceeded my expectations! The staff was professional and compassionate, and the care I received was top-notch. I highly recommend their services.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <Box
      sx={{
        maxWidth: '1400px',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 6, md: 8 },
        backgroundColor: 'transparent',
      }}
      role="region"
      aria-label="Reviews Section"
    >
      <Typography
        variant="h3"
        sx={{
          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
          fontWeight: 700,
          lineHeight: 1.3,
          letterSpacing: '-0.5px',
          color: '#005C97',
          textAlign: 'center',
          mb: 4,
          pl: { xs: 0, md: 3 },
        }}
      >
        What Our Clients Say
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, sm: 3, md: 3 }}
        direction={{ xs: 'column', md: 'row' }}
      >
        <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 0 } }}>
          <Stack spacing={2}>
            {reviews.map((client, index) => (
              <Box
                key={index}
                onClick={() => handleClick(index)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: '12px',
                  background:
                    activeIndex === index
                      ? 'linear-gradient(145deg, #ffffff, #f0f4f8)'
                      : 'transparent',
                  boxShadow:
                    activeIndex === index
                      ? '0 4px 12px rgba(0, 0, 0, 0.1)'
                      : 'none',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                    background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                  },
                }}
                role="button"
                aria-label={`Select review by ${client.name}`}
              >
                <Avatar
                  src={client.avatar}
                  alt={client.name}
                  sx={{
                    width: 52,
                    height: 52,
                    mr: 2,
                    border:
                      activeIndex === index
                        ? '2px solid #00ACC1'
                        : '2px solid transparent',
                  }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#1A3C5A',
                      fontSize: '1.1rem',
                    }}
                  >
                    {client.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      color: '#4A6B8A',
                    }}
                  >
                    {client.location}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            order: { xs: 2, md: 0 },
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-end' },
            marginLeft:'auto' 
          }}
        >
          <Card
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: '12px',
              background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              },
              maxWidth: { xs: '100%', md: '600px' },
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              sx: { marginLeft:'auto' },
            }}
            role="article"
            aria-label={`Review by ${reviews[activeIndex].name}`}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.2rem' },
                lineHeight: 1.6,
                color: '#4A6B8A',
                pl: { xs: 0, md: 3 },
              }}
            >
              {reviews[activeIndex].review}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 3, pl: { xs: 0, md: 3 } }}
            >
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  sx={{
                    color: '#FFD700',
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                  }}
                />
              ))}
            </Stack>
            {isSmallScreen && (
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                sx={{ mt: 3 }}
              >
                {reviews.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => handleClick(index)}
                    sx={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor:
                        activeIndex === index ? '#00ACC1' : '#e0e0e0',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }}
                    role="button"
                    aria-label={`Select review ${index + 1}`}
                  />
                ))}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReviewsSection;
