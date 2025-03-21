import { useEffect, useState, useRef, TouchEvent } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, Gauge, MapPin, PaintBucket, ArrowRightLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Car } from "@/types/car";
import { useNavigate, useLocation } from "react-router-dom";
import { getStorageUrl } from "@/lib/supabase";
import Pagination from "./Pagination";
import formatCurrency from '@/utils/currencyFormatter';
import { toast } from "./ui/use-toast";
import ScrollReveal from "./ScrollReveal";

const RecentCars = () => {
  const [recentCars, setRecentCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCars, setVisibleCars] = useState(3);
  const carsPerPage = 12;
  const navigate = useNavigate();
  const location = useLocation();
  const [slideClicks, setSlideClicks] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const fetchRecentCars = async () => {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(9); // Limit to 9 cars total

        if (error) throw error;

        if (data) {
          setRecentCars(data);
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentCars();
  }, []);

  useEffect(() => {
    const updateVisibleCars = () => {
      if (window.innerWidth < 640) setVisibleCars(1);      // mobile
      else if (window.innerWidth < 1024) setVisibleCars(2); // tablet
      else setVisibleCars(3);                              // desktop
      
      // Reset position and clicks when screen size changes
      setCurrentIndex(0);
      setSlideClicks(0);
    };

    updateVisibleCars();
    window.addEventListener('resize', updateVisibleCars);
    return () => window.removeEventListener('resize', updateVisibleCars);
  }, []);

  // Safe price formatting with null checks
  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return 'Price on Request';
    return formatCurrency.USD(price) || 'Price on Request';
  };

  const getMaxSlideClicks = () => {
    const totalCars = recentCars.length; // 9 cars total
    if (window.innerWidth < 640) return totalCars - 1; // mobile: 8 clicks (9 cards - 1)
    if (window.innerWidth < 1024) return Math.ceil((totalCars - 2) / 2); // tablet: 4 clicks
    return Math.ceil((totalCars - 3) / 3); // desktop: 2 clicks
  };

  const handleSlide = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentIndex(prev => Math.max(0, prev - 1));
      setSlideClicks(prev => prev - 1);
    } else {
      setCurrentIndex(prev => Math.min(recentCars.length - visibleCars, prev + 1));
      setSlideClicks(prev => prev + 1);
    }
  };

  const handleAddToCompare = (e: React.MouseEvent, car: Car) => {
    e.stopPropagation();
    
    // Get existing cars from localStorage
    const existingCars = JSON.parse(localStorage.getItem("carsToCompare") || "[]");
    
    // Check if car is already in compare list
    if (existingCars.some((c: Car) => c.id === car.id)) {
      toast({
        title: "Already added",
        description: "This car is already in your compare list",
        variant: "destructive",
      });
      return;
    }

    // Check if compare limit is reached
    if (existingCars.length >= 10) {
      toast({
        title: "Compare limit reached",
        description: "You can compare up to 10 cars at a time",
        variant: "destructive",
      });
      return;
    }

    // Add car to compare list
    const updatedCars = [...existingCars, car];
    localStorage.setItem("carsToCompare", JSON.stringify(updatedCars));

    toast({
      title: "Car added to compare",
      description: `${car.name} has been added to your compare list`,
    });
  };

  // Add touch handlers
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0 && slideClicks < getMaxSlideClicks()) {
      // Swiped left
      handleSlide('right');
    } else if (distance < 0 && currentIndex > 0) {
      // Swiped right
      handleSlide('left');
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleCardClick = (carId: number) => {
    navigate(`/inventory/${carId}`, {
      state: { from: location.pathname }
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-luxury-50">
        <div className="container mx-auto px-4 text-center">
          Loading...
        </div>
      </section>
    
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-luxury-50">
        <div className="container mx-auto px-4 text-center text-red-500">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section id="recent-cars" className="py-12 sm:py-16 md:py-20 bg-luxury-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">
              Recently Added Vehicles
            </h2>
            <p className="text-luxury-600 max-w-2xl mx-auto text-sm sm:text-base">
              Explore our newest additions to the collection
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex absolute -left-2 sm:-left-4 lg:-left-8 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-8 h-8 sm:w-10 sm:h-10 hover:bg-white"
              onClick={() => handleSlide('left')}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div 
              className="overflow-hidden px-1 sm:px-2"
              ref={sliderRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex gap-3 sm:gap-4 lg:gap-6 transition-transform duration-300 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentIndex * (100 / visibleCars)}%)`,
                  width: `${(100 * recentCars.length) / visibleCars}%`
                }}
              >
                {recentCars.map((car) => (
                  <div 
                    key={car.id} 
                    className="w-full px-1 sm:px-2 transition-transform duration-300 p-2 hover:-translate-y-2"
                    style={{ width: `${100 / visibleCars}%` }}
                  >
                    <Card 
                      className="rounded-[28px] overflow-hidden p-2 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white h-full transform hover:scale-[1.02]"
                      onClick={() => handleCardClick(car.id)}
                    >
                      <div className="p-3 sm:p-4">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                          <img
                            src={car.image ? car.image : getStorageUrl(car.folder_path)}
                            alt={car.name}
                            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        </div>

                        <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 text-center line-clamp-2">
                            {car.name}
                          </h3>

                          <div className="space-y-2 sm:space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-600" />
                                <span className="text-sm">{car.year}</span>
                              </div>
                              <div className="flex items-center gap-2 justify-end">
                                <PaintBucket className="w-4 h-4 text-gray-600" />
                                <span className="text-sm">{car.color || 'N/A'}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <Gauge className="w-4 h-4 text-gray-600" />
                                <span className="text-sm">{car.mileage} km</span>
                              </div>
                              <div className="flex items-center gap-2 justify-end">
                                <MapPin className="w-4 h-4 text-gray-600" />
                                <span className="text-sm">{car.location || 'N/A'}</span>
                              </div>
                            </div>

                            <div className="pt-2">
                              <div className="h-[1px] w-full bg-gray-200 mb-2" /> {/* Added horizontal bar */}
                              <div className="flex justify-center items-center gap-2 text-sm font-medium">
                                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                </svg>
                                {car.engine || 'N/A'}
                              </div>
                              <div className="h-[1px] w-full bg-gray-200 mt-2" /> {/* Added horizontal bar */}
                            </div>

                            <div className="pt-2 border-t border-gray-200">
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center">
                                <div className="w-full sm:w-auto bg-white shadow-md rounded-full px-3 sm:px-4 py-2 border border-gray-200">
                                  <span className="font-bold text-red-600 text-sm sm:text-base">
                                    {formatCurrency.AED(car.price_usd)}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-full shadow-md bg-white hover:bg-white"
                                  onClick={(e) => handleAddToCompare(e, car)}
                                >
                                  <ArrowRightLeft className="w-4 h-4 mr-1" />
                                  Compare
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex absolute -right-2 sm:-right-4 lg:-right-8 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-8 h-8 sm:w-10 sm:h-10 hover:bg-white"
              onClick={() => handleSlide('right')}
              disabled={slideClicks >= getMaxSlideClicks()}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default RecentCars;
