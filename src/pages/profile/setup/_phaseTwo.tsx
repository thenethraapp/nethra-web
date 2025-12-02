
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

interface PhaseTwoProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const PhaseTwo: React.FC<PhaseTwoProps> = ({ formData, setFormData }) => {
  const toggleCondition = (condition: string): void => {
    const current = formData.eyeConditions || [];
    if (current.includes(condition)) {
      setFormData({ ...formData, eyeConditions: current.filter(c => c !== condition) });
    } else {
      setFormData({ ...formData, eyeConditions: [...current, condition] });
    }
  };

  const toggleAllergy = (allergy: string): void => {
    const current = formData.allergies || [];
    if (current.includes(allergy)) {
      setFormData({ ...formData, allergies: current.filter(a => a !== allergy) });
    } else {
      setFormData({ ...formData, allergies: [...current, allergy] });
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }


  return (
    <div className="space-y-8">
      <h2 className="md:text-3xl font-bold text-charcoal">Medical Information:</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-charcoal font-medium mb-2">
            Chief Complaint: <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Describe your major eye concern or issue"
            value={formData.chiefComplaint}
            onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vividblue h-24 resize-none"
          />
        </div>

        <div>
          <label className="block text-charcoal font-medium mb-2">
            Your last eye examination:
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.lastEyeExam}
              onChange={(e) => setFormData({ ...formData, lastEyeExam: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vividblue"
            />
          </div>
        </div>

        <div>
          <label className="block text-charcoal font-medium mb-2">Do you have any allergies?</label>
          <textarea
            placeholder="Please indicate any allergy you have"
            value={formData.allergiesText}
            onChange={(e) => setFormData({ ...formData, allergiesText: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vividblue h-24 resize-none"
          />
        </div>

        <div>
          <label className="block text-charcoal font-medium mb-2">If yes, select the applicable option below:</label>
          <div className="space-y-3">
            {['Hypertension', 'Diabetes', 'Ulcer', 'None', 'Others (please specify)'].map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allergies?.includes(item)}
                  onChange={() => toggleAllergy(item)}
                  className="w-5 h-5 text-vividblue border-gray-300 rounded focus:ring-vividblue"
                />
                <span className="text-charcoal">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-charcoal font-medium mb-2">
            Do you have an existing eye condition? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {['Shortsightedness', 'Longsightedness', 'Glaucoma', 'None'].map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.eyeConditions?.includes(item)}
                  onChange={() => toggleCondition(item)}
                  className="w-5 h-5 text-vividblue border-gray-300 rounded focus:ring-vividblue"
                />
                <span className="text-charcoal">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseTwo;