import HomeSection from './../components/home/HomeSection';
import AboutUsSection from './../components/home/AboutUsSection';
import DepartmentsSection from './../components/home/DepartmentsSection';
import ReviewsSection from './../components/home/ReviewsSection';
import FaqSection from './../components/home/Faq';

function HomePage() {
  return (
    <>
      <HomeSection />
      <DepartmentsSection />
      <AboutUsSection />
      <ReviewsSection />
      <FaqSection />
    </>
  );
}

export default HomePage;
