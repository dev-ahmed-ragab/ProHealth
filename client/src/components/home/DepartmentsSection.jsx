import React from 'react';
import { Box, Grid, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HealingIcon from '@mui/icons-material/Healing';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const departments = [
  {
    name: 'Cardiology',
    specialty: 'cardiology',
    desc: 'Comprehensive heart care, cardiovascular diagnosis and treatment.',
    icon: <FavoriteIcon sx={{ fontSize: 30 }} />,
  },
  {
    name: 'Neurology',
    specialty: 'neurology',
    desc: 'Expert neurological evaluation, brain, and spinal care.',
    icon: <PsychologyIcon sx={{ fontSize: 30 }} />,
  },
  {
    name: 'Psychiatry & Wellness',
    specialty: 'psychiatry',
    desc: 'Compassionate mental healthcare and therapeutic support.',
    icon: <HealingIcon sx={{ fontSize: 30 }} />,
  },
  {
    name: 'Emergency & Trauma',
    specialty: 'emergency',
    desc: 'Rapid intervention 24/7 with state-of-the-art life support.',
    icon: <MedicalServicesIcon sx={{ fontSize: 30 }} />,
  },
  {
    name: 'Pediatrics',
    specialty: 'pediatrics',
    desc: 'Specialized healthcare and developmental care for children.',
    icon: <ChildCareIcon sx={{ fontSize: 30 }} />,
  },
];

const DepartmentsSection = () => {
  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 7, md: 10 },
        backgroundColor: '#F8FAFC',
      }}
      role="region"
      aria-label="Medical Departments Section"
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', maxWidth: '700px', mx: 'auto', mb: 6 }}>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 800,
              color: '#00ACC1',
              letterSpacing: 2,
              display: 'block',
              mb: 1,
            }}
          >
            OUR SPECIALTIES
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              color: '#1A3C5A',
              letterSpacing: '-0.5px',
              mb: 2,
            }}
          >
            Explore Specialized Departments
          </Typography>
          <Typography variant="body1" sx={{ color: '#5A738E', lineHeight: 1.7 }}>
            Our hospital brings together leading physicians and cutting-edge technology
            across essential clinical specialties.
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {departments.map((dept, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={2.4}>
              <Box
                component={Link}
                to={`/find-doctor?specialty=${dept.specialty}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  p: 3,
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #E5EAF0',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  textDecoration: 'none',
                  height: '100%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 32px rgba(0, 172, 193, 0.16)',
                    borderColor: '#00ACC1',
                    '& .dept-icon-box': {
                      backgroundColor: '#00ACC1',
                      color: '#ffffff',
                    },
                    '& .dept-arrow': {
                      transform: 'translateX(4px)',
                      color: '#00ACC1',
                    },
                  },
                }}
              >
                <Box
                  className="dept-icon-box"
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: '14px',
                    backgroundColor: 'rgba(0, 172, 193, 0.1)',
                    color: '#00ACC1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {dept.icon}
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#1A3C5A',
                    fontSize: '1.15rem',
                    mb: 1,
                  }}
                >
                  {dept.name}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#5A738E',
                    lineHeight: 1.6,
                    mb: 3,
                    flexGrow: 1,
                  }}
                >
                  {dept.desc}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: '#005C97',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}
                >
                  Find Doctors
                  <ArrowForwardIcon
                    className="dept-arrow"
                    sx={{ fontSize: 18, transition: 'transform 0.2s ease' }}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default DepartmentsSection;
