import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const TiktokIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="h-6 w-6"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();

  const handleManagerClick = () => {
    navigate('/login', { state: { fromManager: true } });
  };

  return (
    <footer className="relative">
      {/* Background with local banner image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]" />
      </div>

      {/* Rest of the footer content */}
      <div className="relative text-white py-12 rounded-t-[2.5rem]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About VIP Motors</h3>
              <p className="text-gray-300 max-w-md">
                The Biggest Luxury Car Showroom in UAE and the WORLD. We specialize in offering premium new and used cars with years of experience in meeting our clients' expectations.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/vipmotorsuae/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://www.instagram.com/vipmotorsuae/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="https://x.com/vipmotorsuae" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="https://www.linkedin.com/company/vipmotorsuae" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="https://www.youtube.com/c/VIPMotorsUAE" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
                <a href="https://www.tiktok.com/@vipmotorsuae" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                  <TiktokIcon />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center pb-4">
            <button 
              onClick={handleManagerClick}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Manager
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
