import Hero from '@/components/Hero';
import BrandRibbon from '@/components/BrandRibbon';
import WeeklyOffers from '@/components/WeeklyOffers';
import About from '@/components/About';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <BrandRibbon />
      <WeeklyOffers />
      <About />
      <Contact />
    </>
  );
}
