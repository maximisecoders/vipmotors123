
import { MapPin, Phone, Linkedin, Instagram, Facebook, Youtube, Twitter } from "lucide-react";

const TopBanner = () => {
  return (
    <div className="w-full bg-[#D6BCFA] py-2">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-evenly gap-4 md:gap-8 px-4 text-sm">
          <div className="flex items-center gap-2">
            <Phone size={16} />
            <span>+971 4323 2999</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>Sheikh Zayed Road - Dubai</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#9b87f5] transition-colors">
              <Linkedin size={16} />
            </a>
            <a href="#" className="hover:text-[#9b87f5] transition-colors">
              <Instagram size={16} />
            </a>
            <a href="#" className="hover:text-[#9b87f5] transition-colors">
              <Facebook size={16} />
            </a>
            <a href="#" className="hover:text-[#9b87f5] transition-colors">
              <Youtube size={16} />
            </a>
            <a href="#" className="hover:text-[#9b87f5] transition-colors">
              <Twitter size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
