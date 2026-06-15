// Price discount ratios, totals, taxes, and shipping computations helpers.

export const calculateDiscountedPrice = (price, discountPercent) => {
  if (!discountPercent) return price;
  const discounted = price - (price * (discountPercent / 100));
  return Math.round(discounted * 100) / 100;
};

export const calculateTax = (subtotal, taxRate = 0.08) => {
  return Math.round(subtotal * taxRate * 100) / 100;
};

export const calculateShipping = (subtotal, freeShippingThreshold = 50, flatRate = 10) => {
  if (subtotal >= freeShippingThreshold || subtotal === 0) return 0;
  return flatRate;
};

export const generateInvoiceId = () => {
  const randNum = Math.floor(100000 + Math.random() * 900000);
  return `INV-${randNum}`;
};

export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
