import { useState } from "react";
import { getStorageUrl } from "@/lib/supabase";
import formatCurrency from '@/utils/currencyFormatter';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Calendar, Gauge, MapPin, PaintBucket, ArrowRightLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NewArrival = ({ newCars }) => {
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const visibleCars = 4;

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStartIndex((prev) => Math.min(newCars.length - visibleCars, prev + 1));
  };

  const handleAddToCompare = (e: React.MouseEvent, carId: string) => {
    e.stopPropagation();
    // Add compare functionality here
    console.log('Add to compare:', carId);
  };

  return (
    <div className="relative py-12 bg-luxury-50">
      <div className="container mx-auto px-4">
        <div className="relative">
          <Button
            variant="secondary"
            size="icon"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg hover:bg-white"
            onClick={handlePrevious}
            disabled={startIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg hover:bg-white"
            onClick={handleNext}
            disabled={startIndex >= newCars.length - visibleCars}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="flex gap-6 overflow-hidden px-4">
            {newCars.slice(startIndex, startIndex + visibleCars).map((car) => (
              <Card 
                key={car.id}
                className="flex-shrink-0 w-[350px] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
                onClick={() => navigate(`/inventory/${car.id}`)}
              >
                {/* Image Section with 3D effect */}
                <div className="p-4">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    <img
                      src={car.image ? car.image : getStorageUrl(car.folder_path)}
                      alt={car.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </div>

                {/* Car Details Section */}
                <div className="p-4 space-y-4">
                  {/* Car Name */}
                  <h3 className="text-xl font-semibold text-gray-800 text-center">
                    {car.name}
                  </h3>

                  {/* Details Grid */}
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

                    {/* Engine Section */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-center items-center gap-2 text-sm font-medium">
                        <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                        {car.engine}
                      </div>
                    </div>

                    {/* Price and Compare Section */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="bg-white shadow-md rounded-full px-4 py-2 border border-gray-200">
                          <span className="font-bold text-red-600">
                            {formatCurrency.AED(car.price_usd)}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={(e) => handleAddToCompare(e, car.id)}
                        >
                          <ArrowRightLeft className="w-4 h-4 mr-1" />
                          Compare
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrival;
