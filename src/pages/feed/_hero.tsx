import React from 'react';
import HeroImg from "../../../public/images/feed/heroImg.jpg";

const HeroSection = () => {
  return (
    <div className="relative px-6 pb-40 pt-30 md:py-45 bg-gray-800 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${HeroImg.src})`,
          filter: 'brightness(0.4) contrast(1.1)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 flex items-center">
        <div className="max-width mx-auto">
          <div className="flex flex-col gap-4 justify-center items-center text-center">
            <h1 className="text-3xl md:text-5xl font-semibold text-white leading-tight">
              Find Verified Optometrists Near You
            </h1>
            <p className="text-white/90 mx-auto max-w-3xl text-lg leading-relaxed">
              We make it easy to connect with trusted eye care professionals. 
              Browse verified profiles, book appointments securely, and take control 
              of your eye health with confidence — anytime, anywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;