import Image from 'next/image';
import React from 'react';
import { FaStar } from 'react-icons/fa';
import { GiHealthNormal } from "react-icons/gi";
import { ImQuotesLeft } from "react-icons/im";

const TestimonialsSection = () => {
  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, NY",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "The care I received at Nethra was exceptional. The doctors were thorough, compassionate, and took the time to explain everything. I felt truly heard and well-cared for throughout my treatment journey."
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Outstanding medical expertise combined with genuine human compassion. The entire team at Nethra made my recovery process smooth and comfortable. I couldn't have asked for better healthcare."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      location: "Chicago, IL",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "From the moment I walked in, I felt welcomed and cared for. The doctors at Nethra are not just skilled professionals, but also wonderful human beings who truly care about their patients' wellbeing."
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);

  return (
    <section className='bg-vividblue py-20 px-4 relative overflow-hidden'>
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
      </div>

      <div className="max-width mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="flex items-center justify-center gap-3 text-white/90 font-semibold mb-4">
            <GiHealthNormal className="text-2xl" />
            <small className="text-sm uppercase tracking-wider">PATIENT TESTIMONIALS</small>
          </p>
          <h2 className="text-2xl md:text-[40px] font-semibold mb-6 text-softwhite">
            Hear From Those Who Trust Nethra
          </h2>
          <p className='text-white max-w-3xl m-auto'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt autem molestias tempora blanditiis mollitia odit ipsa, similique quas asperiores deleniti impedit ipsam molestiae corporis, vel repudiandae natus vero labore facere.</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 border border-white/20"
            >
              <div className="mb-6">
                {/* Profile info */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border-3 border-white/30">
                        <img
                          src={testimonial.image}
                          alt={`${testimonial.name} Photo`}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {testimonial.name}
                      </h3>
                      <p className="text-blue-200 text-sm">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <ImQuotesLeft className="text-2xl text-white bg-black w-10 h-10 p-2 rounded-full opacity-80" />
                </div>

                {/* Review description */}
                <div className="mb-6">
                  <p className="text-white/90 leading-relaxed text-sm">
                    {testimonial.review}
                  </p>
                </div>

                {/* Ratings */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-white text-lg" />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>


      </div>
    </section>
  )
}

export default TestimonialsSection