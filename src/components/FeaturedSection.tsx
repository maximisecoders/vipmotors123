import { useState } from "react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { getStorageUrl } from "@/lib/supabase";
import Pagination from "./Pagination";
import formatCurrency from '@/utils/currencyFormatter';

const FeaturedSection = ({ featuredCars }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const carsPerPage = 12;

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = featuredCars.slice(indexOfFirstCar, indexOfLastCar);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Vehicles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentCars.map(car => (
            <Card
              key={car.id}
              className="group cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
              onClick={() => navigate(`/car/${car.id}`)}
            >
              <div className="p-4">
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-4">
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
                  <h3 className="font-bold text-lg text-gray-900">{car.name}</h3>
                  {car.status !== 'Sold' && car.price_usd !== null ? (
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-red-600">
                        {formatCurrency.USD(car.price_usd)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency.AED(car.price_usd)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-red-600 font-semibold">
                      {car.status === 'Sold' ? 'Sold' : 'Price on Request'}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    {car.year} • {car.mileage} km
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-12">
          <Pagination
            carsPerPage={carsPerPage}
            totalCars={featuredCars.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
