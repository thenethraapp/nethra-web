// component/patientRecords/biometric.tsx
import React, { useState, useEffect, useRef } from 'react';
import { User, Calendar, Phone, Mail, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { searchPatients, type PatientSearchResult } from '@/api/records';

interface BiometricFormData {
  patientName: string;
  patientId?: string; // For registered patients
  isRegisteredPatient?: boolean;
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
    patientId: initialData.patientId,
    isRegisteredPatient: initialData.isRegisteredPatient ?? false,
    age: initialData.age ?? '',
    phone: initialData.phone ?? '',
    email: initialData.email ?? ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PatientSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({
      patientName: initialData.patientName ?? '',
      patientId: initialData.patientId,
      isRegisteredPatient: initialData.isRegisteredPatient ?? false,
      age: initialData.age ?? '',
      phone: initialData.phone ?? '',
      email: initialData.email ?? ''
    });

    // If initial data has patientId, try to set selected patient
    if (initialData.patientId && initialData.isRegisteredPatient) {
      setSelectedPatient({
        _id: initialData.patientId,
        name: initialData.patientName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        username: ''
      });
    }
  }, [initialData]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search patients as user types
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if query is too short or if a patient is already selected
    if (searchQuery.trim().length < 2 || selectedPatient) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // Debounce search
    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchPatients(searchQuery.trim());
        setSearchResults(results);
        setShowDropdown(results.length > 0);
        setIsSearching(false);
      } catch (error) {
        console.error('Error searching patients:', error);
        setSearchResults([]);
        setShowDropdown(false);
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedPatient]);

  const handlePatientNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchQuery(value);
    setFormData(prev => ({
      ...prev,
      patientName: value
    }));

    // Clear selected patient if user starts typing
    if (selectedPatient) {
      setSelectedPatient(null);
      setFormData(prev => ({
        ...prev,
        patientId: undefined,
        isRegisteredPatient: false
      }));
    }

    // Clear errors
    if (touched.patientName) {
      const error = validateField('patientName', value);
      setErrors(prev => ({
        ...prev,
        patientName: error
      }));
    }
  };

  const handleSelectPatient = (patient: PatientSearchResult): void => {
    setSelectedPatient(patient);
    setFormData(prev => ({
      ...prev,
      patientName: patient.name,
      patientId: patient._id,
      isRegisteredPatient: true,
      email: patient.email || prev.email,
      phone: patient.phone || prev.phone
    }));
    setSearchQuery(patient.name);
    setShowDropdown(false);
    setSearchResults([]);

    // Clear errors
    setErrors(prev => ({
      ...prev,
      patientName: undefined
    }));
  };

  const handleClearSelection = (): void => {
    setSelectedPatient(null);
    setFormData(prev => ({
      ...prev,
      patientId: undefined,
      isRegisteredPatient: false
    }));
    setSearchQuery(formData.patientName);
  };

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
      if (key === 'patientId' || key === 'isRegisteredPatient') return; // Skip these
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
            {selectedPatient && (
              <span className="ml-2 text-green-600 font-medium">
                ✓ Registered patient selected
              </span>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-3">
            {/* Patient Name Field with Autocomplete */}
            <div>
              <label
                htmlFor="patientName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Patient Name <span className="text-red-500">*</span>
                {selectedPatient && (
                  <span className="ml-2 text-xs text-green-600 font-normal">
                    (Registered Patient)
                  </span>
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    id="patientName"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handlePatientNameChange}
                    onBlur={handleBlur}
                    onFocus={() => {
                      if (searchResults.length > 0 && !selectedPatient) {
                        setShowDropdown(true);
                      }
                    }}
                    placeholder="Type patient name to search or enter new patient"
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${errors.patientName && touched.patientName
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    aria-invalid={errors.patientName && touched.patientName ? 'true' : 'false'}
                    aria-describedby={errors.patientName && touched.patientName ? 'patientName-error' : undefined}
                    autoComplete="off"
                  />
                  {selectedPatient && (
                    <button
                      type="button"
                      onClick={handleClearSelection}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      aria-label="Clear selection"
                    >
                      <X size={16} className="text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>

                {/* Autocomplete Dropdown */}
                {showDropdown && searchResults.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                  >
                    {isSearching ? (
                      <div className="p-3 text-sm text-gray-500 text-center">Searching...</div>
                    ) : (
                      searchResults.map((patient) => (
                        <button
                          key={patient._id}
                          type="button"
                          onClick={() => handleSelectPatient(patient)}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{patient.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {patient.email && <span>{patient.email}</span>}
                                {patient.email && patient.phone && <span> • </span>}
                                {patient.phone && <span>{patient.phone}</span>}
                              </div>
                            </div>
                            <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 ml-2" />
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {errors.patientName && touched.patientName && (
                <div id="patientName-error" className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle size={14} />
                  <span>{errors.patientName}</span>
                </div>
              )}
              {selectedPatient && (
                <div className="mt-1.5 flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 size={12} />
                  <span>Registered patient selected. Record will be linked to their account.</span>
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
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${errors.age && touched.age
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
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${errors.phone && touched.phone
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
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${errors.email && touched.email
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
