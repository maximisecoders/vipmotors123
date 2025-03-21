import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Experience Luxury & Performance
          </motion.h1>
          
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
          >
            Discover our exclusive collection of premium vehicles
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
