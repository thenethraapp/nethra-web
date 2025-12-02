import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const texts = [
  {
    title: 'Trusted Optometrists',
    paragraph: 'Connected in seconds with full verification.'
  },
  {
    title: 'Safe Eye Care',
    paragraph: 'Avoid unlicensed practice with verified professionals.'
  },
  {
    title: 'Fast Booking',
    paragraph: 'Get matched instantly with the right optometrist.'
  }
];

const HeroSection = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [index, setIndex] = useState(0);
  const [typedParagraph, setTypedParagraph] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentText = texts[index].paragraph;
    let charIndex = 0;
    setTypedParagraph('');

    const typer = setInterval(() => {
      setTypedParagraph(currentText.slice(0, charIndex));
      charIndex++;
      if (charIndex > currentText.length) clearInterval(typer);
    }, 40);

    return () => clearInterval(typer);
  }, [index]);

  const handleFindOptometrist = () => router.push('/feed');
  const handleSignUpOptometrist = () =>
    router.push('/account/register?user=optometrist');

  return (
    <div className="relative overflow-hidden px-6 bg-primary-cyan/5 py-18.75">
      <div className="max-width flex flex-col-reverse lg:flex-row items-center lg:items-center justify-between gap-12 lg:gap-0">

        {/* LEFT COL */}
        <div className="space-y-6 flex flex-col text-center lg:text-left max-w-xl mx-auto lg:mx-0">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold md:font-bold text-darkgray/90 leading-tight">
                Life is a Lot Brighter
                <br />
                <span className="text-darkgray/90">With Better Vision</span>
              </h1>
            </div>
            <p className="text-darkgray/90 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Nethra connects you to verified optometrists in seconds, so you can
              book safe, professional eye care without the risk of unlicensed
              practice.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 justify-center lg:justify-start">
            <button
              onClick={handleFindOptometrist}
              className="cursor-pointer w-full sm:w-auto bg-primary-cyan hover:bg-primary-cyan/70 text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Find a Verified Optometrist
            </button>

            {!user?.id && (
              <button
                onClick={handleSignUpOptometrist}
                className="cursor-pointer w-full sm:w-auto border-none text-darkgray/70 font-semibold text-sm sm:text-base px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Join as an Optometrist
                <span className="inline-block ml-2 align-middle">
                  <ArrowForwardIcon className="w-4 h-4" />
                </span>
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COL (IMAGE) */}
        <div className="bg-primary-cyan w-full max-w-md lg:max-w-120 h-80 sm:h-96 lg:h-120 rounded-3xl overflow-hidden relative mx-auto lg:mx-0">
          <Image
            src="/images/home/hero-image-01.webp"
            alt="Nethra connects you to verified optometrists in seconds"
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-4 left-4 backdrop-blur-xl bg-black/10 border border-white/30 shadow-lg rounded-2xl p-4 w-[160px] sm:w-[180px] flex flex-col gap-2 transition-all duration-500 min-h-40">
            <h3 className="text-white text-base sm:text-lg font-semibold opacity-100 transition-opacity duration-700">
              {texts[index].title}
            </h3>
            <p className="text-white/80 text-xs sm:text-sm leading-snug min-h-[40px] whitespace-pre-wrap">
              {typedParagraph}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;