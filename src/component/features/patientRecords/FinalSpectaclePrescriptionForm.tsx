import React, { useState } from 'react';

interface SpectaclePrescriptionData {
  od: {
    prescription: string;
    add: string;
  };
  os: {
    prescription: string;
    add: string;
  };
  pd: string;
  lensType: {
    primary: string;
    secondary: string;
  };
  segmentShape: {
    type: string;
    detail: string;
  };
  otherSpecifications: string;
  diagnosis: string;
}

const FinalSpectaclePrescriptionForm: React.FC = () => {
  const [formData, setFormData] = useState<SpectaclePrescriptionData>({
    od: {
      prescription: '',
      add: ''
    },
    os: {
      prescription: '',
      add: ''
    },
    pd: '',
    lensType: {
      primary: '',
      secondary: ''
    },
    segmentShape: {
      type: '',
      detail: ''
    },
    otherSpecifications: '',
    diagnosis: ''
  });

  const handleInputChange = (
    field: string,
    value: string,
    subField?: string
  ) => {
    if (subField) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field as keyof SpectaclePrescriptionData] as object,
          [subField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">FINAL SPECTACLE PRESCRIPTION</h1>
        </div>

        <div className="p-6 space-y-6">
          {/* OD (Right Eye) Section */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
              OD (Right Eye)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prescription (Sphere / Cylinder x Axis)
                </label>
                <input
                  type="text"
                  placeholder="e.g., +1.00 / -0.75 x 180"
                  value={formData.od.prescription}
                  onChange={(e) => handleInputChange('od', e.target.value, 'prescription')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ADD
                </label>
                <input
                  type="text"
                  placeholder="+2.00"
                  value={formData.od.add}
                  onChange={(e) => handleInputChange('od', e.target.value, 'add')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* OS (Left Eye) Section */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
              OS (Left Eye)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prescription (Sphere / Cylinder x Axis)
                </label>
                <input
                  type="text"
                  placeholder="e.g., +1.00 / -0.75 x 180"
                  value={formData.os.prescription}
                  onChange={(e) => handleInputChange('os', e.target.value, 'prescription')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ADD
                </label>
                <input
                  type="text"
                  placeholder="+2.00"
                  value={formData.os.add}
                  onChange={(e) => handleInputChange('os', e.target.value, 'add')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
              Additional Details
            </h2>
            <div className="space-y-4">
              {/* PD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PD (Pupillary Distance)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 63mm or 31/32"
                  value={formData.pd}
                  onChange={(e) => handleInputChange('pd', e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Lens Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lens Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="e.g., Single Vision"
                    value={formData.lensType.primary}
                    onChange={(e) => handleInputChange('lensType', e.target.value, 'primary')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="e.g., Progressive"
                    value={formData.lensType.secondary}
                    onChange={(e) => handleInputChange('lensType', e.target.value, 'secondary')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Segment Shape */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Segment Shape
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="e.g., D-Segment"
                    value={formData.segmentShape.type}
                    onChange={(e) => handleInputChange('segmentShape', e.target.value, 'type')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">with</span>
                    <input
                      type="text"
                      placeholder="Detail"
                      value={formData.segmentShape.detail}
                      onChange={(e) => handleInputChange('segmentShape', e.target.value, 'detail')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Other Specifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Specifications
                </label>
                <input
                  type="text"
                  placeholder="Any additional lens specifications"
                  value={formData.otherSpecifications}
                  onChange={(e) => handleInputChange('otherSpecifications', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Diagnosis Section */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
              DIAGNOSIS
            </h2>
            <textarea
              placeholder="Enter clinical diagnosis and notes..."
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
            />
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500 italic">
            * Ensure all measurements are accurate before finalizing the prescription
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinalSpectaclePrescriptionForm;