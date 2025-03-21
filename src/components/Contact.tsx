import { Button } from "./ui/button";
import { Phone, MapPin, Mail, Clock, Share2 } from "lucide-react";

const Contact = () => {
  return (
    <section className="py-20 bg-gray-50" id="contact">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Have ANY Question? <span className="text-[#ea384c]">Feel free to ask...</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're here to help and answer any question you might have
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-red-50 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-[#ea384c]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Call Us</p>
                    <p className="font-semibold">04 323 2999</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-red-50 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-[#ea384c]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Us</p>
                    <p className="font-semibold">info@vipmotors.ae</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-red-50 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-[#ea384c]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Visit Us</p>
                    <p className="font-semibold">Sheikh Zayed Rd - Al Quoz</p>
                    <p className="text-sm text-gray-600">Al Quoz 3 - Dubai, UAE</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-red-50 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-[#ea384c]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Working Hours</p>
                    <p className="font-semibold">Mon - Sat: 9:00 AM - 8:00 PM</p>
                    <p className="text-sm text-gray-600">Sunday: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button size="lg" className="w-full bg-black hover:bg-black/90">
                  Contact Us
                </Button>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 h-[600px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611.2384161927935!2d55.23062927592903!3d25.161426333147574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6bd055555555%3A0x13e2f976b1e4ad06!2sVIP%20MOTORS!5e0!3m2!1sen!2sin!4v1742470079940!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title="VIP Motors Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
