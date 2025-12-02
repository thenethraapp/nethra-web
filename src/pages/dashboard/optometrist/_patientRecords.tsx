import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import PatientBiometric from '@/component/features/patientRecords/biometric';
import ChiefComplaints from '@/component/features/patientRecords/chiefComplaint';
import VisualAcuityForm from '@/component/features/patientRecords/VisualAcuityForm';
import InternalExamination from '@/component/features/patientRecords/InternalExamination';
import PatientRecordsTable from '@/component/features/patientRecords/patientRecordsTable';
import RefractiveProcedureForm from '@/component/features/patientRecords/refractiveProcedure';
import DoctorObservationExam from '@/component/features/patientRecords/doctorObservationAndExamination';
import { Plus, FileEdit, Loader2 } from 'lucide-react';
import { usePatientRecordStore } from '@/store/usePatientRecordStore';
import SuccessModal from '@/component/features/patientRecords/SuccessModal';
import { getAllRecords, createRecord, updateRecord } from '@/api/records';
import type { PatientRecord } from '@/types/api/record';

// Query keys for React Query
const QUERY_KEYS = {
  allRecords: ['patient-records'] as const,
  incompleteRecords: ['patient-records', 'incomplete'] as const,
} as const;

// Type for step components with proper typing
interface StepComponentProps {
  onNext: (stepData: unknown) => void | Promise<void>;
  onPrevious?: () => void;
  onContinueLater: () => void | Promise<void>;
  initialData: unknown;
}

type StepComponent = React.ComponentType<StepComponentProps>;

interface Step {
  component: StepComponent;
  title: string;
}

