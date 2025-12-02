// component/patientRecords/biometric.tsx
import React, { useState, useEffect } from 'react';
import { User, Calendar, Phone, Mail, AlertCircle } from 'lucide-react';

interface BiometricFormData {
  patientName: string;
  age: number | string;
  phone: string;
  email: string;
}

interface PatientBiometricProps {
  onNext: (data: BiometricFormData) => void | Promise<void>;
  onPrevious?: () => void;
  onContinueLater: () => void | Promise<void>;
  initialData: Partial<BiometricFormData>;
}

interface ValidationErrors {
  patientName?: string;
  age?: string;
  phone?: string;
  email?: string;
}

const PatientBiometric: React.FC<PatientBiometricProps> = ({
  onNext,
  onPrevious,
  onContinueLater,
  initialData
}) => {
  const [formData, setFormData] = useState<BiometricFormData>({
    patientName: initialData.patientName ?? '',
    age: initialData.age ?? '',
    phone: initialData.phone ?? '',
    email: initialData.email ?? ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      patientName: initialData.patientName ?? '',
      age: initialData.age ?? '',
      phone: initialData.phone ?? '',
      email: initialData.email ?? ''
    });
  }, [initialData]);

  const validateField = (name: keyof BiometricFormData, value: string | number): string | undefined => {
    switch (name) {
      case 'patientName':
        if (!value || String(value).trim().length === 0) {
          return 'Patient name is required';
        }
        if (String(value).trim().length < 2) {
          return 'Patient name must be at least 2 characters';
        }
        if (String(value).trim().length > 100) {
          return 'Patient name must not exceed 100 characters';
        }
        if (!/^[a-zA-Z\s'-]+$/.test(String(value).trim())) {
          return 'Patient name can only contain letters, spaces, hyphens, and apostrophes';
        }
        break;

      case 'age':
        const ageNum = Number(value);
        if (!value || value === '') {
          return 'Age is required';
        }
        if (isNaN(ageNum)) {
          return 'Age must be a valid number';
        }
        if (ageNum < 0) {
          return 'Age cannot be negative';
        }
        if (ageNum > 150) {
          return 'Age must be 150 or less';
        }
        if (!Number.isInteger(ageNum)) {
          return 'Age must be a whole number';
        }
        break;

      case 'phone':
        // Phone is optional, but validate if provided
        if (value && String(value).trim().length > 0) {
          const phoneStr = String(value).replace(/[\s()-]/g, '');
          if (!/^\+?[\d]{10,15}$/.test(phoneStr)) {
            return 'Please enter a valid phone number (10-15 digits)';
          }
        }
        break;

      case 'email':
        // Email is optional, but validate if provided
        if (value && String(value).trim().length > 0) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(String(value))) {
            return 'Please enter a valid email address';
          }
        }
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof BiometricFormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const fieldName = name as keyof BiometricFormData;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate on change if field was already touched
    if (touched[name]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const fieldName = name as keyof BiometricFormData;

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(fieldName, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      patientName: true,
      age: true,
      phone: true,
      email: true
    });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert age to number for submission
      const submitData: BiometricFormData = {
        ...formData,
        age: Number(formData.age)
      };
      
      await onNext(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueLater = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      await onContinueLater();
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = !errors.patientName && !errors.age && formData.patientName && formData.age;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-4" style={{ borderColor: '#e5e5e5' }}>
        <div className="mb-3">
          <h2 className="text-base font-bold mb-1" style={{ color: '#030460' }}>
            Patient Information
          </h2>
          <p className="text-xs" style={{ color: '#222222' }}>
            Please enter the {"patient's"} basic information to begin the examination record.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-3">
            {/* Patient Name Field */}
            <div>
              <label 
                htmlFor="patientName" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Patient Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter patient's full name"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                    errors.patientName && touched.patientName
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  aria-invalid={errors.patientName && touched.patientName ? 'true' : 'false'}
                  aria-describedby={errors.patientName && touched.patientName ? 'patientName-error' : undefined}
                />
              </div>
              {errors.patientName && touched.patientName && (
                <div id="patientName-error" className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle size={14} />
                  <span>{errors.patientName}</span>
                </div>
              )}
            </div>

            {/* Age Field */}
            <div>
              <label 
                htmlFor="age" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Age <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter age"
                  min="0"
                  max="150"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                    errors.age && touched.age
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  aria-invalid={errors.age && touched.age ? 'true' : 'false'}
                  aria-describedby={errors.age && touched.age ? 'age-error' : undefined}
                />
              </div>
              {errors.age && touched.age && (
                <div id="age-error" className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle size={14} />
                  <span>{errors.age}</span>
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label 
                htmlFor="phone" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter phone number"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                    errors.phone && touched.phone
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  aria-invalid={errors.phone && touched.phone ? 'true' : 'false'}
                  aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
                />
              </div>
              {errors.phone && touched.phone && (
                <div id="phone-error" className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle size={14} />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter email address"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                    errors.email && touched.email
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                  aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && touched.email && (
                <div id="email-error" className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle size={14} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t" style={{ borderColor: '#e5e5e5' }}>
              {onPrevious && (
                <button
                  type="button"
                  onClick={onPrevious}
                  disabled={isSubmitting}
                  className="flex-1 py-1.5 px-3 rounded text-xs font-medium text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#f5f5f5' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                >
                  Previous
                </button>
              )}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex-1 py-1.5 px-3 rounded text-xs font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#030460' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#050680'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#030460'}
              >
                {isSubmitting ? 'Processing...' : 'Next Step'}
              </button>
            </div>

            <button
              type="button"
              onClick={handleContinueLater}
              disabled={isSubmitting}
              className="w-full py-1.5 px-3 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#f9f9f9', color: '#222222' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e5e5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
            >
              {isSubmitting ? 'Saving...' : 'Save & Continue Later'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientBiometric;