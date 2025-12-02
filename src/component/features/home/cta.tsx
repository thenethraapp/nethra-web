"use client";
import { useState } from "react";
import Link from "next/link";

const CTA = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section className="px-6 mb-10">
      <section
        className="relative mx-auto max-width rounded-2xl overflow-hidden bg-primary-darkcyan px-6 py-20 md:py-24"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Static soft background accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Moving “moon” glow */}
        {hovering && (
          <div
            className="absolute w-40 h-40 rounded-full bg-white/25 blur-3xl pointer-events-none transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${pos.x - 80}px, ${pos.y - 80}px)`,
            }}
          />
        )}

        {/* CTA Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 leading-snug">
            See Clearly. Choose Safely.
          </h2>

          <p className="text-white/80 text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Access trusted eye care from verified optometrists — because your vision deserves
            more than guesswork. Nethra makes finding safe, professional care simple and secure.
          </p>

          <Link
            href="/feed"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-white/80 text-white font-medium rounded-full hover:bg-white hover:text-darkgray transition-all duration-300 hover:shadow-lg"
          >
            Find a Verified Doctor
          </Link>
        </div>
      </section>
    </section>
  );
};

export default CTA;
