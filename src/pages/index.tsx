import dynamic from 'next/dynamic';
import HeroSection from '@/component/features/home/hero'
import ProfileCompletionSticker from '@/component/common/ProfileCompletionSticker';

const HowWeWorkSection = dynamic(() => import('@/component/features/home/how-we-work'));
const OurPartners = dynamic(() => import('@/component/features/home/our-partners'));
const AboutUsSection = dynamic(() => import('@/component/features/home/about'));
const Faq = dynamic(() => import('@/component/features/home/faq/_faq'));
const CTA = dynamic(() => import('@/component/features/home/cta'));

const Home = () => {
  return (
    <main>
      <HeroSection />
      <OurPartners />
      <HowWeWorkSection />
      <AboutUsSection />
      <Faq />
      <CTA />
      <ProfileCompletionSticker />
    </main>
  )
}

export default Home;