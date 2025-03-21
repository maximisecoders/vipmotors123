import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface Car {
  id: number;
  name: string;
  price: {
    USD: number;
    AED: number;
    EUR: number;
  };
  year: number;
  image: string;
  mileage: string;
  location: string;
  type: string;
  engine: string;
  color: string;
  status: string;
  transmission: string;
  bodyType: string;
  fuelType: string;
  horsepower: number;
  warranty: string;
  specs: string;
}

const ComparePage = () => {
  const navigate = useNavigate();
  const carsToCompare = JSON.parse(localStorage.getItem("carsToCompare") || "[]") as Car[];
  
  const [carImages, setCarImages] = useState<{ [key: number]: string[] }>(() => {
    const images: { [key: number]: string[] } = {};
    carsToCompare.forEach(car => {
      const imageUrls = [car.image];
      images[car.id] = imageUrls;
    });
    return images;
  });
  
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (carsToCompare.length === 1) {
      toast({
        title: "Add one more car",
        description: "You need at least 2 cars to compare.",
        variant: "destructive",
      });
    }
  }, [carsToCompare.length]);

  const removeCar = (carId: number) => {
    const updatedCars = carsToCompare.filter(car => car.id !== carId);
    localStorage.setItem("carsToCompare", JSON.stringify(updatedCars));
    window.location.reload();
  };

  const formatSpecification = (label: string, value: string | number | React.ReactNode | undefined) => {
    if (!value) return null;
    return (
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-sm text-gray-800">{value}</p>
      </div>
    );
  };

  const nextImage = (carId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const maxImages = carImages[carId]?.length || 1;
    if (maxImages <= 1) return;

    setCurrentImageIndexes(prev => ({
      ...prev,
      [carId]: ((prev[carId] || 0) + 1) % maxImages
    }));
  };

  const prevImage = (carId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const maxImages = carImages[carId]?.length || 1;
    if (maxImages <= 1) return;

    setCurrentImageIndexes(prev => ({
      ...prev,
      [carId]: ((prev[carId] || 0) - 1 + maxImages) % maxImages
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar forceLight />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Compare Vehicles</h1>
          <p className="text-gray-600">
            {carsToCompare.length} of 10 vehicles selected
          </p>
        </div>

        {carsToCompare.length < 2 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800">
              Please select at least 2 vehicles to compare. You can add up to 10 vehicles.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {carsToCompare.map((car) => (
            <Card 
              key={car.id} 
              className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
            >
              <button
                onClick={() => removeCar(car.id)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors z-10 shadow-md"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>

              <div className="p-5">
                <div className="relative group mb-6">
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={carImages[car.id]?.[currentImageIndexes[car.id] || 0] || car.image}
                      alt={car.name}
                      className="w-full h-[280px] object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {(carImages[car.id]?.length || 0) > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
                        onClick={(e) => prevImage(car.id, e)}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
                        onClick={(e) => nextImage(car.id, e)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-semibold mb-6 text-gray-800">{car.name}</h3>
                
                <div className="space-y-6">
                  {/* Key Specifications */}
                  <div className="bg-gray-50/50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-3">Key Specifications</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {formatSpecification("Year", car.year)}
                      {formatSpecification("Engine", car.engine)}
                      {formatSpecification("Mileage", car.mileage ? `${car.mileage} km` : undefined)}
                      {formatSpecification("Color", car.color)}
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="bg-gray-50/50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-3">Performance</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {formatSpecification("Body Type", car.bodyType)}
                      {formatSpecification("Fuel Type", car.fuelType)}
                      {formatSpecification("Transmission", car.transmission)}
                      {formatSpecification("Horsepower", car.horsepower ? `${car.horsepower} HP` : undefined)}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-gray-50/50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-3">Additional Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {formatSpecification("Location", car.location)}
                      {formatSpecification("Status", 
                        <span className={`${
                          car.status === 'Sold' ? 'text-red-500' : 'text-green-500'
                        } font-medium`}>
                          {car.status}
                        </span>
                      )}
                      {formatSpecification("Warranty", car.warranty)}
                      {formatSpecification("Specs", car.specs)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {carsToCompare.length < 10 && (
            <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                <Button
                  variant="outline"
                  className="w-full max-w-xs bg-white/90 hover:bg-white/95 transition-colors shadow-md"
                  onClick={() => navigate("/inventory")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle to Compare
                </Button>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  {carsToCompare.length === 0
                    ? "Select 2-10 vehicles to compare"
                    : `${10 - carsToCompare.length} more vehicles can be added`}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ComparePage;
