
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const text = textRef.current;

    gsap.fromTo(heading,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top center",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(text,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        scrollTrigger: {
          trigger: section,
          start: "top center",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white" id="about">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 ref={headingRef} className="text-3xl md:text-4xl font-bold mb-8">
            WELCOME TO <span className="text-[#ea384c]">VIP</span> MOTORS
          </h2>
          <div ref={textRef} className="space-y-6">
            <p className="text-lg text-gray-600">
              Known as The Biggest Luxury Car Showroom in UAE and the WORLD.
            </p>
            <p className="text-gray-600">
              With our collection of Luxury Cars and Super cars and limited edition cars, we aim to meet our clients needs and expectations. We are specialized in offering new and used cars having great years of experience
            </p>
            <p className="text-gray-600">
              Discover a world of unrivaled luxury at our showroom which stands as the ultimate hub for super and luxury and hypercars. We go beyond conventional boundaries, presenting a selection of the world's most exclusive vehicles in one showroom here in Dubai on Sheikh Zayed Road. Immerse yourself in the seamless fusion of design and engineering that elevates each car to the status of a unique masterpiece. At our showroom, we establish new benchmarks embracing a lifestyle defined by sophistication and Luxury. Experience automotive excellence like never before.
            </p>
            
            {/* Video Section */}
            <div className="mt-12">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  className="w-full aspect-video"
                  src="https://www.youtube.com/embed/cVuTkOMd3jg"
                  title="VIP Motors Showroom"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
