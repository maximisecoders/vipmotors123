import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect } from "react";

interface ImageGalleryModalProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onIndexChange: (index: number) => void;
}

const ImageGalleryModal = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  onIndexChange,
}: ImageGalleryModalProps) => {
  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowLeft') {
        onPrevious();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onPrevious, onNext, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="max-w-6xl p-5 bg-white/80 backdrop-blur-sm border-none shadow-xl lg:rounded-3xl overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Main Image with Navigation */}
          <div className="flex items-center gap-6 mb-6 flex-1">
            {/* Left Button */}
            {images.length > 1 && (
              <Button
                variant="secondary"
                size="icon"
                className="flex-none w-12 h-12 bg-white/80 hover:bg-white rounded-full"
                onClick={onPrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {/* Main Image */}
            <div className="flex-1 h-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <img
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Right Button */}
            {images.length > 1 && (
              <Button
                variant="secondary"
                size="icon"
                className="flex-none w-12 h-12 bg-white/80 hover:bg-white rounded-full"
                onClick={onNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4 bg-white/50 p-4 rounded-2xl min-h-5">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-[16/10] rounded-xl cursor-pointer transition-all hover:scale-105 shadow-[0_4px_15px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${
                    currentIndex === index ? 'ring-2 ring-red-600' : ''
                  }`}
                  onClick={() => onIndexChange(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryModal;
