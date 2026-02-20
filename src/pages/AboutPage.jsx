import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/landing/Header.jsx';
import HeroAbout from '../components/about/HeroAbout.jsx';
import HowItWorks from '../components/about/HowItWorks.jsx';
import HeatSafety from '../components/about/HeatSafety.jsx';
import ContactSection from '../components/about/ContactSection.jsx';

function AboutPage() {
  const location = useLocation();

  useEffect(() => {
    // Wait for images to load, then scroll
    const handleScroll = () => {
      if (location.hash) {
        // If there's a hash, scroll to that element
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // If no hash, scroll to top
        window.scrollTo(0, 0);
      }
    };

    // Wait for images to load
    const images = document.querySelectorAll('img');
    if (images.length === 0) {
      // No images, scroll immediately after DOM render
      setTimeout(handleScroll, 300);
    } else {
      // Wait for all images to load
      let loadedCount = 0;
      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          handleScroll();
        }
      };

      images.forEach(img => {
        if (img.complete) {
          checkAllLoaded();
        } else {
          img.addEventListener('load', checkAllLoaded);
          img.addEventListener('error', checkAllLoaded);
        }
      });

      // Fallback in case images take too long
      setTimeout(handleScroll, 1500);
    }
  }, [location.hash]);

  return (
    <div className="about-page">
      <Header />
      <HeroAbout />
      <HowItWorks />
      <HeatSafety />
      <ContactSection />
    </div>
  );
}

export default AboutPage;
