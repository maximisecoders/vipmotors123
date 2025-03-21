import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchSection from "@/components/SearchSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Plus, Facebook, Twitter, Linkedin, Link, Calendar, PaintBucket, Gauge, MapPin, ArrowRightLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Car } from "@/types/car";
import formatCurrency from '@/utils/currencyFormatter';
import Pagination from "@/components/Pagination";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const InventoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [currency, setCurrency] = useState<"USD" | "AED" | "EUR">("AED");
  const [filter, setFilter] = useState<"all" | "available" | "sold">("all");
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 12;
  
  const currencySymbols = {
    USD: "$",
    AED: "AED",
    EUR: "€"
  };

  const [filters, setFilters] = useState({
    make: searchParams.get('make') || '',
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        let query = supabase
          .from('cars')
          .select('*')
          .order('created_at', { ascending: false });

        if (filters.make) {
          query = query.ilike('make', filters.make);
        }

        const { data, error } = await query;

        if (error) throw error;
        setCars(data || []);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError('Failed to load cars');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [filters]);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      make: searchParams.get('make') || ''
    }));
  }, [searchParams]);

  const renderActiveBrand = () => {
    if (!filters.make) return null;
    
    return (
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
          <span className="text-sm text-gray-600">Brand: {filters.make}</span>
          <button
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('make');
              navigate(`/inventory?${newParams.toString()}`);
            }}
            className="hover:text-red-600"
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!cars.length) return;
    
    let filtered = [...cars];
    
    const keyword = searchParams.get("keyword")?.toLowerCase();
    const make = searchParams.get("make")?.toLowerCase();
    const model = searchParams.get("model")?.toLowerCase();
    const year = searchParams.get("year");
    const price = searchParams.get("price");
    const mileage = searchParams.get("mileage");

    if (keyword) {
      filtered = filtered.filter(car => 
        car.name.toLowerCase().includes(keyword) ||
        car.type.toLowerCase().includes(keyword) ||
        car.engine.toLowerCase().includes(keyword)
      );
    }

    if (make) {
      filtered = filtered.filter(car => 
        car.make.toLowerCase().includes(make)
      );
    }

    if (model) {
      filtered = filtered.filter(car => 
        car.type.toLowerCase().includes(model)
      );
    }

    if (year) {
      filtered = filtered.filter(car => 
        car.year.toString() === year
      );
    }

    if (price) {
      const priceLimit = parseInt(price.replace(/\D/g, '')) * 1000;
      filtered = filtered.filter(car => 
        car.price_usd <= priceLimit
      );
    }

    if (mileage) {
      const [min, max] = mileage.split('-').map(v => parseInt(v) || 0);
      filtered = filtered.filter(car => {
        const carMileage = parseInt(car.mileage);
        if (mileage.includes('+')) {
          return carMileage >= min;
        }
        return carMileage >= min && carMileage <= max;
      });
    }

    if (filter !== "all") {
      filtered = filtered.filter(car => 
        filter === "available" ? car.status === "Available" : car.status === "Sold"
      );
    }

    setFilteredCars(filtered);
  }, [searchParams, filter, cars]);

  const formatPrice = (car: Car) => {
    if (!car) return 'Price on Request';
    
    const prices = {
      USD: car.price_usd,
      AED: car.price_usd ? car.price_usd * 3.67 : null,
      EUR: car.price_usd ? car.price_usd * 0.91 : null
    };

    if (!prices[currency] || car.status === 'Sold') {
      return 'Price on Request';
    }

    return `${currencySymbols[currency]} ${prices[currency].toLocaleString('en-US')}`;
  };

  const handleShare = (car: Car, platform: string) => {
    const shareUrl = window.location.href;
    const text = `Check out this ${car.year} ${car.name} at ${formatPrice(car)}!`;
    
    let shareLink = '';
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "The car link has been copied to your clipboard.",
        });
        return;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  const handleCompare = (car: Car) => {
    const carsToCompare = JSON.parse(localStorage.getItem("carsToCompare") || "[]");
    if (carsToCompare.length >= 10) {
      toast({
        title: "Compare limit reached",
        description: "You can only compare up to 10 cars at a time.",
        variant: "destructive",
      });
      return;
    }
    
    if (carsToCompare.some((c: typeof car) => c.id === car.id)) {
      toast({
        title: "Car already added",
        description: "This car is already in your comparison list.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedCars = [...carsToCompare, car];
    localStorage.setItem("carsToCompare", JSON.stringify(updatedCars));
    
    toast({
      title: "Car added to compare",
      description: `${updatedCars.length === 1 ? 'Add one more car to start comparing' : 'Navigate to the compare page to view your selection.'}`,
    });
    
    if (updatedCars.length >= 2) {
      navigate("/compare");
    }
  };

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        duration: 0.5
      }
    }
  };

  useEffect(() => {
    if (location.state?.restoreScroll) {
      // Restore pagination
      if (location.state.page) {
        setCurrentPage(location.state.page);
      }
      // Restore filter
      if (location.state.filter) {
        setFilter(location.state.filter);
      }
      // Restore currency
      if (location.state.currency) {
        setCurrency(location.state.currency);
      }
      // Restore scroll position after a short delay to ensure content is rendered
      setTimeout(() => {
        window.scrollTo(0, location.state.scrollPosition || 0);
      }, 100);
    }
    
    navigate(location.pathname + location.search, {
      state: {
        from: location.pathname + location.search,
        page: currentPage,
        filter,
        currency,
        scrollPosition: window.scrollY
      }
    });
  }, [location.state]);
