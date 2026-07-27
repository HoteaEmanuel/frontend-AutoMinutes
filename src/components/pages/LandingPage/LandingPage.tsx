import FeaturesSection from '@organisms/Features/FeaturesSection';
import HeroSection from '@organisms/Hero/HeroSection';
import HowItWorksSection from '@organisms/HowItWorks/HowItWorksSection';
import ScreenshotsSection from '@organisms/Screenshots/ScreenshotsSection';

const LandingPage = () => {
  return (
    <div className="flex w-full flex-col overflow-x-hidden">
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ScreenshotsSection />
    </div>
  );
};

export default LandingPage;
