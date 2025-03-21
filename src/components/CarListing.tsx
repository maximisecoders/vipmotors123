const CarListing = ({ car }) => {
  return (
    <div className="car-listing">
      <p className="price">Price: {car.price} AED</p>
    </div>
  );
};

export default CarListing;