const PatientRecords: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    currentStep,
    formData,
    showForm,
    showSuccessModal,
    setCurrentStep,
    updateFormData,
    resetForm,
    setShowSuccessModal,
    setShowForm
  } = usePatientRecordStore();

  // Fetch incomplete records using React Query
  const {
    data: incompleteRecordsData,
    isLoading: isLoadingIncompleteRecords,
    error: incompleteRecordsError
  } = useQuery({
    queryKey: QUERY_KEYS.incompleteRecords,
    queryFn: async () => {
      const response = await getAllRecords({ status: 'draft' });
      return response?.data?.filter((record: PatientRecord) => record.status === 'draft') || [];
    },
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

  const incompleteRecords = incompleteRecordsData ?? [];

  // Mutation for saving draft
  const saveDraftMutation = useMutation({
    mutationFn: async (data: Partial<PatientRecord>) => {
      if (data._id) {
        return await updateRecord(data._id, { ...data, status: 'draft' });
      } else {
        return await createRecord({ ...data, status: 'draft' });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.incompleteRecords });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allRecords });
      toast.success('Progress saved successfully');
      setShowForm(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save progress');
    }
  });

  // Mutation for submitting record
  const submitRecordMutation = useMutation({
    mutationFn: async (data: Partial<PatientRecord>) => {
      if (data._id) {
        return await updateRecord(data._id, { ...data, status: 'completed' });
      } else {
        return await createRecord({ ...data, status: 'completed' });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.incompleteRecords });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allRecords });
      setShowSuccessModal(true);
      setShowForm(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit record');
    }
  });

  const handleNewRecord = (): void => {
    resetForm();
    setShowForm(true);
  };

  const handleCompleteRecord = (record: PatientRecord): void => {
    // Use the loadRecord action from the store
    usePatientRecordStore.getState().loadRecord(record);
    setShowForm(true);
  };

  const handleContinueLater = async (): Promise<void> => {
    const recordData: Partial<PatientRecord> = {
      ...formData,
      status: 'draft'
    } as Partial<PatientRecord>;

    await saveDraftMutation.mutateAsync(recordData);
  };


  // @ts-expect-error -- stepData type varies per step
  const handleNext = async (stepData) => {
    updateFormData(currentStep, stepData);

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step - submit the form
      const recordData: Partial<PatientRecord> = {
        ...formData,
        ...stepData,
        status: 'completed'
      } as Partial<PatientRecord>;

      await submitRecordMutation.mutateAsync(recordData);
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      component: PatientBiometric,
      title: 'Patient Information'
    },
    {
      component: ChiefComplaints,
      title: 'Chief Complaint'
    },
    {
      component: VisualAcuityForm,
      title: 'Visual Acuity'
    },
    {
      component: DoctorObservationExam,
      title: 'Doctor Observation'
    },
    {
      component: InternalExamination,
      title: 'Internal Examination'
    },
    {
      component: RefractiveProcedureForm,
      title: 'Refractive Procedure'
    }
  ];

  const CurrentStepComponent = steps[currentStep].component;

  // Get initial data for current step
  const getInitialDataForStep = (step: number): unknown => {
    const stepKeys = [
      'biometric',
      'chiefComplaint',
      'visualAcuity',
      'doctorObservation',
      'internalExamination',
      'refractiveProcedure'
    ] as const;

    const stepKey = stepKeys[step] as keyof typeof formData;
    return (formData[stepKey] as unknown) || {};
  };

  // Show error state if incomplete records failed to load
  if (incompleteRecordsError) {
    toast.error('Failed to load incomplete records');
  }

  return (
    <section className=''>
      <header className='bg-white p-6 shadow rounded-lg mb-6'>
        <div className="w-full mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-primary-cyan">
                Manage Patient Records
              </h1>
              <p className="text-xs text-darkgray">
                View, manage, and track patient examination records
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isLoadingIncompleteRecords ? (
                <div className="flex items-center gap-1.5 text-darkgray">
                  <Loader2 size={12} className="animate-spin" />
                  <span className="text-xs">Loading drafts...</span>
                </div>
              ) : (
                incompleteRecords.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {incompleteRecords.map((record) => (
                      <button
                        key={record._id}
                        onClick={() => handleCompleteRecord(record)}
                        className="text-[10px] flex items-center gap-1 p-1.5 px-2 rounded font-medium text-darkgray cursor-pointer transition-colors shadow-sm hover:shadow-md bg-primary-yellow hover:brightness-95"
                      >
                        <FileEdit size={11} />
                        {record.patientName}&apos;s Record
                      </button>
                    ))}
                  </div>
                )
              )}
              <button
                onClick={handleNewRecord}
                className="text-xs flex items-center gap-1.5 p-1.5 px-3 rounded font-medium text-white cursor-pointer transition-colors shadow-sm hover:shadow-md bg-primary-blue hover:brightness-110"
              >
                <Plus size={14} />
                New Record
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Only show table when form is not visible */}
      {!showForm && (
        <section className='bg-white shadow rounded-lg p-6'>
          <PatientRecordsTable
            onRecordUpdate={() => {
              queryClient.invalidateQueries({ queryKey: QUERY_KEYS.incompleteRecords });
              queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allRecords });
            }}
          />
        </section>
      )}

      {showForm && (
        <section className="mt-2">
          <div className="max-w-6xl mx-auto px-2">
            {/* Progress Indicator */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm font-semibold text-primary-blue">
                  {steps[currentStep].title}
                </h3>
                <span className="text-xs text-darkgray">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <div className="w-full rounded-full bg-gray-200 h-1">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-primary-blue"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Step Component */}
            <CurrentStepComponent
              onNext={handleNext}
              onPrevious={currentStep > 0 ? handlePrevious : undefined}
              onContinueLater={handleContinueLater}
              // @ts-expect-error -- initialData type varies per step
              initialData={getInitialDataForStep(currentStep)}
            />

            {/* Loading overlay for mutations */}
            {(saveDraftMutation.isPending || submitRecordMutation.isPending) && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-4 flex items-center gap-2">
                  <Loader2 className="animate-spin text-primary-cyan" size={18} />
                  <span className="text-sm text-darkgray">
                    {saveDraftMutation.isPending ? 'Saving draft...' : 'Submitting record...'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onNewRecord={() => {
          setShowSuccessModal(false);
          resetForm();
          handleNewRecord();
        }}
      />
    </section>
  );
};

export default PatientRecords;