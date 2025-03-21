import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { supabaseAdmin } from "@/lib/supabase"; // Change this import
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

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddCarModal = ({ isOpen, onClose, onSuccess }: AddCarModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    make: "",
    type: "",
    year: "",
    price_aed: "",
    mileage: "",
    engine: "",
    color: "",
    location: "",
    status: "Available",
    transmission: "",
    fuel_type: "",
    body_type: "",
    specs: "",
    warranty: "",
    doors: "",
    cylinders: "",
    horsepower: "",
  });

  const [images, setImages] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadImages = async (carName: string) => {
    if (!images) return null;

    try {
      const timestamp = Date.now();
      const folderPath = `${carName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`;
      const uploadedUrls = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const filePath = `${folderPath}/${i + 1}.jpg`;

        // Upload image
        const { error: uploadError } = await supabaseAdmin.storage
          .from('carimages')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('carimages')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      return {
        folder_path: folderPath,
        image: uploadedUrls[0],
        images: uploadedUrls.slice(1)
      };
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageData = null;

    try {
      setUploading(true);

      if (!images?.length) {
        throw new Error("Please select at least one image");
      }

      // Upload images first
      imageData = await uploadImages(formData.name);
      if (!imageData) throw new Error("Failed to upload images");

      // Convert AED to USD and EUR
      const priceAed = parseFloat(formData.price_aed);
      const priceUsd = priceAed / 3.67; // AED to USD conversion
      const priceEur = priceUsd * 0.91; // USD to EUR conversion

      // Prepare car data with string types for numeric fields
      const carData = {
        name: formData.name.trim(),
        make: formData.make.trim(),
        type: formData.type.trim(),
        year: parseInt(formData.year),
        price_aed: parseFloat(formData.price_aed),
        price_usd: priceUsd,
        price_eur: priceEur,
        mileage: formData.mileage, // Keep as string
        engine: formData.engine.trim(),
        color: formData.color.trim(),
        location: formData.location.trim(),
        status: formData.status,
        transmission: formData.transmission.trim(),
        fuel_type: formData.fuel_type.trim(),
        body_type: formData.body_type.trim(),
        specs: formData.specs.trim(),
        warranty: formData.warranty.trim(),
        doors: parseInt(formData.doors) || null,
        cylinders: formData.cylinders, // Keep as string
        horsepower: formData.horsepower, // Keep as string
        folder_path: imageData.folder_path,
        image: imageData.image,
        images: imageData.images,
        created_at: new Date().toISOString()
      };

      // Insert car data
      const { error: insertError } = await supabaseAdmin
        .from('cars')
        .insert([carData]);

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Car added successfully",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

      // Clean up uploaded images if car insertion fails
      if (imageData?.folder_path) {
        try {
          await supabaseAdmin.storage
            .from('carimages')
            .remove([`${imageData.folder_path}/*`]);
        } catch (cleanupError) {
          console.error('Failed to clean up images:', cleanupError);
        }
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/95 backdrop-blur-sm max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl lg:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Car</DialogTitle>
          
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Basic Information</h3>
              <div>
                <Label>Car Name</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g., Ferrari 488 GTB"
                />
              </div>
              <div>
                <Label>Make</Label>
                <Input
                  required
                  value={formData.make}
                  onChange={(e) => handleChange("make", e.target.value)}
                  placeholder="e.g., Ferrari"
                />
              </div>
              <div>
                <Label>Model</Label>
                <Input
                  required
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  placeholder="e.g., 488 GTB"
                />
              </div>
            </div>

            {/* Price and Year */}
            <div className="space-y-4">
              <h3 className="font-semibold">Price and Details</h3>
              <div>
                <Label>Price (AED)</Label>
                <Input
                  type="number"
                  required
                  value={formData.price_aed}
                  onChange={(e) => handleChange("price_aed", e.target.value)}
                  placeholder="Enter price in AED"
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) => handleChange("year", e.target.value)}
                  placeholder="e.g., 2023"
                />
              </div>
              <div>
                <Label>Mileage (km)</Label>
                <Input
                  required
                  value={formData.mileage}
                  onChange={(e) => handleChange("mileage", e.target.value)}
                  placeholder="Enter mileage"
                />
              </div>
            </div>

            {/* Vehicle Specifications */}
            <div className="space-y-4">
              <h3 className="font-semibold">Vehicle Specifications</h3>
              <div>
                <Label>Engine</Label>
                <Input
                  required
                  value={formData.engine}
                  onChange={(e) => handleChange("engine", e.target.value)}
                  placeholder="e.g., V8 Twin-Turbo"
                />
              </div>
              <div>
                <Label>Color</Label>
                <Input
                  required
                  value={formData.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  placeholder="e.g., Rosso Corsa"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  required
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="e.g., Dubai"
                />
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-4">
              <div>
                <Label>Transmission</Label>
                <Input
                  required
                  value={formData.transmission}
                  onChange={(e) => handleChange("transmission", e.target.value)}
                  placeholder="e.g., Automatic"
                />
              </div>
              <div>
                <Label>Body Type</Label>
                <Input
                  required
                  value={formData.body_type}
                  onChange={(e) => handleChange("body_type", e.target.value)}
                  placeholder="e.g., Coupe"
                />
              </div>
              <div>
                <Label>Fuel Type</Label>
                <Input
                  required
                  value={formData.fuel_type}
                  onChange={(e) => handleChange("fuel_type", e.target.value)}
                  placeholder="e.g., Petrol"
                />
              </div>
            </div>

            {/* Additional Specifications */}
            <div className="space-y-4">
              <div>
                <Label>Number of Doors</Label>
                <Input
                  type="number"
                  value={formData.doors}
                  onChange={(e) => handleChange("doors", e.target.value)}
                  placeholder="e.g., 2"
                />
              </div>
              <div>
                <Label>Number of Cylinders</Label>
                <Input
                  value={formData.cylinders}
                  onChange={(e) => handleChange("cylinders", e.target.value)}
                  placeholder="e.g., 8"
                />
              </div>
              <div>
                <Label>Horsepower</Label>
                <Input
                  value={formData.horsepower}
                  onChange={(e) => handleChange("horsepower", e.target.value)}
                  placeholder="e.g., 562"
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <div>
                <Label>Specs</Label>
                <Input
                  value={formData.specs}
                  onChange={(e) => handleChange("specs", e.target.value)}
                  placeholder="e.g., GCC"
                />
              </div>
              <div>
                <Label>Warranty</Label>
                <Input
                  value={formData.warranty}
                  onChange={(e) => handleChange("warranty", e.target.value)}
                  placeholder="Warranty details"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label>Car Images (Required)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Input
                type="file"
                multiple
                required
                accept="image/*"
                className="hidden"
                id="car-images"
                onChange={(e) => setImages(e.target.files)}
              />
              <Label htmlFor="car-images" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Click to upload images or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Upload multiple images (JPG, PNG)
                </p>
              </Label>
            </div>
            {images && (
              <p className="text-sm text-gray-600">
                {images.length} images selected
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Adding Car..." : "Add Car"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCarModal;
