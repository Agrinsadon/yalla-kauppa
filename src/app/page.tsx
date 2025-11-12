import Hero from '@/components/Hero';
import BrandRibbon from '@/components/BrandRibbon';
import WeeklyOffers from '@/components/WeeklyOffers';
import About from '@/components/About';
import Contact from '@/components/Contact';
import { fetchWeeklyOffers } from '@/lib/offers';

export default async function Home() {
  const weeklyOffers = await fetchWeeklyOffers();

  return (
    <>
      <Hero />
      <BrandRibbon />
      <WeeklyOffers offers={weeklyOffers} />
      <About />
      <Contact />
    </>
  );
}
