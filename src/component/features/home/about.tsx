
"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import AboutImg1 from "../../../../public/images/home/about-img1.webp";

const AboutUsSection = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // for moon glow
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "100px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleBookAppointment = () => router.push("/feed");

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-black/5 to-white px-6 md:px-10 py-16 md:py-24"
    >
      {/* Header Section */}
      <div className="text-center flex flex-col items-center gap-4 mb-14 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-darkgray/90 leading-snug">
          Connecting You to Verified Optometrists
        </h2>
        <p className="text-darkgray/70 text-base md:text-lg leading-relaxed">
          We make trusted eye care accessible for everyone in Nigeria through verified optometrists and secure digital platforms.
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-width mx-auto">
        {/* Image Section */}
        <div className="w-full h-[300px] sm:h-[420px] md:h-[520px] overflow-hidden rounded-2xl">
          <Image
            src={AboutImg1}
            alt="Eye care consultation"
            className="object-cover w-full h-full rounded-2xl"
            priority
            quality={85}
          />
        </div>

        {/* Text & Cards Section */}
        <div
          className={`relative bg-primary-darkcyan rounded-3xl p-6 md:p-10 text-white transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Floating “moon” glow */}
          {hovering && (
            <div
              className="absolute w-40 h-40 bg-white/25 rounded-full blur-3xl pointer-events-none transition-transform duration-100 ease-out"
              style={{
                transform: `translate(${pos.x - 80}px, ${pos.y - 80}px)`,
              }}
            />
          )}

          <header className="relative z-10 mb-8">
            <h3 className="text-xl md:text-2xl font-semibold mb-2">
              Empowering Eye Care Access
            </h3>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              Nethra is a digital health platform dedicated to making trusted eye care accessible for everyone in Nigeria.
            </p>
          </header>

          {/* Cards */}
          <article className="relative z-10 grid sm:grid-cols-2 gap-6 mb-8">
            {/* Vision */}
            <div
              className={`group border border-primary-cyan/20 rounded-2xl p-5 md:p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg bg-white/5 ${
                isVisible ? "opacity-100" : "opacity-0 translate-y-6"
              }`}
              style={{
                transitionDelay: isVisible ? "200ms" : "0ms",
              }}
            >
              <h4 className="text-lg font-medium text-white mb-3 group-hover:text-primary-cyan transition-colors">
                Our Vision
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">
                To build a world where access to safe, transparent, and trusted eye care is a right — starting in Nigeria, expanding across Africa.
              </p>
            </div>

            {/* Mission */}
            <div
              className={`group border border-primary-cyan/20 rounded-2xl p-5 md:p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg bg-white/5 ${
                isVisible ? "opacity-100" : "opacity-0 translate-y-6"
              }`}
              style={{
                transitionDelay: isVisible ? "350ms" : "0ms",
              }}
            >
              <h4 className="text-lg font-medium text-white mb-3 group-hover:text-primary-cyan transition-colors">
                Our Mission
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">
                To connect patients with verified optometrists, combat unsafe eye care practices, and provide a digital-first experience with secure records and follow-ups.
              </p>
            </div>
          </article>

          {/* Button */}
          <div
            className={`relative z-10 flex flex-col sm:flex-row gap-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: isVisible ? "500ms" : "0ms",
            }}
          >
            <button
              onClick={handleBookAppointment}
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-6 bg-transparent border border-white/90 text-white/90 hover:bg-white hover:text-darkgray text-sm md:text-base font-medium rounded-full transition-all duration-300"
            >
              Book Appointment
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
