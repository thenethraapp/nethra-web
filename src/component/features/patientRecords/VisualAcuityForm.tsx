// component/patientRecords/VisualAcuityForm.tsx
import { Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { usePatientRecordStore } from '@/store/usePatientRecordStore';
import type { VisualAcuityData } from '@/store/usePatientRecordStore';

interface VisualAcuityFormProps {
  onNext: (stepData: VisualAcuityData) => void | Promise<void>;
  onPrevious?: () => void;
  onContinueLater: () => void | Promise<void>;
  initialData: VisualAcuityData;
}

const VisualAcuityForm = ({
  onNext,
  onPrevious,
  onContinueLater,
  initialData
}: VisualAcuityFormProps) => {
  const { formData, updateFormData } = usePatientRecordStore();

  // Use initialData as fallback if store data is empty
  const visualAcuity = formData.visualAcuity || initialData;

  // Dropdown options
  const vaOptions = ['—', '6/6', '6/9', '6/12', '6/18', '6/24', '6/36', '6/60', '6/90', 'CF', 'HM', 'PL', 'NPL'];
  const sphereOptions = ['—', 'Plano', '+0.25', '+0.50', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00', '+3.50', '+4.00', '+5.00', '+6.00', '-0.25', '-0.50', '-0.75', '-1.00', '-1.25', '-1.50', '-1.75', '-2.00', '-2.50', '-3.00', '-4.00', '-5.00', '-6.00', '-8.00', '-10.00'];
  const cylinderOptions = ['—', 'DS', '+0.25', '+0.50', '+0.75', '+1.00', '+1.25', '+1.50', '+2.00', '-0.25', '-0.50', '-0.75', '-1.00', '-1.25', '-1.50', '-2.00', '-2.50', '-3.00', '-4.00'];
  const axisOptions = ['—', '0°', '5°', '10°', '15°', '20°', '25°', '30°', '35°', '40°', '45°', '60°', '75°', '90°', '105°', '120°', '135°', '150°', '165°', '180°'];
  const addOptions = ['—', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00', '+3.50'];
  const phOptions = ['—', 'Improved', 'No Change', 'N/A'];
  const tintOptions = ['—', 'None', 'Gray', 'Brown', 'Green', 'Blue', 'Photochromic', 'Polarized'];

  const handleChange = (eye: 'right' | 'left', category: 'unaided' | 'supplementary' | 'spectacle', field: string, value: string) => {
    const updatedVisualAcuity: VisualAcuityData = {
      ...visualAcuity,
      [eye]: {
        ...visualAcuity[eye],
        [category]: {
          ...visualAcuity[eye][category],
          ...(field === 'sphere' || field === 'cylinder' || field === 'axis' || field === 'va6m' || field === 'add' || field === 'va04m' || field === 'tint' || field === 'at6m' || field === 'at04m' || field === 'ph'
            ? { [field]: value }
            : {})
        }
      }
    };

    // updateFormData(2, updatedVisualAcuity as Record<string, unknown>);
    updateFormData(2, updatedVisualAcuity as unknown as Record<string, unknown>);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(visualAcuity);
  };

  const handleReset = () => {
    const emptyVisualAcuity: VisualAcuityData = {
      right: {
        unaided: { at6m: '', at04m: '' },
        supplementary: { ph: '' },
        spectacle: {
          sphere: '', cylinder: '', axis: '',
          va6m: '', add: '', va04m: '', tint: ''
        }
      },
      left: {
        unaided: { at6m: '', at04m: '' },
        supplementary: { ph: '' },
        spectacle: {
          sphere: '', cylinder: '', axis: '',
          va6m: '', add: '', va04m: '', tint: ''
        }
      }
    };
    updateFormData(2, { visualAcuity: emptyVisualAcuity });
  };

  // Safe value getter with fallbacks
  const getValue = (eye: 'right' | 'left', category: 'unaided' | 'supplementary' | 'spectacle', field: string): string => {
    const eyeData = visualAcuity[eye];
    if (!eyeData || !eyeData[category]) return '';
    const categoryData = eyeData[category];
    if (typeof categoryData === 'object' && field in categoryData) {
      return String(categoryData[field as keyof typeof categoryData] || '');
    }
    return '';
  };

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-3" style={{ borderColor: '#e5e5e5' }}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded" style={{ backgroundColor: '#e8f4f8' }}>
            <Eye className="w-4 h-4" style={{ color: '#0ab2e1' }} />
          </div>
          <div>
            <h2 className="text-sm font-bold" style={{ color: '#030460' }}>Visual Acuity Assessment</h2>
            <p className="text-xs" style={{ color: '#222222' }}>Complete visual acuity measurements for both eyes</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main Assessment Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Eye</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700" colSpan={2}>Unaided</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700" colSpan={1}>Supplementary</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700" colSpan={7}>With Spectacle Prescription</th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-600"></th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-600">@6m</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-600">@0.4m</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-600">PH</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-600">Sphere</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-600">Cylinder</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-600">Axis</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-600">VA @6m</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-600">ADD</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-600">VA @0.4m</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-600">Tint</th>
                </tr>
              </thead>
              <tbody>
                {/* Right Eye Row */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">Right</td>

                  {/* Unaided */}
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('right', 'unaided', 'at6m')}
                      onChange={(e) => handleChange('right', 'unaided', 'at6m', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {vaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('right', 'unaided', 'at04m')}
                      onChange={(e) => handleChange('right', 'unaided', 'at04m', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {vaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>

                  {/* Supplementary */}
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('right', 'supplementary', 'ph')}
                      onChange={(e) => handleChange('right', 'supplementary', 'ph', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {phOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>

                  {/* Spectacle */}
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('right', 'spectacle', 'sphere')}
                      onChange={(e) => handleChange('right', 'spectacle', 'sphere', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {sphereOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('right', 'spectacle', 'cylinder')}
                      onChange={(e) => handleChange('right', 'spectacle', 'cylinder', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {cylinderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('right', 'spectacle', 'axis')}
                      onChange={(e) => handleChange('right', 'spectacle', 'axis', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {axisOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('right', 'spectacle', 'va6m')}
                      onChange={(e) => handleChange('right', 'spectacle', 'va6m', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {vaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('right', 'spectacle', 'add')}
                      onChange={(e) => handleChange('right', 'spectacle', 'add', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {addOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('right', 'spectacle', 'va04m')}
                      onChange={(e) => handleChange('right', 'spectacle', 'va04m', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {vaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('right', 'spectacle', 'tint')}
                      onChange={(e) => handleChange('right', 'spectacle', 'tint', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {tintOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                </tr>

                {/* Left Eye Row */}
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">Left</td>

                  {/* Unaided */}
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('left', 'unaided', 'at6m')}
                      onChange={(e) => handleChange('left', 'unaided', 'at6m', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {vaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('left', 'unaided', 'at04m')}
                      onChange={(e) => handleChange('left', 'unaided', 'at04m', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {vaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>

                  {/* Supplementary */}
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('left', 'supplementary', 'ph')}
                      onChange={(e) => handleChange('left', 'supplementary', 'ph', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {phOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>

                  {/* Spectacle */}
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('left', 'spectacle', 'sphere')}
                      onChange={(e) => handleChange('left', 'spectacle', 'sphere', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {sphereOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('left', 'spectacle', 'cylinder')}
                      onChange={(e) => handleChange('left', 'spectacle', 'cylinder', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {cylinderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('left', 'spectacle', 'axis')}
                      onChange={(e) => handleChange('left', 'spectacle', 'axis', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {axisOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('left', 'spectacle', 'va6m')}
                      onChange={(e) => handleChange('left', 'spectacle', 'va6m', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {vaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('left', 'spectacle', 'add')}
                      onChange={(e) => handleChange('left', 'spectacle', 'add', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {addOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('left', 'spectacle', 'va04m')}
                      onChange={(e) => handleChange('left', 'spectacle', 'va04m', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {vaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      value={getValue('left', 'spectacle', 'tint')}
                      onChange={(e) => handleChange('left', 'spectacle', 'tint', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {tintOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]" style={{ color: '#222222' }}>
            <div>
              <p className="font-medium mb-0.5">Visual Acuity Abbreviations:</p>
              <p>CF = Counting Fingers, HM = Hand Movement, PL = Perception of Light, NPL = No Perception of Light</p>
            </div>
            <div>
              <p className="font-medium mb-0.5">Prescription Notes:</p>
              <p>DS = Diopter Sphere, PH = Pinhole, ADD = Reading Addition</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-between mt-3 pt-3 border-t" style={{ borderColor: '#e5e5e5' }}>
            <div className="flex gap-2">
              {onPrevious && (
                <button
                  type="button"
                  onClick={onPrevious}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer"
                  style={{ backgroundColor: '#f5f5f5', color: '#222222' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={onContinueLater}
                className="px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer"
                style={{ backgroundColor: '#f5f5f5', color: '#222222' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              >
                Continue Later
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer"
                style={{ backgroundColor: '#f9f9f9', color: '#222222' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e5e5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
              >
                Clear Form
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white rounded transition-colors cursor-pointer"
                style={{ backgroundColor: '#030460' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#050680'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#030460'}
              >
                Next Step
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisualAcuityForm;