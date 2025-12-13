import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPatientHealthRecords } from '@/api/records';
import type { PatientRecord } from '@/types/api/record';
import { Calendar, FileText, User, Mail, Phone, Eye, Loader2, AlertCircle } from 'lucide-react';

const HealthRecords: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['patient-health-records', currentPage],
    queryFn: () => getPatientHealthRecords({ page: currentPage, limit }),
  });

  const records = data?.data || [];
  const pagination = data?.pagination;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  const formatDateTime = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return `${dateStr} • ${timeStr}`;
    } catch {
      return 'N/A';
    }
  };

  const getAuthorName = (record: PatientRecord): string => {
    if (typeof record.createdBy === 'object' && record.createdBy) {
      return record.createdBy.fullName || 'Unknown';
    }
    return 'Unknown';
  };

  const getAuthorType = (record: PatientRecord): string => {
    if (typeof record.createdBy === 'object' && record.createdBy) {
      // Check if it's an admin (you might need to adjust this based on your user model)
      // For now, we'll check the role from the user context or make an API call
      return 'Doctor'; // Default to Doctor, can be enhanced
    }
    return 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary-cyan mx-auto mb-4" size={32} />
          <p className="text-gray-600">Loading health records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle size={20} />
          <p>Failed to load health records. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6" style={{ borderColor: '#e5e5e5' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Health Records & Insights</h1>
            <p className="text-sm text-gray-600">
              View your complete medical history and examination records
            </p>
          </div>
        </div>
      </div>

      {/* Records List */}
      {records.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center" style={{ borderColor: '#e5e5e5' }}>
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Health Records Yet</h3>
          <p className="text-gray-600">
            Your health records will appear here once your optometrist creates them.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record._id}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
              style={{ borderColor: '#e5e5e5' }}
              onClick={() => setSelectedRecord(record)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary-cyan/10 rounded-full p-2">
                      <Eye className="text-primary-cyan" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Eye Examination Record
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(record.completedAt || record.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={16} />
                      <span>
                        <span className="font-medium">Patient:</span> {record.patientName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={16} />
                      <span>
                        <span className="font-medium">
                          {getAuthorType(record)}:
                        </span>{' '}
                        {getAuthorName(record)}
                      </span>
                    </div>
                    {record.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={16} />
                        <span>{record.email}</span>
                      </div>
                    )}
                    {record.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={16} />
                        <span>{record.phone}</span>
                      </div>
                    )}
                  </div>

                  {record.chiefComplaint?.complaint && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Chief Complaint:</span>{' '}
                        {record.chiefComplaint.complaint}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${record.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : record.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {record.status === 'completed' ? 'Completed' : record.status === 'draft' ? 'Draft' : 'Incomplete'}
                    </span>
                    {record.completedAt && (
                      <span className="text-xs text-gray-500">
                        Completed {formatDateTime(record.completedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {pagination.pages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(pagination.pages, prev + 1))}
            disabled={currentPage === pagination.pages}
            className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Record Details</h2>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient Name</p>
                    <p className="text-base font-medium text-gray-900">{selectedRecord.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="text-base font-medium text-gray-900">{selectedRecord.age}</p>
                  </div>
                  {selectedRecord.email && (
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-base font-medium text-gray-900">{selectedRecord.email}</p>
                    </div>
                  )}
                  {selectedRecord.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-base font-medium text-gray-900">{selectedRecord.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Author Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Created By</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">
                    {getAuthorType(selectedRecord)}
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {getAuthorName(selectedRecord)}
                  </p>
                  {selectedRecord.createdAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Created on {formatDateTime(selectedRecord.createdAt)}
                    </p>
                  )}
                </div>
              </div>

              {/* Chief Complaint */}
              {selectedRecord.chiefComplaint?.complaint && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Chief Complaint</h3>
                  <p className="text-base text-gray-700">{selectedRecord.chiefComplaint.complaint}</p>
                </div>
              )}

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${selectedRecord.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : selectedRecord.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {selectedRecord.status === 'completed' ? 'Completed' : selectedRecord.status === 'draft' ? 'Draft' : 'Incomplete'}
                </span>
                {selectedRecord.completedAt && (
                  <p className="text-sm text-gray-500 mt-2">
                    Completed on {formatDateTime(selectedRecord.completedAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRecords;
