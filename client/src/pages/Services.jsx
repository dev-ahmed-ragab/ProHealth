import React from 'react';
import OurServicesHero from './../components/servies/OurServicesHero';
import SpecializeSection from './../components/servies/SpecializeSection';
import SatisfiedPatientsSection from './../components/servies/SatisfiedPatientsSection';
import WhyChooseUsSection from './../components/servies/WhyChooseUsSection';

function Services() {
  return (
    <>
      <OurServicesHero />
      <WhyChooseUsSection />
      <SatisfiedPatientsSection />
      <SpecializeSection />
    </>
  );
}

export default Services;
