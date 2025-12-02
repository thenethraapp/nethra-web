// components/patientRecords/patientRecordsTable.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Trash2, Loader2, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';
import RecordModal from './recordModal';
// import ConfirmationModal from '../modals/confirmationModal';
import ConfirmationModal from '@/component/common/modals/confirmationModal';
import { getAllRecords, deleteRecord } from '@/api/records/index';
import type { PatientRecord } from '@/types/api/record';

// Query keys
const QUERY_KEYS = {
  records: (page: number, limit: number, search: string) =>
    ['patient-records', { page, limit, search }] as const,
} as const;

interface PatientRecordsTableProps {
  onRecordUpdate?: () => void;
}

interface DeleteConfirmation {
  isOpen: boolean;
  recordId: string | null;
  patientName: string;
}

const PatientRecordsTable: React.FC<PatientRecordsTableProps> = ({ onRecordUpdate }) => {
  const queryClient = useQueryClient();

  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    recordId: null,
    patientName: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  });

  // Debounce search term
  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  });

  // Fetch records with React Query
  const {
    data: recordsData,
    isLoading,
    isFetching,
    error
  } = useQuery({
    queryKey: QUERY_KEYS.records(pagination.page, pagination.limit, debouncedSearchTerm),
    queryFn: async () => {
      const response = await getAllRecords({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearchTerm || undefined,
        status: 'completed' // Only show completed records in the table
      });
      return response;
    },
    staleTime: 30000, // 30 seconds
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });

  const records = recordsData?.data ?? [];
  const paginationInfo = recordsData?.pagination ?? {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (recordId: string) => {
      await deleteRecord(recordId);
    },
    onSuccess: () => {
      // Invalidate and refetch records
      queryClient.invalidateQueries({
        queryKey: ['patient-records']
      });

      // Call parent callback if provided
      onRecordUpdate?.();

      toast.success('Record deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete record');
    }
  });

  const handleViewRecord = (record: PatientRecord): void => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleDeleteClick = (id: string, patientName: string): void => {
    setDeleteConfirmation({
      isOpen: true,
      recordId: id,
      patientName
    });
  };

  const handleConfirmDelete = async (): Promise<void> => {
    const { recordId } = deleteConfirmation;

    if (!recordId) return;

    // Close modal first
    setDeleteConfirmation({
      isOpen: false,
      recordId: null,
      patientName: ''
    });

    // Execute deletion
    await deleteMutation.mutateAsync(recordId);
  };

  const handleCancelDelete = (): void => {
    setDeleteConfirmation({
      isOpen: false,
      recordId: null,
      patientName: ''
    });
  };

  const handlePageChange = (newPage: number): void => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = (): void => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';

    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="w-full p-6 text-center">
        <div className="text-red-600 mb-2">Failed to load patient records</div>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['patient-records'] })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <RecordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        record={selectedRecord}
      />

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete Patient Record"
        message={`Are you sure you want to delete the record for ${deleteConfirmation.patientName}? This action cannot be undone.`}
        confirmText="Delete Record"
        cancelText="Cancel"
        variant="danger"
      />

      <div className="w-full">
        {/* Search Bar */}
        <div className="mb-3">
          <div className="relative max-w-md ">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Search size={14} style={{ color: '#0ab2e1' }} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by patient name..."
              className="w-full pl-8 pr-8 py-1.5 text-xs rounded-full border focus:outline-none focus:ring-1 transition-colors"
              style={{ borderColor: '#e5e5e5' }}
              onFocus={(e) => e.target.style.borderColor = '#0ab2e1'}
              onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-2 flex items-center"
              >
                <X size={14} style={{ color: '#222222' }} />
              </button>
            )}
          </div>
          {isFetching && (
            <div className="mt-1 text-xs flex items-center gap-1.5" style={{ color: '#222222' }}>
              <Loader2 size={12} className="animate-spin" style={{ color: '#0ab2e1' }} />
              Searching...
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className='bg-primary-blue overflow-hidden'>
              <tr>
                <th className="text-left py-3.5 px-3 text-xs  font-semibold text-white">
                  Date Created
                </th>
                <th className="text-left py-3.5 px-3 text-xs  font-semibold text-white">
                  Patient Name
                </th>
                <th className="text-left py-3.5 px-3 text-xs  font-semibold text-white">
                  Age
                </th>
                <th className="text-left py-3.5 px-3 text-xs  font-semibold text-white">
                  Phone Number
                </th>
                <th className="text-left py-3.5 px-3 text-xs  font-semibold text-white">
                  Email
                </th>
                <th className="text-left py-3.5 px-3 text-xs  font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ borderTop: 'none' }}>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#0ab2e1' }} />
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center">
                    <p className="text-xs" style={{ color: '#222222' }}>
                      {debouncedSearchTerm
                        ? `No records found matching "${debouncedSearchTerm}"`
                        : 'No patient records found'}
                    </p>
                  </td>
                </tr>
              ) : (
                records.map((record, idx) => (
                  <tr
                    key={record._id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9f9f9',
                      borderBottom: '1px solid #e5e5e5'
                    }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <td className="px-3 py-2 text-xs" style={{ color: '#222222' }}>
                      {formatDate(record.createdAt)}
                    </td>
                    <td className="px-3 py-2 text-xs font-medium" style={{ color: '#030460' }}>
                      {record.patientName}
                    </td>
                    <td className="px-3 py-2 text-xs" style={{ color: '#222222' }}>
                      {record.age}
                    </td>
                    <td className="px-3 py-2 text-xs" style={{ color: '#222222' }}>
                      {record.phone || 'N/A'}
                    </td>
                    <td className="px-3 py-2 text-xs" style={{ color: '#222222' }}>
                      {record.email || 'N/A'}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleViewRecord(record)}
                          className="flex items-center gap-0.5 px-2 py-1 text-xs rounded font-medium text-white transition-opacity hover:opacity-80"
                          style={{ backgroundColor: '#0ab2e1' }}
                          aria-label={`View record for ${record.patientName}`}
                        >
                          <Eye size={12} />
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteClick(record._id!, record.patientName)}
                          disabled={deleteMutation.isPending && deleteConfirmation.recordId === record._id}
                          className="flex items-center gap-0.5 px-2 py-1 text-xs font-medium text-white rounded transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: '#dc2626' }}
                          aria-label={`Delete record for ${record.patientName}`}
                        >
                          {deleteMutation.isPending && deleteConfirmation.recordId === record._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {paginationInfo.pages > 1 && (
          <div className="px-3 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #e5e5e5' }}>
            <div className="text-xs" style={{ color: '#222222' }}>
              Showing {((paginationInfo.page - 1) * paginationInfo.limit) + 1} to{' '}
              {Math.min(paginationInfo.page * paginationInfo.limit, paginationInfo.total)} of{' '}
              {paginationInfo.total} records
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => handlePageChange(paginationInfo.page - 1)}
                disabled={paginationInfo.page === 1 || isFetching}
                className="px-3 py-1 text-xs font-medium rounded transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#f5f5f5', color: '#222222', border: '1px solid #e5e5e5' }}
              >
                Previous
              </button>
              <div className="flex items-center px-2 py-1 text-xs" style={{ color: '#222222' }}>
                Page {paginationInfo.page} of {paginationInfo.pages}
              </div>
              <button
                onClick={() => handlePageChange(paginationInfo.page + 1)}
                disabled={paginationInfo.page === paginationInfo.pages || isFetching}
                className="px-3 py-1 text-xs font-medium rounded transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#f5f5f5', color: '#222222', border: '1px solid #e5e5e5' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PatientRecordsTable;