// PhoneInput.js
import React from 'react';

const PhoneInput = ({ value, onChange, isInvalid }) => {
  const formatPhoneNumber = (phoneNumber) => {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Limit to 10 digits
    const digits = cleaned.substring(0, 10);
    
    // Format as (XXX) XXX-XXXX
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.substring(0, 3)}) ${digits.substring(3)}`;
    return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
  };

  const handlePhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    onChange(formattedValue);
  };

  return (
    <input
      type="text"
      className={`form-control phone-input ${isInvalid ? 'is-invalid' : ''}`}
      value={value}
      onChange={handlePhoneChange}
      placeholder="(123) 456-7890"
    />
  );
};

export default PhoneInput;