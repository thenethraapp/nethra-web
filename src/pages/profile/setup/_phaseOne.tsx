import { useAuth } from '@/context/AuthContext';

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

interface PhaseOneProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const PhaseOne: React.FC<PhaseOneProps> = ({ formData, setFormData }) => {
  const { user } = useAuth();

  // Get user initials from fullName (first two letters)
  const getUserInitials = () => {
    const name = user?.fullName || 'U';
    // Take first two letters of the full name
    return name.trim().substring(0, 2).toUpperCase();
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="md:text-3xl font-bold text-charcoal">Personal Information:</h2>

      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary-cyan flex items-center justify-center text-white font-semibold text-xl">
          {getUserInitials()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-charcoal font-medium mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={user?.fullName || ''}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-darkcyan"
          />
        </div>

        <div>
          <label className="block text-charcoal font-medium mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-darkcyan appearance-none bg-white"
          >
            <option value="">Choose here</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-charcoal font-medium mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-darkcyan"
            />
          </div>
        </div>

        <div>
          <label className="block text-charcoal font-medium mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="City, State"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vividblue"
          />
        </div>
      </div>

      <div className="flex flex-wrap-reverse items-center gap-3">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, locationEnabled: !formData.locationEnabled })}
          className={`relative w-14 h-7 rounded-full transition-colors ${formData.locationEnabled ? 'bg-primary-darkcyan' : 'bg-gray-300'
            }`}
          aria-label="Toggle location access"
        >
          <div
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${formData.locationEnabled ? 'translate-x-7' : ''
              }`}
          />
        </button>
        <span className="text-charcoal">Enable location access to find nearby Optometrists.</span>
      </div>
    </div>
  );
};

export default PhaseOne;