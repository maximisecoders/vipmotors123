import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Mail, Phone } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AdminCarEnquiry = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('car_enquiries')
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
        .from('car_enquiries')
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

  if (loading) return <div>Loading enquiries...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Car Enquiries</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enquiries.map((enquiry) => (
          <Card key={enquiry.id} className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{enquiry.car_name}</h3>
                <p className="text-sm text-gray-500">
                  ${enquiry.car_price?.toLocaleString() || 'Price on request'}
                </p>
              </div>
              <Badge className={getStatusColor(enquiry.status)}>
                {enquiry.status}
              </Badge>
            </div>

            <div className="space-y-2">
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

              <div className="pt-2 border-t">
                <h4 className="font-medium mb-2">Message</h4>
                <p className="text-gray-600">{enquiry.message}</p>
              </div>

              <div className="pt-2 border-t text-sm text-gray-500">
                Received: {formatDistance(new Date(enquiry.created_at), new Date(), { addSuffix: true })}
              </div>

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
    </div>
  );
};

export default AdminCarEnquiry;
