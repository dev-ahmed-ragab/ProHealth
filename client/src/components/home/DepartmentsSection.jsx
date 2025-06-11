import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HealingIcon from '@mui/icons-material/Healing';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ChildCareIcon from '@mui/icons-material/ChildCare';

const departments = [
  {
    name: 'Cardiology Department',
    icon: <FavoriteIcon sx={{ fontSize: 28, color: '#fff' }} />,
    hoverColor: '#e91e63',
  },
  {
    name: 'Neurology Department',
    icon: <PsychologyIcon sx={{ fontSize: 28, color: '#fff' }} />,
    hoverColor: '#9c27b0',
  },
  {
    name: 'Psychiatry Department',
    icon: <HealingIcon sx={{ fontSize: 28, color: '#fff' }} />,
    hoverColor: '#4caf50',
  },
  {
    name: 'Emergency Department',
    icon: <MedicalServicesIcon sx={{ fontSize: 28, color: '#fff' }} />,
    hoverColor: '#f44336',
  },
  {
    name: 'Pediatric Department',
    icon: <ChildCareIcon sx={{ fontSize: 28, color: '#fff' }} />,
    hoverColor: '#ff9800',
  },
];

const DepartmentsSection = () => {
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
      aria-label="Departments Section"
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
        Our Departments
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, sm: 3, md: 3 }}
        justifyContent="center"
        alignItems="center"
      >
        {departments.map((dept, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={2.4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2.5,
                borderRadius: '12px',
                background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  background: dept.hoverColor,
                  '& .dept-icon': {
                    backgroundColor: '#fff',
                    '& svg': { color: dept.hoverColor },
                  },
                  '& .dept-text': {
                    color: '#fff',
                  },
                },
                minHeight: { xs: '140px', md: '180px' },
                width: '100%',
                mx: 'auto',
              }}
              role="article"
              aria-label={`Department: ${dept.name}`}
            >
              <Box
                className="dept-icon"
                sx={{
                  width: '52px',
                  height: '52px',
                  backgroundColor: '#00ACC1',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  transition: 'background-color 0.3s ease',
                }}
              >
                {dept.icon}
              </Box>
              <Typography
                className="dept-text"
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#1A3C5A',
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  lineHeight: 1.2,
                  textAlign: 'center',
                  transition: 'color 0.3s ease',
                }}
              >
                {dept.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DepartmentsSection;
