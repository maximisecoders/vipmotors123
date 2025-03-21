import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminCarDetailsProps {
  car: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const AdminCarDetails = ({ car, isOpen, onClose, onUpdate }: AdminCarDetailsProps) => {
  const [formData, setFormData] = useState({
    name: car?.name || "",
    make: car?.make || "",
    type: car?.type || "",
    year: car?.year || "",
    price_usd: car?.price_usd || "",
    mileage: car?.mileage || "",
    engine: car?.engine || "",
    color: car?.color || "",
    location: car?.location || "",
    status: car?.status || "Available",
    transmission: car?.transmission || "",
    fuel_type: car?.fuel_type || "",
    body_type: car?.body_type || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('cars')
        .update(formData)
        .eq('id', car.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Car details updated successfully",
      });
      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white/90 lg:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Car Details</DialogTitle>
          
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label>Car Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label>Make</Label>
                <Input
                  value={formData.make}
                  onChange={(e) => handleChange("make", e.target.value)}
                />
              </div>
              <div>
                <Label>Model</Label>
                <Input
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleChange("year", e.target.value)}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div>
                <Label>Price (USD)</Label>
                <Input
                  type="number"
                  value={formData.price_usd}
                  onChange={(e) => handleChange("price_usd", e.target.value)}
                />
              </div>
              <div>
                <Label>Mileage (km)</Label>
                <Input
                  value={formData.mileage}
                  onChange={(e) => handleChange("mileage", e.target.value)}
                />
              </div>
              <div>
                <Label>Engine</Label>
                <Input
                  value={formData.engine}
                  onChange={(e) => handleChange("engine", e.target.value)}
                />
              </div>
              <div>
                <Label>Color</Label>
                <Input
                  value={formData.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                />
              </div>
            </div>

            {/* Additional Specifications */}
            <div className="space-y-4">
              <div>
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
              <div>
                <Label>Transmission</Label>
                <Input
                  value={formData.transmission}
                  onChange={(e) => handleChange("transmission", e.target.value)}
                />
              </div>
              <div>
                <Label>Fuel Type</Label>
                <Input
                  value={formData.fuel_type}
                  onChange={(e) => handleChange("fuel_type", e.target.value)}
                />
              </div>
              <div>
                <Label>Body Type</Label>
                <Input
                  value={formData.body_type}
                  onChange={(e) => handleChange("body_type", e.target.value)}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger className="bg-white p-2 rounded-xl">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white p-2 rounded-xl">
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCarDetails;
