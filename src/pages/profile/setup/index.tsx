import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import PhaseOne from './_phaseOne';
import PhaseTwo from './_phaseTwo';
import PhaseThree from './_phaseThree';
import ProfileSetupSuccess from '@/component/common/modals/profileSetupSuccess';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { createPatientProfile } from '@/api/profile/patient/create-patient-profile';

interface FormData {
  gender: string;
  dateOfBirth: string;
  address: string;
  locationEnabled: boolean;
  chiefComplaint: string;
  lastEyeExam: string;
  allergiesText: string;
  allergies: string[];
  eyeConditions: string[];
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactEmail: string;
  relationship: string;
  consent: boolean;
}

const ProfileSetup: React.FC = () => {
  const { user, login } = useAuth();

  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    gender: '',
    dateOfBirth: '',
    address: '',
    locationEnabled: false,
    chiefComplaint: '',
    lastEyeExam: '',
    allergiesText: '',
    allergies: [],
    eyeConditions: [],
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyContactEmail: '',
    relationship: '',
    consent: false
  });

  const validatePhaseOne = (): boolean => {

    if (!formData.gender) {
      setError('Gender is required');
      return false;
    }
    if (!formData.dateOfBirth) {
      setError('Date of birth is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    return true;
  };

  const validatePhaseTwo = (): boolean => {
    if (!formData.chiefComplaint.trim()) {
      setError('Chief complaint is required');
      return false;
    }
    if (formData.eyeConditions.length === 0) {
      setError('Please select at least one eye condition option');
      return false;
    }
    return true;
  };

  const validatePhaseThree = (): boolean => {
    if (!formData.emergencyContactName.trim()) {
      setError('Emergency contact name is required');
      return false;
    }
    if (!formData.emergencyContactNumber.trim()) {
      setError('Emergency contact phone number is required');
      return false;
    }
    if (!formData.emergencyContactEmail.trim()) {
      setError('Emergency contact email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emergencyContactEmail)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.relationship.trim()) {
      setError('Relationship is required');
      return false;
    }
    if (!formData.consent) {
      setError('You must consent to use the emergency contact');
      return false;
    }
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    setError('');
    setIsSubmitting(true);

    try {
      const profileData = {
        gender: formData.gender,
        dob: formData.dateOfBirth,
        address: formData.address,
        enableLocationAccess: formData.locationEnabled,
        medicalInformation: {
          chiefComplaint: formData.chiefComplaint,
          lastEyeExamination: formData.lastEyeExam || undefined,
          allergies: formData.allergies.length > 0 ? formData.allergies : undefined,
          eyeConditions: formData.eyeConditions
        },
        otherInformation: {
          emergencyContactName: formData.emergencyContactName,
          emergencyContactNumber: formData.emergencyContactNumber,
          emergencyContactEmail: formData.emergencyContactEmail,
          relationship: formData.relationship,
          consent: formData.consent
        }
      };

      const response = await createPatientProfile(profileData);

      if (response.success) {
        // Update auth context with new token if provided
        if (response.accessToken) {
          login(response.accessToken);
        }
        setShowSuccess(true);
      } else {
        setError(response.message || 'Failed to create profile. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Profile creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = (): void => {
    setError('');

    if (currentPhase === 1) {
      if (!validatePhaseOne()) return;
      setCurrentPhase(2);
    } else if (currentPhase === 2) {
      if (!validatePhaseTwo()) return;
      setCurrentPhase(3);
    } else if (currentPhase === 3) {
      if (!validatePhaseThree()) return;
      handleSubmit();
    }
  };

  const handleBack = (): void => {
    setError('');
    if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1);
    }
  };

  if (user && user.role !== 'patient') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-softwhite px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-charcoal mb-2">Unauthorized</h1>
          <p className="text-grayblue">You do not have access to this page.</p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return <ProfileSetupSuccess onClose={() => setShowSuccess(false)} />;
  }

  return (
    <div className="min-h-screen bg-softwhite py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="hidden md:flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            disabled={currentPhase === 1}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ease-in ${
              currentPhase === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-primary-cyan bg-primary-cyan/25 hover:bg-primary-cyan/15'
            }`}
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-2">
            {[1, 2, 3].map((phase) => (
              <div
                key={phase}
                className={`h-1 rounded-full transition-all ${
                  phase === currentPhase
                    ? 'w-16 bg-primary-cyan'
                    : phase < currentPhase
                    ? 'w-12 bg-primary-cyan'
                    : 'w-12 bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ease-in ${
              isSubmitting
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-primary-cyan bg-primary-cyan/25 hover:bg-primary-cyan/15'
            }`}
            aria-label="Continue"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {currentPhase === 1 && <PhaseOne formData={formData} setFormData={setFormData} />}
          {currentPhase === 2 && <PhaseTwo formData={formData} setFormData={setFormData} />}
          {currentPhase === 3 && <PhaseThree formData={formData} setFormData={setFormData} />}
        </div>

        <div className="flex md:hidden items-center justify-between my-8">
          <button
            onClick={handleBack}
            disabled={currentPhase === 1}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ease-in ${
              currentPhase === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-primary-cyan hover:bg-gray-200'
            }`}
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-2">
            {[1, 2, 3].map((phase) => (
              <div
                key={phase}
                className={`h-1 rounded-full transition-all ${
                  phase === currentPhase
                    ? 'w-16 bg-primary-cyan'
                    : phase < currentPhase
                    ? 'w-12 bg-primary-cyan'
                    : 'w-12 bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`p-2 rounded-lg transition-colors ${
              isSubmitting
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-charcoal hover:bg-gray-200'
            }`}
            aria-label="Continue"
          >
            {isSubmitting && currentPhase === 3 ? (
              <div className="w-6 h-6 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin" />
            ) : (
              <ChevronRight className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;