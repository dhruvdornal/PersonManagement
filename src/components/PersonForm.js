// PersonForm.js
import React, { useState, useEffect, useContext } from 'react';
import { PersonContext, statesWithCities } from './PersonContext';
import PhoneInput from './PhoneInput';

const PersonForm = () => {
  const { addPerson, updatePerson, editPerson, cancelEdit } = useContext(PersonContext);
  
  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    city: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    if (editPerson) {
      setFormData(editPerson);
      setAvailableCities(statesWithCities[editPerson.state] || []);
    } else {
      setFormData(initialFormState);
      setAvailableCities([]);
    }
  }, [editPerson]);

  const validate = () => {
    const newErrors = {};
    
    // First name validation - no special characters
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = 'No special characters allowed';
    }
    
    // Last name validation - no special characters
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = 'No special characters allowed';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    // Phone validation
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneDigits.length !== 10) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    
    // State validation
    if (!formData.state) {
      newErrors.state = 'Please select a state';
    }
    
    // City validation
    if (!formData.city && formData.state) {
      newErrors.city = 'Please select a city';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update cities when state changes
    if (name === 'state') {
      setFormData(prev => ({ ...prev, city: '' }));
      setAvailableCities(statesWithCities[value] || []);
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      if (editPerson) {
        updatePerson(formData);
      } else {
        addPerson(formData);
      }
      
      setFormData(initialFormState);
      setAvailableCities([]);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setAvailableCities([]);
    setErrors({});
    cancelEdit();
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">{editPerson ? 'Edit Person' : 'Add New Person'}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">Phone</label>
              <PhoneInput
                value={formData.phone}
                onChange={handlePhoneChange}
                isInvalid={!!errors.phone}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label htmlFor="state" className="form-label">State</label>
              <select
                className={`form-select ${errors.state ? 'is-invalid' : ''}`}
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                {Object.keys(statesWithCities).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <div className="invalid-feedback">{errors.state}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="city" className="form-label">City</label>
              <select
                className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!formData.state}
              >
                <option value="">Select City</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {errors.city && <div className="invalid-feedback">{errors.city}</div>}
            </div>
          </div>
          
          <div className="d-flex justify-content-end gap-2 mt-4">
            {editPerson && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {editPerson ? 'Update Person' : 'Add Person'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonForm;