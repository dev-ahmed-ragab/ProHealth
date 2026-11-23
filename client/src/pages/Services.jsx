import React from 'react';
import PageBanner from '../components/common/PageBanner';
import SpecializeSection from './../components/servies/SpecializeSection';
import SatisfiedPatientsSection from './../components/servies/SatisfiedPatientsSection';
import WhyChooseUsSection from './../components/servies/WhyChooseUsSection';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

function Services() {
  return (
    <>
      <PageBanner
        badge="✦ Clinical Departments & Care"
        title="Our Medical Services"
        subtitle="Comprehensive clinical treatments, modern diagnostic screening, and specialized wellness programs delivered with excellence."
      >
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
            px: 3.5,
            py: 1.3,
            borderRadius: '10px',
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(0, 172, 193, 0.4)',
            '&:hover': { backgroundColor: '#0097A7' },
          }}
        >
          Find a Specialist
        </Button>
      </PageBanner>
      <WhyChooseUsSection />
      <SatisfiedPatientsSection />
      <SpecializeSection />
    </>
  );
}

export default Services;
