import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDistance } from "date-fns";
import { Mail, Phone, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import ImageGalleryModal from "@/components/ImageGalleryModal";

const AdminSellEnquiry = () => {
  const { toast } = useToast();
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('sell_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: 'pending' | 'contacted' | 'closed') => {
    try {
      const { error } = await supabaseAdmin
        .from('sell_enquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Enquiry status changed to ${newStatus}`,
      });

      fetchEnquiries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleImageClick = (images: string[], startIndex: number) => {
    setSelectedImages(images);
    setCurrentImageIndex(startIndex);
    setIsGalleryOpen(true);
  };

  if (loading) return <div>Loading enquiries...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Sell Car Enquiries</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enquiries.map((enquiry) => (
          <Card key={enquiry.id} className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{enquiry.make} {enquiry.model}</h3>
                <p className="text-sm text-gray-500">
                  {enquiry.year} • {enquiry.mileage}km
                </p>
              </div>
              <Badge variant="secondary">
                {enquiry.asking_price ? `AED ${enquiry.asking_price}` : 'Price not specified'}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="pt-2 border-t">
                <h4 className="font-medium mb-2">Vehicle Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">Exterior:</span>
                  <span>{enquiry.exterior_color} • {enquiry.exterior_condition}</span>
                  <span className="text-gray-600">Interior:</span>
                  <span>{enquiry.interior_color} • {enquiry.interior_condition}</span>
                  <span className="text-gray-600">Accidents:</span>
                  <span>{enquiry.accident_history}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <h4 className="font-medium mb-2">Customer Details</h4>
                <p className="flex items-center gap-2">
                  <span className="text-gray-600">Name:</span>
                  {enquiry.name}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <a href={`mailto:${enquiry.email}`} className="text-blue-600 hover:underline">
                    {enquiry.email}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a href={`tel:${enquiry.phone}`} className="text-blue-600 hover:underline">
                    {enquiry.phone}
                  </a>
                </p>
              </div>

              <div className="pt-2 border-t text-sm text-gray-500">
                Received: {formatDistance(new Date(enquiry.created_at), new Date(), { addSuffix: true })}
              </div>

              {enquiry.images && enquiry.images.length > 0 && (
                <div className="pt-2 border-t">
                  <h4 className="font-medium mb-2">Images</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {enquiry.images.map((url: string, index: number) => (
                      <div
                        key={index}
                        className="relative cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(enquiry.images, index)}
                      >
                        <img
                          src={url}
                          alt={`Car ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-2">
                <Button
                  size="sm"
                  variant={enquiry.status === 'contacted' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => handleStatusChange(enquiry.id, 'contacted')}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Contacted
                </Button>
                <Button
                  size="sm"
                  variant={enquiry.status === 'closed' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => handleStatusChange(enquiry.id, 'closed')}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Close
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ImageGalleryModal
        images={selectedImages}
        currentIndex={currentImageIndex}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onPrevious={() => setCurrentImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length)}
        onNext={() => setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length)}
        onIndexChange={setCurrentImageIndex}
      />
    </div>
  );
};

export default AdminSellEnquiry;
