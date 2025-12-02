import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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

interface PhaseThreeProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const relationshipOptions = [
    { value: 'brother', label: 'Brother' },
    { value: 'sister', label: 'Sister' },
    { value: 'father', label: 'Father' },
    { value: 'mother', label: 'Mother' },
    { value: 'friend', label: 'Friend' },
    { value: 'cousin', label: 'Cousin' },
    { value: 'co-worker', label: 'Co-worker' },
    { value: 'other', label: 'Other' },
];

const PhaseThree: React.FC<PhaseThreeProps> = ({ formData, setFormData }) => {
    const [isRelationshipOpen, setIsRelationshipOpen] = useState(false);
    const relationshipDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (relationshipDropdownRef.current && !relationshipDropdownRef.current.contains(event.target as Node)) {
                setIsRelationshipOpen(false);
            }
        };

        if (isRelationshipOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isRelationshipOpen]);

    const getSelectedLabel = () => {
        const selected = relationshipOptions.find(opt => opt.value === formData.relationship);
        return selected ? selected.label : 'Choose relationship';
    };

    const handleRelationshipSelect = (value: string) => {
        setFormData({ ...formData, relationship: value });
        setIsRelationshipOpen(false);
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <h2 className="md:text-3xl font-bold text-charcoal">Other Information:</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-charcoal font-medium mb-2">
                        Emergency Contact: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Full name of your emergency contact"
                        value={formData.emergencyContactName}
                        onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vividblue"
                    />
                </div>

                <div>
                    <label className="block text-charcoal font-medium mb-2">
                        Phone Number: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        placeholder="Phone number of emergency contact"
                        value={formData.emergencyContactNumber}
                        onChange={(e) => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                        required
                        pattern="[0-9+\-\s()]+"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vividblue"
                    />
                </div>

                <div className="relative" ref={relationshipDropdownRef}>
                    <label className="block text-charcoal font-medium mb-2">
                        Relationship: <span className="text-red-500">*</span>
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsRelationshipOpen(!isRelationshipOpen)}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vividblue bg-white text-left flex items-center justify-between ${
                            !formData.relationship ? 'text-gray-500' : 'text-charcoal'
                        }`}
                    >
                        <span>{getSelectedLabel()}</span>
                        <ChevronDown 
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                isRelationshipOpen ? 'rotate-180' : ''
                            }`} 
                        />
                    </button>
                    
                    {isRelationshipOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {relationshipOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleRelationshipSelect(option.value)}
                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                                        formData.relationship === option.value
                                            ? 'bg-primary-cyan/10 text-primary-cyan font-medium'
                                            : 'text-charcoal'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-charcoal font-medium mb-2">
                        Email Address: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="e.g bendoe@gmail.com"
                        value={formData.emergencyContactEmail}
                        onChange={(e) => setFormData({ ...formData, emergencyContactEmail: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vividblue"
                    />
                </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    required
                    className="w-5 h-5 text-vividblue border-gray-300 rounded focus:ring-vividblue mt-0.5"
                />
                <span className="text-charcoal">
                    I consent to use the above person as my emergency contact when I cannot be reached.{' '}
                    <span className="text-red-500">*</span>
                </span>
            </label>
        </div>
    );
};

export default PhaseThree;