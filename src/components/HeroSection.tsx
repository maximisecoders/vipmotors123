import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/50 z-[1]" /> {/* Overlay */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
          src="/vds/herovd1.mp4"
        />
      </div>
      
      <div className="relative h-full flex items-center justify-center z-10 text-center text-white space-y-6 px-4 animate-fade-up">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Luxury Cars Reimagined
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-200 mt-6">
            Discover the finest collection of premium vehicles
          </p>
          <div className="flex justify-center mt-6">
            <Button
              size="lg"
              className="bg-transparent border border-gray-400/50 text-white hover:bg-white hover:text-black transition-all duration-300"
              onClick={() => navigate('/inventory')}
            >
              Browse Collection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
