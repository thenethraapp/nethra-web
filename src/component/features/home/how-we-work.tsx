"use client";
import { useEffect, useRef, useState } from "react";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

const HowWeWorkSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      title: "For Patients",
      text: "Search, compare, and book verified optometrists near you with ease",
      Icon: PeopleAltIcon,
    },
    {
      title: "For Optometrists",
      text: "Grow your practice with comprehensive appointment and booking management",
      Icon: WorkOutlineIcon,
    },
    {
      title: "Seamless Flow",
      text: "From booking to follow-ups, everything stays connected on one platform",
      Icon: SyncAltIcon,
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white via-primary-cyan/10 to-white flex justify-center px-6 pb-16">
      <section ref={sectionRef} className="max-width mx-auto w-full">
        
        {/* Section Heading */}
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-12">
            How We Work
          </h2>
          <p className="text-slate-600 mt-2 text-base max-w-xl mx-auto">
            Designed to simplify the way patients and optometrists connect
          </p>
        </div>

        {/* Cards */}
        <div
          className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {cards.map((item, i) => (
            <div
              key={i}
              className="bg-primary-cyan/10 p-8 rounded-3xl hover:bg-primary-cyan/20 transition-all group shadow-sm"
            >
              {/* ICON */}
              <div className="flex items-center justify-center md:justify-start mb-4">
                <item.Icon
                  className="text-primary-cyan transition-transform group-hover:scale-110"
                  style={{ fontSize: 40 }}
                />
              </div>

              <h4 className="text-lg font-semibold text-slate-900 mb-2">
                {item.title}
              </h4>

              <p className="text-sm text-slate-600 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default HowWeWorkSection;
