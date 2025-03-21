import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import AdminCarDetails from "./AdminCarDetails";
import AddCarModal from "./AddCarModal";

const AdminCars = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching cars",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Car deleted",
        description: "The car has been deleted successfully.",
      });
      
      fetchCars();
    } catch (error: any) {
      toast({
        title: "Error deleting car",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCardClick = (car: any) => {
    setSelectedCar(car);
    setIsDetailsOpen(true);
  };

  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.make.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold ">Manage Cars</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Car
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search cars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">Loading...</div>
        ) : filteredCars.length === 0 ? (
          <div className="col-span-full text-center py-8">No cars found</div>
        ) : (
          filteredCars.map((car) => (
            <Card
              key={car.id}
              className="overflow-hidden hover:shadow-lg transition-all rounded-2xl duration-300 cursor-pointer"
              onClick={() => handleCardClick(car)}
            >
              <div className="p-4">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-3">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-sm truncate">{car.name}</h3>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {selectedCar && (
        <AdminCarDetails
          car={selectedCar}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedCar(null);
          }}
          onUpdate={fetchCars}
        />
      )}

      <AddCarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchCars}
      />
    </div>
  );
};

export default AdminCars;
