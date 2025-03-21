import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface NavbarProps {
  forceLight?: boolean;
}

const Navbar = ({ forceLight }: NavbarProps = {}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (href: string) => {
    if (href.startsWith('/#')) {
      if (location.pathname === '/') {
        const element = document.querySelector(href.replace('/', ''));
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href.replace('/', ''));
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      navigate(href);
    }
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Inventory", href: "/inventory" },
    { label: "About Us", href: "/#about" },
    { label: "Contact Us", href: "/#contact" },
    { label: "Sell a Car", href: "/#sell" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className={`flex items-center justify-between rounded-full py-4 px-8 max-w-5xl mx-auto transition-all duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}>
          <Link to="/" className="flex items-center">
            <span className="font-bold text-2xl">
              <span className="text-red-600">VIP</span>
              <span className={isScrolled || forceLight ? 'text-gray-800' : 'text-white'}>MOTORS</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 ">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className={`hover:text-red-600 transition-colors ${
                  isScrolled || forceLight ? 'text-gray-800' : 'text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <Button 
              variant={isScrolled || forceLight ? "outline" : "secondary"}
              className={!isScrolled && !forceLight ? "bg-white/20 hover:bg-white/30 text-white border-white" : ""}
            >
              <Link to="/compare">Compare</Link>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`md:hidden ${isScrolled || forceLight ? 'text-gray-800' : 'text-white'}`}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white backdrop-blur-lg pt-5 py-3 rounded-l-2xl flex justify-center items-center text-2xl lg:text-3xl text-gray-800 ">
              <div className="flex flex-col space-y-4 mt-8 ">
                <Link to="/" className="flex items-center">
                  <span className="font-bold text-2xl">
                    <span className="text-red-600">VIP</span>
                    <span className= 'text-gray-800'>MOTORS</span>
                  </span>
                </Link>

                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      handleNavigation(item.href);
                      const closeButton = document.querySelector('[data-radix-collection-item]');
                      (closeButton as HTMLElement)?.click();
                    }}
                    className="text-luxury-700 hover:text-luxury-900 transition-colors text-center"
                  >
                    {item.label}
                  </button>
                ))}
                <Link
                  to="/compare"
                  className="text-luxury-700 hover:text-luxury-900 transition-colors text-center"
                >
                  Compare
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
