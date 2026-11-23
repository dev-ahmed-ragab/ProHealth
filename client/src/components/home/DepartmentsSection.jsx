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
    desc: 'Comprehensive cardiovascular screening, diagnostics, and heart treatments.',
    icon: <FavoriteIcon sx={{ fontSize: 28 }} />,
  },
  {
    name: 'Neurology',
    specialty: 'neurology',
    desc: 'Expert neurological assessment, migraine therapy, brain, and spine wellness.',
    icon: <PsychologyIcon sx={{ fontSize: 28 }} />,
  },
  {
    name: 'Pediatrics',
    specialty: 'pediatrics',
    desc: 'Compassionate pediatric healthcare, child vaccinations, and growth development.',
    icon: <ChildCareIcon sx={{ fontSize: 28 }} />,
  },
  {
    name: 'Dermatology',
    specialty: 'dermatology',
    desc: 'Advanced skincare, clinical dermatology, allergy checks, and aesthetic care.',
    icon: <HealingIcon sx={{ fontSize: 28 }} />,
  },
  {
    name: 'Emergency Care',
    specialty: 'emergency',
    desc: 'Rapid 24/7 emergency response, acute trauma intervention, and immediate care.',
    icon: <MedicalServicesIcon sx={{ fontSize: 28 }} />,
  },
];

const DepartmentsSection = () => {
  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 8, md: 11 },
        backgroundColor: '#F8FAFC',
      }}
      role="region"
      aria-label="Medical Departments Section"
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
        <Box sx={{ textAlign: 'center', maxWidth: '720px', mx: 'auto', mb: { xs: 5, md: 7 } }}>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 800,
              color: '#00ACC1',
              letterSpacing: 2,
              display: 'block',
              mb: 1,
              fontSize: '0.85rem',
            }}
          >
            OUR CLINICAL SPECIALTIES
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '2.9rem' },
              fontWeight: 800,
              color: '#1A3C5A',
              letterSpacing: '-0.5px',
              mb: 2,
            }}
          >
            Explore Specialized Departments
          </Typography>
          <Typography variant="body1" sx={{ color: '#5A738E', lineHeight: 1.7, fontSize: '1.05rem' }}>
            Our medical center brings together distinguished physicians and advanced equipment across key health disciplines.
          </Typography>
        </Box>

        {/* 5 Equal-Width Cards on Desktop (columns=10, size=2), 2 on Tablet, 1 on Mobile */}
        <Grid container spacing={3} columns={{ xs: 12, sm: 6, md: 12, lg: 10 }}>
          {departments.map((dept, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Box
                component={Link}
                to={`/find-doctor?specialty=${dept.specialty}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: { xs: 3, md: 3.5 },
                  borderRadius: '18px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 16px rgba(26, 60, 90, 0.05)',
                  textDecoration: 'none',
                  height: '100%',
                  minHeight: { xs: 240, md: 280 },
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
                    width: 60,
                    height: 60,
                    borderRadius: '16px',
                    backgroundColor: '#E0F7FA',
                    color: '#00ACC1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
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
                    mb: 1.2,
                    lineHeight: 1.3,
                  }}
                >
                  {dept.name}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#5A738E',
                    lineHeight: 1.6,
                    fontSize: '0.88rem',
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
                    gap: 0.6,
                    color: '#00ACC1',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    mt: 'auto',
                  }}
                >
                  View Doctors
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