if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-2xl">Loading...</div>
    </div>
  );
}

if (error) {
    return (
      <motion.div 
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-2xl text-red-500">{error}</div>
      </motion.div>
    );
  }

const handleCardClick = (carId: number) => {
  navigate(`/inventory/${carId}`, {
    state: { from: `${location.pathname}${location.search}` }
  });
};

const renderCarGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {currentCars.map((car) => (
        <motion.div
          key={car.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -8 }}
        >
          <Card 
            className="flex-shrink-0 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
            onClick={() => handleCardClick(car.id)}
          >
            <div className="p-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem onClick={() => handleShare(car, 'facebook')}>
                        <Facebook className="h-4 w-4 mr-2" /> Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(car, 'twitter')}>
                        <Twitter className="h-4 w-4 mr-2" /> Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(car, 'linkedin')}>
                        <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(car, 'copy')}>
                        <Link className="h-4 w-4 mr-2" /> Copy Link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    car.status === "Available" ? "bg-green-500" : "bg-red-500"
                  } text-white`}>
                    {car.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 text-center">
                {car.name}
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{car.year}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <PaintBucket className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{car.color}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{car.mileage} km</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{car.location}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="h-[1px] w-full bg-gray-200 mb-2" /> {/* Added horizontal bar */}
                  <div className="flex justify-center items-center gap-2 text-sm font-medium">
                    <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                    {car.engine}
                  </div>
                  <div className="h-[1px] w-full bg-gray-200 mt-2" /> {/* Added horizontal bar */}
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center">
                    <div className="bg-white shadow-md rounded-full px-4 py-2">
                      <span className="font-bold text-red-600">
                        {formatPrice(car)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full shadow-md bg-white hover:bg-white border-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompare(car);
                      }}
                    >
                      <ArrowRightLeft className="w-4 h-4 mr-1" />
                      Compare
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <motion.div 
        className="relative pt-40 pb-24 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-center text-white mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore the Inventory
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-200 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover our exclusive collection of luxury and exotic vehicles
          </motion.p>
        </div>
      </motion.div>

      <ScrollReveal>
        <SearchSection />
      </ScrollReveal>

      <div className="container mx-auto px-4 py-8">
        {renderActiveBrand()}
        
        <motion.div 
          className="flex flex-wrap justify-between items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex gap-2">
            {(["all", "available", "sold"] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            {(["USD", "AED", "EUR"] as const).map((curr) => (
              <Button
                key={curr}
                variant={currency === curr ? "default" : "outline"}
                onClick={() => setCurrency(curr)}
                className="w-20"
              >
                {curr}
              </Button>
            ))}
          </div>
        </motion.div>

        {renderCarGrid()}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8"
        >
          <Pagination
            carsPerPage={carsPerPage}
            totalCars={filteredCars.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default InventoryPage;