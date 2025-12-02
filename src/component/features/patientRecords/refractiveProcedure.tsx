// component/patientRecords/refractiveProcedure.tsx
import React from 'react';
import { Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { usePatientRecordStore } from '@/store/usePatientRecordStore';

interface RefractiveProcedureProps {
  onNext: (isLast?: boolean) => void;
  onBack?: () => void;
  onContinueLater: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
}

const RefractiveProcedureForm = ({
  onNext,
  onBack,
  onContinueLater,
  isSubmitting,
  isLastStep = false
}: RefractiveProcedureProps) => {
  const { refractiveProcedure, updateRefractiveProcedure } = usePatientRecordStore();

  // Ensure refractiveProcedure has all required properties
  const safeRefractiveProcedure = refractiveProcedure || {
    retinoscopy: { od: { prescription: '', va: '' }, os: { prescription: '', va: '' } },
    monocularSubjective: { od: { prescription: '', va: '' }, os: { prescription: '', va: '' } },
    binocularBalance: { od: { prescription: '', va: '' }, os: { prescription: '', va: '' }, ou: { prescription: '', va: '' } }
  };

  const handleInputChange = (
    section: keyof typeof safeRefractiveProcedure,
    eye: string,
    field: 'prescription' | 'va',
    value: string
  ) => {
    const currentSection = safeRefractiveProcedure[section];
    const currentEye = currentSection[eye as keyof typeof currentSection] || { prescription: '', va: '' };

    updateRefractiveProcedure({
      [section]: {
        ...currentSection,
        [eye]: {
          ...currentEye,
          [field]: value
        }
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(isLastStep);
  };

  const handleReset = () => {
    updateRefractiveProcedure({
      retinoscopy: {
        od: { prescription: '', va: '' },
        os: { prescription: '', va: '' }
      },
      monocularSubjective: {
        od: { prescription: '', va: '' },
        os: { prescription: '', va: '' }
      },
      binocularBalance: {
        od: { prescription: '', va: '' },
        os: { prescription: '', va: '' },
        ou: { prescription: '', va: '' }
      }
    });
  };

  const renderEyeInputs = (
    section: keyof typeof safeRefractiveProcedure,
    eye: string,
    label: string
  ) => {
    const sectionData = safeRefractiveProcedure[section];
    const eyeData = sectionData[eye as keyof typeof sectionData];
    const prescription = eyeData?.prescription || '';
    const va = eyeData?.va || '';

    return (
      <div className="flex items-center gap-3 py-3 border-b border-gray-200 last:border-b-0">
        <label className="w-16 text-sm font-semibold text-gray-700">
          {label}
        </label>
        <div className="flex-1 flex items-center gap-3">
          <input
            type="text"
            placeholder="e.g., -2.50 / -0.50 x 90"
            value={prescription}
            onChange={(e) => handleInputChange(section, eye, 'prescription', e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">VA:</span>
            <input
              type="text"
              placeholder="6/6"
              value={va}
              onChange={(e) => handleInputChange(section, eye, 'va', e.target.value)}
              className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-white" />
            <h1 className="text-2xl font-bold text-white">REFRACTIVE PROCEDURE</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Retinoscopy Section */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                Retinoscopy
              </h2>
              <div className="space-y-0">
                {renderEyeInputs('retinoscopy', 'od', 'OD')}
                {renderEyeInputs('retinoscopy', 'os', 'OS')}
              </div>
            </div>

            {/* Monocular Subjective Section */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                Monocular Subjective
              </h2>
              <div className="space-y-0">
                {renderEyeInputs('monocularSubjective', 'od', 'OD')}
                {renderEyeInputs('monocularSubjective', 'os', 'OS')}
              </div>
            </div>

            {/* Binocular Balance Section */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                Binocular Balance
              </h2>
              <div className="space-y-0">
                {renderEyeInputs('binocularBalance', 'od', 'OD')}
                {renderEyeInputs('binocularBalance', 'os', 'OS')}
                {renderEyeInputs('binocularBalance', 'ou', 'OU')}
              </div>
            </div>

            {/* Footer Note */}
            <div className="px-2">
              <p className="text-xs text-gray-500 italic">
                * Format: Sphere / Cylinder x Axis (e.g., -2.50 / -0.50 x 90)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-between px-6 pb-6">
            <div className="flex gap-3">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={onContinueLater}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Continue Later
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLastStep ? 'Submit Record' : 'Next Step'}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefractiveProcedureForm;