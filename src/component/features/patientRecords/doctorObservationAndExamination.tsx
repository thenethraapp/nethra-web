// component/patientRecords/doctorObservationAndExamination.tsx
import React from 'react';
import { Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { usePatientRecordStore } from '@/store/usePatientRecordStore';

interface DoctorObservationExamProps {
  onNext: (isLast?: boolean) => void;
  onBack?: () => void;
  onContinueLater: () => void;
  isSubmitting?: boolean;
}

interface EyeObservation {
  value: string;
  remark: string;
}

interface FieldObservation {
  OD: EyeObservation;
  OS: EyeObservation;
}

type DoctorObservationData = Record<string, FieldObservation>;

const DoctorObservationExam = ({ onNext, onBack, onContinueLater, isSubmitting }: DoctorObservationExamProps) => {
  const { doctorObservation, updateDoctorObservation } = usePatientRecordStore();

  const fields = [
    'General appearance',
    'Lids & margins',
    'Bulba Margins',
    'bulbar conjunctiva',
    'Palpebral conjunctiva',
    'Limbus',
    'Cornea',
    'Iris',
    'AC Angle',
    'Pupil shape',
    'Pupil Size',
    'Pupillary reflex – Direct',
    'Pupillary reflex – Consensual',
    'Pupillary reflex – Near',
    'Ocular Tension',
    'Confrontation Fields'
  ] as const;

  const options = ['Normal', 'Abnormal', 'Not Observed'] as const;

  const handleObservationChange = (field: string, eye: 'OD' | 'OS', value: string) => {
    const currentFieldData = doctorObservation[field] || { OD: { value: '', remark: '' }, OS: { value: '', remark: '' } };
    const currentEyeData = currentFieldData[eye] || { value: '', remark: '' };

    updateDoctorObservation({
      [field]: {
        ...currentFieldData,
        [eye]: {
          value,
          remark: value === 'Abnormal' ? currentEyeData.remark : ''
        }
      }
    });
  };

  const handleRemarkChange = (field: string, eye: 'OD' | 'OS', remark: string) => {
    const currentFieldData = doctorObservation[field] || { OD: { value: '', remark: '' }, OS: { value: '', remark: '' } };
    const currentEyeData = currentFieldData[eye] || { value: '', remark: '' };

    updateDoctorObservation({
      [field]: {
        ...currentFieldData,
        [eye]: {
          ...currentEyeData,
          remark
        }
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleReset = () => {
    // Reset all fields to empty with proper typing
    const resetData: DoctorObservationData = fields.reduce((acc, field) => {
      acc[field] = {
        OD: { value: '', remark: '' },
        OS: { value: '', remark: '' }
      };
      return acc;
    }, {} as DoctorObservationData);

    updateDoctorObservation(resetData);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800">
              {"Doctor's"} Observation & Examination
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200 w-1/3">
                    Field
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 w-1/3">
                    OD (Right Eye)
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 w-1/3">
                    OS (Left Eye)
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {fields.map((field, index) => {
                  const fieldData = doctorObservation[field] || { OD: { value: '', remark: '' }, OS: { value: '', remark: '' } };

                  return (
                    <tr key={field} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                        {field}
                      </td>

                      {/* OD (Right Eye) */}
                      <td className="px-4 py-3 border-r border-gray-200">
                        <div className="flex flex-col space-y-2">
                          <select
                            value={fieldData.OD?.value || ''}
                            onChange={(e) => handleObservationChange(field, 'OD', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select</option>
                            {options.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          {fieldData.OD?.value === 'Abnormal' && (
                            <input
                              type="text"
                              placeholder="Remarks..."
                              value={fieldData.OD?.remark || ''}
                              onChange={(e) => handleRemarkChange(field, 'OD', e.target.value)}
                              className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            />
                          )}
                        </div>
                      </td>

                      {/* OS (Left Eye) */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col space-y-2">
                          <select
                            value={fieldData.OS?.value || ''}
                            onChange={(e) => handleObservationChange(field, 'OS', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select</option>
                            {options.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          {fieldData.OS?.value === 'Abnormal' && (
                            <input
                              type="text"
                              placeholder="Remarks..."
                              value={fieldData.OS?.remark || ''}
                              onChange={(e) => handleRemarkChange(field, 'OS', e.target.value)}
                              className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-between p-6 border-t border-gray-200">
            <div className="flex gap-3">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={onContinueLater}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
              >
                Continue Later
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium cursor-pointer"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorObservationExam;