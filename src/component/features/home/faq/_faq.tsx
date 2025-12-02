"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { useRouter } from "next/router";
import { faqData, FAQItem } from "./_faqData";

const Faq = () => {
  const router = useRouter();
  const [openItem, setOpenItem] = useState<number | null>(1);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRefs = useRef<Map<number, HTMLDivElement>>(new Map());

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

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Fixed ref callback - must return void
  const setContentRef = (id: number) => (el: HTMLDivElement | null) => {
    if (el) {
      contentRefs.current.set(id, el);
    } else {
      contentRefs.current.delete(id);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-black/5 to-white px-6 md:px-10 py-16"
    >
      <div className="max-width mx-auto grid lg:grid-cols-2 gap-16 items-start">
        {/* LEFT: Info Section */}
        <div
          className={`space-y-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Header */}
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-darkgray/90 leading-snug mb-4">
              Frequently Asked
              <span className="block text-primary-cyan">Questions</span>
            </h2>

            <p className="text-darkgray/70 text-base md:text-lg leading-relaxed">
              Find answers to the most common questions about Nethra, our verified optometrists, and how {"we're"} making trusted eye care accessible across Nigeria.
            </p>
          </div>

          {/* Trust Indicators */}
          <div
            className={`flex flex-wrap gap-3 transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center gap-2 bg-primary-darkcyan/10 text-primary-darkcyan px-3 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> 24/7 Support
            </div>
            <div className="flex items-center gap-2 bg-primary-darkcyan/10 text-primary-darkcyan px-3 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> Secure Platform
            </div>
            <div className="flex items-center gap-2 bg-primary-darkcyan/10 text-primary-darkcyan px-3 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> Verified Care
            </div>
          </div>

          {/* Contact Support Card */}
          <div
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={`relative overflow-hidden bg-primary-darkcyan text-white rounded-2xl p-6 md:p-8 border border-primary-cyan/20 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* White moon effect */}
            {hovering && (
              <div
                className="absolute pointer-events-none w-32 h-32 bg-white/25 rounded-full blur-3xl transition-transform duration-75 ease-linear"
                style={{
                  top: `${mousePos.y - 64}px`,
                  left: `${mousePos.x - 64}px`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}

            <div className="relative z-10">
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                Still have questions?
              </h3>
              <p className="text-white/80 text-sm md:text-base leading-relaxed mb-5">
                Our support team is here to help you make the most of {"Nethra's"} platform and connect you with the right eye care professional.
              </p>
              <button
                onClick={() => router.push("/contact")}
                type="button"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 border border-white/80 text-white hover:bg-white hover:text-darkgray rounded-full text-sm font-medium transition-all duration-300"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: FAQ Accordion */}
        <div className="space-y-4">
          {faqData.map((item: FAQItem, index: number) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border border-primary-cyan/10 overflow-hidden hover:shadow-md transition-all duration-500 hover:border-primary-cyan/30 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 50}ms` : "0ms",
              }}
            >
              <button
                onClick={() => toggleItem(item.id)}
                type="button"
                className="w-full px-6 py-5 text-left flex items-center justify-between transition-colors duration-200 hover:bg-primary-cyan/5 focus:outline-none"
                aria-expanded={openItem === item.id}
                aria-controls={`faq-answer-${item.id}`}
              >
                <span className="font-medium text-darkgray text-base md:text-lg pr-4">
                  {item.question}
                </span>
                <div className="flex-shrink-0 w-8 h-8 bg-primary-cyan/10 rounded-full flex items-center justify-center">
                  {openItem === item.id ? (
                    <ChevronUp className="text-primary-cyan w-5 h-5" />
                  ) : (
                    <ChevronDown className="text-primary-cyan w-5 h-5" />
                  )}
                </div>
              </button>

              <div
                id={`faq-answer-${item.id}`}
                ref={setContentRef(item.id)}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: openItem === item.id ? "500px" : "0",
                  opacity: openItem === item.id ? 1 : 0,
                }}
              >
                <div className="px-6 pb-6">
                  <div className="w-full h-px bg-primary-cyan/10 mb-4" />
                  <p className="text-darkgray/70 text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;