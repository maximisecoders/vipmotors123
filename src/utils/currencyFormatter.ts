 const formatCurrency = {
  USD: (price: number | null) => {
    if (!price || price === null) return null;
    return `$ ${price.toLocaleString('en-US')}`;
  },
  AED: (price: number | null) => {
    if (!price || price === null) return null;
    const aedPrice = price * 3.67;
    return `AED ${aedPrice.toLocaleString('en-US')}`;
  },
  EUR: (price: number | null) => {
    if (!price || price === null) return null;
    const eurPrice = price * 0.91;
    return `€ ${eurPrice.toLocaleString('en-US')}`;
  }
};

export default formatCurrency;