
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BrandLogo from "@/components/BrandLogos";
import FeaturedCars from "@/components/FeaturedCars";
import RecentCars from "@/components/RecentCars";
import SellForm from "@/components/SellForm";
import AboutUs from "@/components/AboutUs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <div>
        <BrandLogo />
      </div>
      <div id="inventory">
        <FeaturedCars />
      </div>
      <div>
        <RecentCars />
      </div>
      <div id="sell">
        <SellForm />
      </div>
      <div id="about">
        <AboutUs />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default Index;