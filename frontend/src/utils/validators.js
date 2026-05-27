// Client form entry inputs, email strings, credit cards, CVVs validators.

export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

export const validateCreditCard = (cardNumber) => {
  // Matches clean credit card inputs (16 digits)
  const re = /^\d{16}$/;
  return re.test(cardNumber.replace(/\s+/g, ''));
};

export const validateExpirationDate = (expiry) => {
  // Matches MM/YY or MM/YYYY formatting
  const re = /^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$/;
  if (!re.test(expiry)) return false;

  const parts = expiry.split('/');
  const month = parseInt(parts[0], 10);
  let year = parseInt(parts[1], 10);
  if (year < 100) year += 2000; // MM/YY standard conversion

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
};

export const validateCVV = (cvv) => {
  // 3 or 4 digit CVV
  const re = /^\d{3,4}$/;
  return re.test(cvv);
};

export const validateRequiredFields = (data, requiredFields = []) => {
  const errors = {};
  requiredFields.forEach((field) => {
    if (!data[field] || String(data[field]).trim() === '') {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
    }
  });
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
export default validateEmail;
