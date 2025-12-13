import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Since react-icons/gi is not available, we'll create a simple health icon component
const GiHealthNormal: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

// Define interfaces for type safety
interface Doctor {
  id: number;
  name: string;
  specialization: string;
  image: string;
}

interface OurDoctorsSectionProps {
  // Add any props you might need in the future
  className?: string;
}

const OurDoctorsSection: React.FC<OurDoctorsSectionProps> = ({ className }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sample doctors data with proper typing
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Neurologist",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialization: "Pediatrician",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Dr. David Kim",
      specialization: "Orthopedic Surgeon",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Dr. Lisa Thompson",
      specialization: "Dermatologist",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "Dr. James Wilson",
      specialization: "Gastroenterologist",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"
    }
  ];

  // Auto-scroll functionality
  const startAutoScroll = (): void => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % doctors.length);
    }, 10000);
  };

  const stopAutoScroll = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [doctors.length]);

  const goToSlide = (index: number): void => {
    setCurrentIndex(index);
    stopAutoScroll();
    setTimeout(startAutoScroll, 5000); // Restart auto-scroll after 5 seconds
  };

  const nextSlide = (): void => {
    goToSlide((currentIndex + 1) % doctors.length);
  };

  const prevSlide = (): void => {
    goToSlide(currentIndex === 0 ? doctors.length - 1 : currentIndex - 1);
  };

  const getVisibleCards = (): Doctor[] => {
    const cards: Doctor[] = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % doctors.length;
      cards.push(doctors[index]);
    }
    return cards;
  };

  const handleMouseEnter = (): void => {
    stopAutoScroll();
  };

  const handleMouseLeave = (): void => {
    startAutoScroll();
  };

  return (
    <section className={`max-width mx-auto px-4 py-16 ${className || ''}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <p className="flex items-center justify-center gap-3 text-blue-600 font-semibold mb-4">
          <GiHealthNormal className="text-2xl w-6 h-6" />
          <small className="text-sm uppercase tracking-wider">OUR DOCTORS</small>
        </p>
        <h2 className="text-2xl md:text-4xl font-semibold mb-6 text-gray-900">
          Meet Our Specialist Doctors
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Our team of highly skilled and compassionate doctors is dedicated to providing exceptional care and expertise in various medical fields. With years of experience and a commitment to staying at the forefront of medical advancements, our doctors ensure that you receive the best possible treatment tailored to your individual needs.
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Desktop Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          type="button"
          aria-label="Previous doctor"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          type="button"
          aria-label="Next doctor"
        >
          <ChevronRight size={24} />
        </button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex gap-6 pb-4">
            {/* Desktop View - Show visible cards */}
            <div className="hidden lg:flex gap-6 w-full">
              {getVisibleCards().map((doctor: Doctor, index: number) => (
                <div
                  key={`${doctor.id}-${currentIndex}-${index}`}
                  className="flex-none w-72 bg-white rounded-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div>
                    <div className="w-72 h-96 mx-auto mb-4 rounded-2xl overflow-hidden">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">{doctor.name}</h3>
                    <p className="text-gray-900 font-medium">{doctor.specialization}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile View - Show all cards for scrolling */}
            <div className="flex lg:hidden gap-6">
              {doctors.map((doctor: Doctor) => (
                <div
                  key={doctor.id}
                  className="flex-none w-72 rounded-2xl"
                >
                  <div>
                    <div className="w-full h-96 mx-auto mb-4 rounded-2xl overflow-hidden">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">{doctor.name}</h3>
                    <p className="text-gray-900 font-medium">{doctor.specialization}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicator (Desktop only) */}
        <div className="hidden lg:flex justify-center mt-8 gap-2">
          {doctors.map((_: Doctor, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              type="button"
              aria-label={`Go to doctor ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -webkit-overflow-scrolling: touch;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default OurDoctorsSection;