// component/patientRecords/InternalExamination.tsx
import React, { useCallback } from 'react';
import { Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { usePatientRecordStore } from '@/store/usePatientRecordStore';

interface ExaminationFieldValue {
  value: string;
  remark: string;
}

interface ExaminationFieldData {
  od: ExaminationFieldValue;
  os: ExaminationFieldValue;
}

interface InternalExaminationProps {
  onNext: (isLast?: boolean) => void;
  onBack?: () => void;
  onContinueLater: () => void;
  isSubmitting?: boolean;
}

type EyeType = 'od' | 'os';

const EXAMINATION_FIELDS = [
  'Lens',
  'Vitreous',
  'Disc',
  'Elsc. Type',
  'C/D Ratio',
  'Depth Of Cup',
  'Colour',
  'Lamina',
  'Margin',
  'Calibre Ratio',
  'Course',
  'A–V Crossings',
  'Spon. Ven. Pulse',
  'Macular Area',
  'Fovea Reflex',
  'Periphery'
] as const;

type ExaminationField = typeof EXAMINATION_FIELDS[number];

const EXAMINATION_OPTIONS = ['Normal', 'Abnormal', 'Not Observed'] as const;
type ExaminationOption = typeof EXAMINATION_OPTIONS[number];

const InternalExamination = ({
  onNext,
  onBack,
  onContinueLater,
  isSubmitting = false
}: InternalExaminationProps) => {
  const { internalExamination, updateInternalExamination } = usePatientRecordStore();

  const getFieldData = useCallback(
    (field: ExaminationField, eye: EyeType): ExaminationFieldValue => {
      const fieldData = internalExamination[field];
      if (!fieldData || typeof fieldData !== 'object') {
        return { value: '', remark: '' };
      }

      const eyeData = fieldData[eye];
      if (!eyeData || typeof eyeData !== 'object') {
        return { value: '', remark: '' };
      }

      return {
        value: typeof eyeData.value === 'string' ? eyeData.value : '',
        remark: typeof eyeData.remark === 'string' ? eyeData.remark : ''
      };
    },
    [internalExamination]
  );

  const handleSelectChange = useCallback(
    (field: ExaminationField, eye: EyeType, value: string): void => {
      if (!EXAMINATION_OPTIONS.includes(value as ExaminationOption) && value !== '') {
        console.warn(`Invalid examination option: ${value}`);
        return;
      }

      const currentFieldData = internalExamination[field] || {
        od: { value: '', remark: '' },
        os: { value: '', remark: '' }
      };

      const currentEyeData = currentFieldData[eye] || { value: '', remark: '' };

      const shouldClearRemark = value !== 'Abnormal';

      updateInternalExamination({
        [field]: {
          ...currentFieldData,
          [eye]: {
            value: value,
            remark: shouldClearRemark ? '' : currentEyeData.remark
          }
        }
      });
    },
    [internalExamination, updateInternalExamination]
  );

  const handleRemarkChange = useCallback(
    (field: ExaminationField, eye: EyeType, remark: string): void => {
      const currentFieldData = internalExamination[field] || {
        od: { value: '', remark: '' },
        os: { value: '', remark: '' }
      };

      const currentEyeData = currentFieldData[eye] || { value: '', remark: '' };

      if (currentEyeData.value !== 'Abnormal') {
        console.warn(`Cannot add remark when field value is not 'Abnormal'`);
        return;
      }

      updateInternalExamination({
        [field]: {
          ...currentFieldData,
          [eye]: {
            ...currentEyeData,
            remark: remark
          }
        }
      });
    },
    [internalExamination, updateInternalExamination]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onNext();
  };

  const handleReset = (): void => {
    const resetData: Record<ExaminationField, ExaminationFieldData> =
      EXAMINATION_FIELDS.reduce((acc, field) => {
        acc[field] = {
          od: { value: '', remark: '' },
          os: { value: '', remark: '' }
        };
        return acc;
      }, {} as Record<ExaminationField, ExaminationFieldData>);

    updateInternalExamination(resetData);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Internal Examination</h2>
            <p className="text-sm text-gray-600">Detailed internal eye examination findings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-r border-gray-200 w-1/4">
                    Field
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-r border-gray-200 w-3/8">
                    OD (Right Eye)
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200 w-3/8">
                    OS (Left Eye)
                  </th>
                </tr>
              </thead>
              <tbody>
                {EXAMINATION_FIELDS.map((field, index) => {
                  const odData = getFieldData(field, 'od');
                  const osData = getFieldData(field, 'os');

                  return (
                    <tr
                      key={field}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 border-b border-r border-gray-200">
                        {field}
                      </td>

                      {/* OD Column */}
                      <td className="px-4 py-3 border-b border-r border-gray-200">
                        <div className="space-y-2">
                          <select
                            value={odData.value}
                            onChange={(e) => handleSelectChange(field, 'od', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            aria-label={`${field} OD examination value`}
                          >
                            <option value="">Select...</option>
                            {EXAMINATION_OPTIONS.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          {odData.value === 'Abnormal' && (
                            <input
                              type="text"
                              placeholder="Remarks..."
                              value={odData.remark}
                              onChange={(e) => handleRemarkChange(field, 'od', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              aria-label={`${field} OD remarks`}
                            />
                          )}
                        </div>
                      </td>

                      {/* OS Column */}
                      <td className="px-4 py-3 border-b border-gray-200">
                        <div className="space-y-2">
                          <select
                            value={osData.value}
                            onChange={(e) => handleSelectChange(field, 'os', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            aria-label={`${field} OS examination value`}
                          >
                            <option value="">Select...</option>
                            {EXAMINATION_OPTIONS.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          {osData.value === 'Abnormal' && (
                            <input
                              type="text"
                              placeholder="Remarks..."
                              value={osData.remark}
                              onChange={(e) => handleRemarkChange(field, 'os', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              aria-label={`${field} OS remarks`}
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

          <div className="mt-4 text-sm text-gray-600">
            <p className="italic">* Select {'"Abnormal"'} to add remarks for specific findings</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  aria-label="Go back to previous step"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={onContinueLater}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                aria-label="Save progress and continue later"
              >
                Continue Later
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                aria-label="Clear all form fields"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Proceed to next step"
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

export default InternalExamination;