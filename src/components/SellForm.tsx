import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { useState } from "react";
import { supabaseAdmin } from "@/lib/supabase";

const conditionOptions = [
  "Extra clean",
  "Clean",
  "Average",
  "Below Average",
  "I don't know"
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  carMake: z.string().min(2, "Car make must be at least 2 characters"),
  carModel: z.string().min(2, "Car model must be at least 2 characters"),
  year: z.string().regex(/^\d{4}$/, "Must be a valid year"),
  description: z.string().min(10, "Description must be at least 10 characters"),
vin: z.string().optional(),
});

const SellForm = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      carMake: "",
      carModel: "",
      year: "",
      description: "",
    },
  });

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    type: "",
    year: "",
    mileage: "",
    asking_price: "",
    exterior_color: "",
    interior_color: "",
    exterior_condition: "I don't know",
    interior_condition: "I don't know",
    accident_history: "I don't know",
    vin: "",
    name: "",
    email: "",
    phone: "",
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Step 1: Validate all required fields
      if (!formData.name || !formData.email || !formData.phone || 
          !formData.make || !formData.model || !formData.year) {
        throw new Error("Please fill all required fields");
      }

      // Step 2: Handle image uploads
      let imageUrls: string[] = [];
      if (images && images.length > 0) {
        const uploadPromises = Array.from(images).map(async (file) => {
          const fileName = `${Date.now()}-${file.name}`;
          const { error: uploadError, data } = await supabaseAdmin.storage
            .from('sell-enquiry-images')
            .upload(`images/${fileName}`, file);

          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('sell-enquiry-images')
            .getPublicUrl(`images/${fileName}`);

          return publicUrl;
        });

        imageUrls = await Promise.all(uploadPromises);
      }

      // Step 3: Prepare the enquiry data
      const enquiryData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        asking_price: formData.asking_price,
        exterior_color: formData.exterior_color,
        interior_color: formData.interior_color,
        exterior_condition: formData.exterior_condition,
        interior_condition: formData.interior_condition,
        accident_history: formData.accident_history,
        vin: formData.vin,
        images: imageUrls,
        created_at: new Date().toISOString()
      };

      console.log('Submitting enquiry:', enquiryData); // Debug log

      // Step 4: Insert into database
      const { error: insertError } = await supabaseAdmin
        .from('sell_enquiries')
        .insert([enquiryData]);

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Your enquiry has been submitted successfully.",
      });

      // Reset form
      setFormData({
        make: "",
        model: "",
        type: "",
        year: "",
        mileage: "",
        asking_price: "",
        exterior_color: "",
        interior_color: "",
        exterior_condition: "I don't know",
        interior_condition: "I don't know",
        accident_history: "I don't know",
        vin: "",
        name: "",
        email: "",
        phone: "",
      });
      setImages(null);
      setStep(1);

    } catch (error: any) {
      console.error('Submission error:', error); // Debug log
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.make || !formData.model || !formData.year || !formData.mileage || 
          !formData.exterior_color || !formData.interior_color) {
        toast({
          title: "Required Fields",
          description: "Please fill all required car details",
          variant: "destructive"
        });
        return;
      }
    } else if (step === 2) {
      // Condition step validation if needed
    } else if (step === 3) {
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          title: "Required Fields",
          description: "Please fill all contact details",
          variant: "destructive"
        });
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Car Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormLabel>Make *</FormLabel>
                <Input
                  required
                  value={formData.make}
                  onChange={(e) => handleChange("make", e.target.value)}
                  placeholder="e.g., Porsche"
                />
              </div>
              <div>
                <FormLabel>Model *</FormLabel>
                <Input
                  required
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  placeholder="e.g., 911"
                />
              </div>
              <div>
                <FormLabel>Year *</FormLabel>
                <Input
                  required
                  value={formData.year}
                  onChange={(e) => handleChange("year", e.target.value)}
                  placeholder="e.g., 2023"
                />
              </div>
              <div>
                <FormLabel>Asking Price (AED)</FormLabel>
                <Input
                  value={formData.asking_price}
                  onChange={(e) => handleChange("asking_price", e.target.value)}
                  placeholder="Enter amount in AED"
                />
              </div>
              <div>
                <FormLabel>Mileage (KM) *</FormLabel>
                <Input
                  required
                  value={formData.mileage}
                  onChange={(e) => handleChange("mileage", e.target.value)}
                  placeholder="Enter mileage in kilometers"
                />
              </div>
              <div>
                <FormLabel>VIN (Optional)</FormLabel>
                <Input
                  value={formData.vin}
                  onChange={(e) => handleChange("vin", e.target.value)}
                  placeholder="Vehicle Identification Number"
                />
              </div>
              <div>
                <FormLabel>Exterior Color *</FormLabel>
                <Input
                  required
                  value={formData.exterior_color}
                  onChange={(e) => handleChange("exterior_color", e.target.value)}
                  placeholder="e.g., Black"
                />
              </div>
              <div>
                <FormLabel>Interior Color *</FormLabel>
                <Input
                  required
                  value={formData.interior_color}
                  onChange={(e) => handleChange("interior_color", e.target.value)}
                  placeholder="e.g., Tan"
                />
              </div>
            </div>
            <Button type="button" onClick={handleNext} className="w-full">
              Next Step
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Car Condition</h3>
            <div className="space-y-4">
              <div>
                <FormLabel>Exterior Condition</FormLabel>
                <Select
                  value={formData.exterior_condition}
                  onValueChange={(value) => handleChange("exterior_condition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <FormLabel>Interior Condition</FormLabel>
                <Select
                  value={formData.interior_condition}
                  onValueChange={(value) => handleChange("interior_condition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <FormLabel>Accident History</FormLabel>
                <Select
                  value={formData.accident_history}
                  onValueChange={(value) => handleChange("accident_history", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select history" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No accidents">No accidents</SelectItem>
                    <SelectItem value="Minor accidents">Minor accidents</SelectItem>
                    <SelectItem value="Major accidents">Major accidents</SelectItem>
                    <SelectItem value="I don't know">I don't know</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Image upload section */}
              <div>
                <FormLabel>Car Images (Optional)</FormLabel>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(e.target.files)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={handleBack} className="w-full">
                Back
              </Button>
              <Button type="button" onClick={handleNext} className="w-full">
                Next Step
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Details</h3>
            <div className="space-y-4">
              <div>
                <FormLabel>Full Name *</FormLabel>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <FormLabel>Email *</FormLabel>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <FormLabel>Phone *</FormLabel>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={handleBack} className="w-full">
                Back
              </Button>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <section id="sell" className="py-20 relative">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3)"
        }}
      />
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Sell Your Luxury Vehicle</h2>
          <p className="text-gray-300">
            Get a premium offer for your premium vehicle
          </p>
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-3 h-3 rounded-full ${
                  step === num ? 'bg-red-600' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-xl mx-auto bg-white rounded-xl p-8">
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStepContent()}
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default SellForm;
