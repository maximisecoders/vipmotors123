import React from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  carsPerPage: number;
  totalCars: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination = ({ carsPerPage, totalCars, paginate, currentPage }: PaginationProps) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalCars / carsPerPage);

  // Generate page numbers
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Don't render if there's only one page or no cars
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="h-9 w-9 rounded-full shadow-sm hover:shadow-md border border-gray-200 bg-white hover:bg-white"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex gap-3">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`min-w-[36px] h-9 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border border-gray-900 ${
              currentPage === number 
                ? 'text-gray-700 border-transparent bg-white' 
                : 'bg-primary text-gray-700 hover:bg-gray-50'
            }`}
          >
            {number}
          </button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="h-9 w-9 rounded-full shadow-sm hover:shadow-md border border-gray-200 bg-white hover:bg-white"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
