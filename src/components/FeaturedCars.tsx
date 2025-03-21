import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { supabase } from "@/lib/supabase";
import type { Car } from "@/types/car";
import { useNavigate, useLocation } from "react-router-dom";
import { getStorageUrl } from "@/lib/supabase";
import Pagination from "./Pagination";
import formatCurrency from '@/utils/currencyFormatter';
import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const FeaturedCars = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 12;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        console.log('Fetching featured cars...');
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('status', 'Available') // Only fetch available cars
          .order('price_usd', { ascending: false })
          .limit(6);

        console.log('Fetched data:', data);
        console.log('Error:', error);

        if (error) throw error;

        if (data) {
          setFeaturedCars(data);
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  const formatPrice = (price: number) => {
    return `$ ${price.toLocaleString()}`;
  };

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = featuredCars.slice(indexOfFirstCar, indexOfLastCar);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleCardClick = (carId: number) => {
    navigate(`/inventory/${carId}`, {
      state: { from: location.pathname }
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
            className="overflow-hidden rounded-[28px] hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white shadow-lg"
            onClick={() => handleCardClick(car.id)}
          >
            <div className="p-4">
              <div className="relative aspect-[16/10] rounded-[20px] overflow-hidden mb-4 shadow-md">
                <img
                  src={car.image ? car.image : getStorageUrl(car.folder_path)}
                  alt={car.name}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {car.name}
                </h3>
                
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );

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
    <section id="cars" className="py-20 bg-luxury-50">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Premium Selection</h2>
            <p className="text-luxury-600 max-w-2xl mx-auto">
              Discover our handpicked collection of the world's finest automobiles
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          {renderCarGrid()}
        </ScrollReveal>
        <Pagination
          carsPerPage={carsPerPage}
          totalCars={featuredCars.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </section>
  );
};

export default FeaturedCars;
