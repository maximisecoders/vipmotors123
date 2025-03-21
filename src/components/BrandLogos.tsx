import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const brands = [
  {
    name: "Aston Martin",
    logo: "/brands/astonmartin.png",
    slug: "aston-martin"
  },
  {
    name: "Audi",
    logo: "/brands/audi.png",
    slug: "audi"
  },
  {
    name: "Bentley",
    logo: "/brands/bentley.png",
    slug: "bentley"
  },
  {
    name: "BMW",
    logo: "/brands/bmw.png",
    slug: "bmw"
  },
  {
    name: "Bugatti",
    logo: "/brands/bugatti.png",
    slug: "bugatti"
  },
  {
    name: "Ferrari",
    logo: "/brands/ferrari.png",
    slug: "ferrari"
  },
  {
    name: "Koenigsegg",
    logo: "/brands/koenigsegg.png",
    slug: "koenigsegg"
  },
  {
    name: "Lamborghini",
    logo: "/brands/lamborghini.png",
    slug: "lamborghini"
  },
  {
    name: "Maserati",
    logo: "/brands/maserati.png",
    slug: "maserati"
  },
  {
    name: "McLaren",
    logo: "/brands/mclaren.png",
    slug: "mclaren"
  },
  {
    name: "Mercedes-Benz",
    logo: "/brands/mercedesbenz.png",
    slug: "mercedes" // Keep lowercase for consistency
  },
  {
    name: "Pagani",
    logo: "/brands/pagani.png",
    slug: "pagani"
  },
  {
    name: "Porsche",
    logo: "/brands/porsche.png",
    slug: "porsche"
  },
  {
    name: "Rolls-Royce",
    logo: "/brands/rollsroyce.png",
    slug: "rolls royce" // Changed from "rolls-royce" to "rolls royce" to match database
  }
];

const BrandLogos = () => {
  const navigate = useNavigate();

  const handleBrandClick = (brandSlug: string) => {
    // Convert all brand slugs to lowercase for consistency
    navigate(`/inventory?make=${brandSlug.toLowerCase()}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background image with enhanced overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/banner1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 backdrop-blur-[0.5px]" />
      </div>

      <div className="container mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Luxury Car Brands
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Explore our collection of the world's most prestigious automotive brands
            </p>
          </div>
        </ScrollReveal>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 px-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {brands.map((brand, index) => (
            <motion.div
              key={brand.slug}
              variants={item}
              layout
              className="z-20"
            >
              <Card
                className="relative group cursor-pointer transition-all duration-500 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl border border-white/10"
                onClick={() => handleBrandClick(brand.slug)}
              >
                <div className="relative aspect-square flex flex-col items-center justify-center p-6">
                  <div className="flex-1 flex items-center justify-center w-full">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-auto object-contain transition-all duration-500 group-hover:scale-110 max-h-[60px]"
                    />
                  </div>
                  
                  <div className="mt-4 text-center">
                    <span className="text-sm font-medium text-white opacity-80 group-hover:opacity-100">
                      {brand.name}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandLogos;
