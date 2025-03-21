import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  BarChart2,
  Mail,
  Share2,
  Check,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase, getStorageUrl, getEngineSoundUrl } from "@/lib/supabase";
import type { Car } from "@/types/car";
import Navbar from "@/components/Navbar";
import formatCurrency from '@/utils/currencyFormatter';
import CarEnquiryModal from "@/components/CarEnquiryModal";
import ImageGalleryModal from "@/components/ImageGalleryModal";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const carId = Number(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isInCompare, setIsInCompare] = useState(false);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [currency, setCurrency] = useState<"USD" | "AED" | "EUR">("AED");
  const [previousPath, setPreviousPath] = useState<string>("/inventory");
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const { data: car, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (car) {
          const mainImage = car.image.startsWith('http') 
            ? car.image 
            : getStorageUrl(`${car.folder_path}/1.jpg`);
          
          const additionalImages = car.images?.map((img: string, index: number) => 
            img.startsWith('http') 
              ? img 
              : getStorageUrl(`${car.folder_path}/${index + 2}.jpg`)
          ) || [];

          setCar({
            ...car,
            image: mainImage,
            images: [mainImage, ...additionalImages]
          });
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  useEffect(() => {
    const carsToCompare = JSON.parse(localStorage.getItem("carsToCompare") || "[]");
    setIsInCompare(carsToCompare.some((c: Car) => c.id === carId));
  }, [carId]);

  useEffect(() => {
    const referrer = document.referrer;
    if (referrer.includes(window.location.origin)) {
      const path = referrer.split(window.location.origin)[1];
      if (path) {
        setPreviousPath(path);
      }
    }
  }, []);

  const handleCompare = () => {
    const carsToCompare = JSON.parse(localStorage.getItem("carsToCompare") || "[]");
    
    if (isInCompare) {
      const updatedCars = carsToCompare.filter((c: Car) => c.id !== carId);
      localStorage.setItem("carsToCompare", JSON.stringify(updatedCars));
      setIsInCompare(false);
      
      toast({
        title: "Car removed from compare",
        description: "The car has been removed from your comparison list.",
      });
    } else {
      if (carsToCompare.length >= 10) {
        toast({
          title: "Compare limit reached",
          description: "You can only compare up to 10 cars at a time.",
          variant: "destructive",
        });
        return;
      }
      
      const updatedCars = [...carsToCompare, car];
      localStorage.setItem("carsToCompare", JSON.stringify(updatedCars));
      setIsInCompare(true);
      
      toast({
        title: "Car added to compare",
        description: `${updatedCars.length === 1 ? 'Add one more car to start comparing' : 'Navigate to the compare page to view your selection.'}`,
      });
      
      if (updatedCars.length >= 2) {
        navigate("/compare");
      }
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? car?.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === car?.images.length - 1 ? 0 : prev + 1));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: car?.name,
        url: window.location.href,
      });
    }
  };

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from, {
        replace: true,
        state: {
          restoreScroll: true,
          scrollPosition: location.state.scrollPosition,
          page: location.state.page,
          filter: location.state.filter,
          currency: location.state.currency
        }
      });
    } else {
      navigate('/inventory');
    }
  };

  const formatPrice = (car: Car | null) => {
    if (!car) return '';
    if (car.status === 'Sold') return 'Sold';
    if (!car.price_usd) return 'Price on Request';

    const currencySymbols = {
      USD: "$",
      AED: "AED",
      EUR: "€"
    };

    const prices = {
      USD: car.price_usd,
      AED: car.price_usd * 3.67,
      EUR: car.price_usd * 0.91
    };

    try {
      return `${currencySymbols[currency]} ${prices[currency].toLocaleString('en-US')}`;
    } catch (error) {
      console.error('Price formatting error:', error);
      return 'Price on Request';
    }
  };

  const PriceButton = () => (
    <Button
      variant="outline"
      onClick={() => setCurrency(currency === "USD" ? "AED" : currency === "AED" ? "EUR" : "USD")}
      className="flex items-center gap-2"
    >
      <span className="font-bold text-luxury-800">
        {formatPrice(car)}
      </span>
    </Button>
  );

  const handleContactSeller = () => {
    setIsEnquiryModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar forceLight />
        <div className="container mx-auto px-4 py-20 text-center">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar forceLight />
        <div className="container mx-auto px-4 py-20 text-center text-red-500">
          {error || 'Car not found'}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Blur */}
      {car && (
        <div 
          className="fixed inset-0 w-full h-full z-0"
          style={{
            backgroundImage: `url(${car.images[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            opacity: '0.4'
          }}
        />
      )}

      <Navbar forceLight />
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-32">
        {/* Back Button and Title Row */}
        <div className="flex items-center justify-between mb-16">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="backdrop-blur-sm shadow-lg shadow-black/20 border-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-center flex-1 px-3">{car?.name}</h1>
          <div className="w-[100px]"></div> {/* Spacer for alignment */}
        </div>

        {/* Car Images Section */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden p-6">
            {/* Main Image with Navigation */}
            <div className="flex items-center gap-6 mb-6">
              {/* Left Button */}
              {car.images && car.images.length > 1 && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="flex-none w-12 h-12 bg-white/80 hover:bg-white rounded-full"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}

              {/* Main Image */}
              <div 
                className="flex-1 aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer"
                onClick={() => setIsGalleryOpen(true)}
              >
                {car.images && car.images.length > 0 && (
                  <img
                    src={car.images[currentImageIndex]}
                    alt={car.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>

              {/* Right Button */}
              {car.images && car.images.length > 1 && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="flex-none w-12 h-12 bg-white/80 hover:bg-white rounded-full"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}
            </div>
            
            {/* Thumbnails */}
            {car?.images && car.images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 bg-white/50 p-4 rounded-2xl">
                {car.images.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-[16/10] rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105 shadow-[0_4px_15px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${
                      currentImageIndex === index ? 'ring-2 ring-red-600' : ''
                    }`}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsGalleryOpen(true);
                    }}
                  >
                    <img
                      src={image}
                      alt={`${car.name} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Car Details Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            {/* Price and Actions */}
            <div className="flex justify-between items-start mb-8">
              <Button
                variant="ghost"
                disableHover
                className="price-button shadow-lg shadow-black/20"
                onClick={() => setCurrency(currency === "USD" ? "AED" : currency === "AED" ? "EUR" : "USD")}
              >
                <span className="font-bold">
                  {formatPrice(car)}
                </span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleShare}
                className="bg-white/10 backdrop-blur-sm shadow-lg shadow-black/20 hover:bg-white/20 border-0"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Specifications</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">Make:</span>
                  <span>{car.make}</span>
                  <span className="text-gray-600">Model:</span>
                  <span>{car.type}</span>
                  <span className="text-gray-600">Year:</span>
                  <span>{car.year}</span>
                  <span className="text-gray-600">Mileage:</span>
                  <span>{car.mileage} km</span>
                  <span className="text-gray-600">Engine:</span>
                  <span>{car.engine}</span>
                  <span className="text-gray-600">Color:</span>
                  <span>{car.color}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Additional Info</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">Body:</span>
                  <span>{car.body_type}</span>
                  <span className="text-gray-600">Transmission:</span>
                  <span>{car.transmission}</span>
                  <span className="text-gray-600">Fuel Type:</span>
                  <span>{car.fuel_type}</span>
                  <span className="text-gray-600">Location:</span>
                  <span>{car.location}</span>
                  <span className="text-gray-600">Status:</span>
                  <span className={car.status === 'Sold' ? 'text-red-600 font-semibold' : 'text-green-600'}>
                    {car.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1" onClick={handleContactSeller}>
                <Phone className="mr-2 h-4 w-4" />
                Contact Seller
              </Button>
              <Button 
                variant="ghost" 
                className="flex-1 bg-white/10 text-gray-900 backdrop-blur-sm shadow-lg shadow-black/20 hover:bg-white/20 border-0"
                onClick={handleCompare}
              >
                {isInCompare ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    In Compare
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Compare
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <CarEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        carDetails={car}
      />
      {car?.images && (
        <ImageGalleryModal
            images={car.images}
            currentIndex={currentImageIndex}
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
            onPrevious={handlePrevImage}
            onNext={handleNextImage}
            onIndexChange={setCurrentImageIndex}
          />
      )}
      <Footer />
    </div>
  );
};

export default CarDetails;
