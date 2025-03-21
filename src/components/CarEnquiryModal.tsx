import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";
import { supabaseAdmin } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface CarEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  carDetails: any;
}

const CarEnquiryModal = ({ isOpen, onClose, carDetails }: CarEnquiryModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabaseAdmin.from('car_enquiries').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        car_id: carDetails.id,
        car_name: carDetails.name,
        car_price: carDetails.price_usd,
        created_at: new Date().toISOString(),
        status: 'pending'
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your enquiry has been submitted successfully. We will contact you shortly.",
      });
      onClose();
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="bg-white/95 backdrop-blur-sm shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl lg:rounded-3xl">
        <DialogHeader>
          <DialogTitle>Enquire About {carDetails?.name}</DialogTitle>
          
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl p-3">
          <div>
            <Label>Full Name</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              required
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <Label>Message</Label>
            <Textarea
              required
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="I'm interested in this car and would like to know more about..."
              rows={4}
              className="bg-white/80 p-2 rounded-xl drop-shadow-2xl border-[1.5] border-gray-600"
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send Enquiry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CarEnquiryModal;
