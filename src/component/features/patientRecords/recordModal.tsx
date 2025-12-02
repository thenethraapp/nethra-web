import { useState, useEffect } from 'react';
import { X, Printer } from 'lucide-react';
import { toast } from 'react-toastify';
import { getRecordById } from '@/api/records/index';
import { PatientRecord } from '@/types/api/record';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PatientRecord | null;
}

const SkeletonLoader = () => (
  <div className="space-y-6 animate-pulse">
    {/* Patient Info Skeleton */}
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
      <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i}>
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-32"></div>
          </div>
        ))}
      </div>
    </div>

    {/* Chief Complaint Skeleton */}
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
      <div className="h-6 bg-gray-300 rounded w-56 mb-4"></div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i}>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-full max-w-md"></div>
          </div>
        ))}
      </div>
    </div>

    {/* Visual Acuity Skeleton */}
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
      <div className="h-6 bg-gray-300 rounded w-52 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i}>
            <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-40"></div>
              <div className="h-4 bg-gray-200 rounded w-36"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const RecordModal = ({ isOpen, onClose, record }: RecordModalProps) => {
  const [fullRecord, setFullRecord] = useState<PatientRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && record?._id) {
      fetchFullRecord(record._id);
    }
  }, [isOpen, record]);

  const fetchFullRecord = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await getRecordById(id);
      setFullRecord(data || null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch record details';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-primary-blue px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white">Patient Record</h2>
            <p className="text-primary-cyan text-sm mt-0.5">Detailed medical examination report</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200 hover:rotate-90"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-white">
          {isLoading ? (
            <SkeletonLoader />
          ) : fullRecord ? (
            <div className="space-y-6">
              {/* Patient Info Section */}
              <div className="bg-white rounded-xl p-6 border-2 border-[#0ab2e1]/20 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-8 bg-primary-cyan rounded-full"></div>
                  <h3 className="text-xl font-bold text-[#222222]">
                    Patient Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="group">
                    <p className="text-sm font-semibold text-[#030460] mb-1.5">Name</p>
                    <p className="text-base text-[#222222] font-medium">{fullRecord.patientName}</p>
                  </div>
                  <div className="group">
                    <p className="text-sm font-semibold text-[#030460] mb-1.5">Age</p>
                    <p className="text-base text-[#222222] font-medium">{fullRecord.age} years</p>
                  </div>
                  <div className="group">
                    <p className="text-sm font-semibold text-[#030460] mb-1.5">Phone</p>
                    <p className="text-base text-[#222222] font-medium">{fullRecord.phone || 'N/A'}</p>
                  </div>
                  <div className="group">
                    <p className="text-sm font-semibold text-[#030460] mb-1.5">Email</p>
                    <p className="text-base text-[#222222] font-medium break-all">{fullRecord.email || 'N/A'}</p>
                  </div>
                  <div className="group">
                    <p className="text-sm font-semibold text-[#030460] mb-1.5">Record ID</p>
                    <p className="text-sm text-[#222222] font-mono bg-[#facd0b]/10 px-3 py-1 rounded inline-block">
                      #{fullRecord._id?.slice(-8)}
                    </p>
                  </div>
                  <div className="group">
                    <p className="text-sm font-semibold text-[#030460] mb-1.5">Date Created</p>
                    <p className="text-base text-[#222222] font-medium">
                      {fullRecord.createdAt
                        ? new Date(fullRecord.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chief Complaint Section */}
              {fullRecord.chiefComplaint && (
                <div className="bg-primary-cyan/5 rounded-xl p-6 border-2 border-[#0ab2e1]/30 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 bg-[#0ab2e1] rounded-full"></div>
                    <h3 className="text-xl font-bold text-[#222222]">
                      Chief Complaint & History
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-[#030460] mb-1.5">Chief Complaint</p>
                      <p className="text-base text-[#222222] leading-relaxed">
                        {fullRecord.chiefComplaint.complaint || 'Not provided'}
                      </p>
                    </div>
                    {fullRecord.chiefComplaint.ocularHistory?.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-[#030460] mb-1.5">Ocular History</p>
                        <div className="flex flex-wrap gap-2">
                          {fullRecord.chiefComplaint.ocularHistory.map((item: string, idx: number) => (
                            <span key={idx} className="bg-[#0ab2e1]/20 text-[#222222] px-3 py-1 rounded-full text-sm font-medium">
                              {item}
                            </span>
                          ))}

                        </div>
                      </div>
                    )}
                    {fullRecord.chiefComplaint.allergies && (
                      <div>
                        <p className="text-sm font-semibold text-[#030460] mb-1.5">Allergies</p>
                        <p className="text-base text-[#222222] bg-red-50 border-l-4 border-red-400 px-4 py-2 rounded">
                          {fullRecord.chiefComplaint.allergies}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Visual Acuity Section */}
              {fullRecord.visualAcuity && (
                <div className="bg-primary-yellow/5 border border-primary-yellow/50 rounded-xl p-6  hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 bg-[#facd0b] rounded-full"></div>
                    <h3 className="text-xl font-bold text-[#222222]">
                      Visual Acuity Assessment
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4 border border-[#facd0b]/30">
                      <p className="text-base font-bold text-[#030460] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#0ab2e1] rounded-full"></span>
                        Right Eye (OD)
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm text-[#222222]">
                          <span className="font-semibold">Unaided @6m:</span> {fullRecord.visualAcuity.right?.unaided?.at6m || 'N/A'}
                        </p>
                        <p className="text-sm text-[#222222]">
                          <span className="font-semibold">Sphere:</span> {fullRecord.visualAcuity.right?.spectacle?.sphere || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-[#facd0b]/30">
                      <p className="text-base font-bold text-[#030460] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#0ab2e1] rounded-full"></span>
                        Left Eye (OS)
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm text-[#222222]">
                          <span className="font-semibold">Unaided @6m:</span> {fullRecord.visualAcuity.left?.unaided?.at6m || 'N/A'}
                        </p>
                        <p className="text-sm text-[#222222]">
                          <span className="font-semibold">Sphere:</span> {fullRecord.visualAcuity.left?.spectacle?.sphere || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Doctor's Observation */}
              {fullRecord.doctorObservation && Object.keys(fullRecord.doctorObservation).length > 0 && (
                <div className="bg-gradient-to-br from-[#030460]/5 to-[#030460]/10 rounded-xl p-6 border-2 border-[#030460]/30 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-8 bg-[#030460] rounded-full"></div>
                    <h3 className="text-xl font-bold text-[#222222]">
                      Doctor&apos;s Observations
                    </h3>
                  </div>
                  <p className="text-sm text-[#222222]/70">
                    Complete examination records available in system
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <X size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">Record not found</p>
              <p className="text-gray-400 text-sm mt-1">The requested patient record could not be loaded</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-t-2 border-[#0ab2e1]/20 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 text-[#222222] rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold hover:shadow-md"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-blue text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
          >
            <Printer size={18} />
            Print Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordModal;