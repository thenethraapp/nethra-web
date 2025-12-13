// store/patientRecordStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PatientRecord } from '@/types/api/record';

interface EyeData {
  value: string;
  remark: string;
}

interface VisualAcuityEye {
  unaided: { at6m: string; at04m: string };
  supplementary: { ph: string };
  spectacle: {
    sphere: string;
    cylinder: string;
    axis: string;
    va6m: string;
    add: string;
    va04m: string;
    tint: string;
  };
}

interface RefractiveProcedureEye {
  prescription: string;
  va: string;
}

interface ChiefComplaintData {
  complaint: string;
  lastEyeExam?: string;
  lastMedicalExam?: string;
  ocularHistory: string[];
  ocularHistoryOther: string;
  hasMedicalConditions?: boolean;
  medicalConditions: string[];
  medicalConditionsOther: string;
  hasFamilyOcular?: boolean;
  familyOcular: string[];
  familyOcularOther: string;
  hasFamilyMedical?: boolean;
  familyMedical: string[];
  familyMedicalOther: string;
  allergies: string;
  additionalInfo: string;
}

interface VisualAcuityData {
  right: VisualAcuityEye;
  left: VisualAcuityEye;
}

interface RefractiveProcedureData {
  retinoscopy: {
    od: RefractiveProcedureEye;
    os: RefractiveProcedureEye;
  };
  monocularSubjective: {
    od: RefractiveProcedureEye;
    os: RefractiveProcedureEye;
  };
  binocularBalance: {
    od: RefractiveProcedureEye;
    os: RefractiveProcedureEye;
    ou: RefractiveProcedureEye;
  };
}

type DoctorObservationData = Record<string, { OD: EyeData; OS: EyeData }>;
type InternalExaminationData = Record<string, { od: EyeData; os: EyeData }>;

// Initial data structures
const initialChiefComplaint: ChiefComplaintData = {
  complaint: '',
  lastEyeExam: '',
  lastMedicalExam: '',
  ocularHistory: [],
  ocularHistoryOther: '',
  hasMedicalConditions: undefined,
  medicalConditions: [],
  medicalConditionsOther: '',
  hasFamilyOcular: undefined,
  familyOcular: [],
  familyOcularOther: '',
  hasFamilyMedical: undefined,
  familyMedical: [],
  familyMedicalOther: '',
  allergies: '',
  additionalInfo: ''
};

const initialVisualAcuityEye: VisualAcuityEye = {
  unaided: { at6m: '', at04m: '' },
  supplementary: { ph: '' },
  spectacle: {
    sphere: '',
    cylinder: '',
    axis: '',
    va6m: '',
    add: '',
    va04m: '',
    tint: ''
  }
};

const initialVisualAcuity: VisualAcuityData = {
  right: initialVisualAcuityEye,
  left: initialVisualAcuityEye
};

const initialRefractiveProcedureEye: RefractiveProcedureEye = {
  prescription: '',
  va: ''
};

const initialRefractiveProcedure: RefractiveProcedureData = {
  retinoscopy: {
    od: initialRefractiveProcedureEye,
    os: initialRefractiveProcedureEye
  },
  monocularSubjective: {
    od: initialRefractiveProcedureEye,
    os: initialRefractiveProcedureEye
  },
  binocularBalance: {
    od: initialRefractiveProcedureEye,
    os: initialRefractiveProcedureEye,
    ou: initialRefractiveProcedureEye
  }
};

// Form data structure that matches PatientRecord
interface FormData {
  _id?: string;
  patientName: string;
  patientId?: string; // For registered patients
  isRegisteredPatient?: boolean;
  age: number;
  phone: string;
  email: string;
  chiefComplaint: ChiefComplaintData;
  visualAcuity: VisualAcuityData;
  doctorObservation: DoctorObservationData;
  internalExamination: InternalExaminationData;
  refractiveProcedure: RefractiveProcedureData;
}

const initialFormData: FormData = {
  patientName: '',
  patientId: undefined,
  isRegisteredPatient: false,
  age: 0,
  phone: '',
  email: '',
  chiefComplaint: initialChiefComplaint,
  visualAcuity: initialVisualAcuity,
  doctorObservation: {},
  internalExamination: {},
  refractiveProcedure: initialRefractiveProcedure
};

interface PatientRecordStoreState {
  currentStep: number;
  formData: FormData;
  showForm: boolean;
  showSuccessModal: boolean;
  // These are kept in sync with formData for convenient access
  doctorObservation: DoctorObservationData;
  internalExamination: InternalExaminationData;
  refractiveProcedure: RefractiveProcedureData;
  visualAcuity: VisualAcuityData;
  chiefComplaint: ChiefComplaintData;

  // Actions
  setCurrentStep: (step: number) => void;
  updateFormData: (step: number | string, data: Partial<FormData> | Record<string, unknown>) => void;
  updateDoctorObservation: (data: Partial<DoctorObservationData>) => void;
  updateInternalExamination: (data: Partial<InternalExaminationData>) => void;
  updateRefractiveProcedure: (data: Partial<RefractiveProcedureData>) => void;
  resetForm: () => void;
  setShowSuccessModal: (show: boolean) => void;
  setShowForm: (show: boolean) => void;
  loadRecord: (record: PatientRecord) => void;
}

export const usePatientRecordStore = create<PatientRecordStoreState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      formData: initialFormData,
      showForm: false,
      showSuccessModal: false,
      // Initialize convenience properties
      doctorObservation: initialFormData.doctorObservation,
      internalExamination: initialFormData.internalExamination,
      refractiveProcedure: initialFormData.refractiveProcedure,
      visualAcuity: initialFormData.visualAcuity,
      chiefComplaint: initialFormData.chiefComplaint,

      setCurrentStep: (step: number): void => {
        set({ currentStep: step });
      },

      updateFormData: (step: number | string, data: Partial<FormData> | Record<string, unknown>): void => {
        const state = get();

        // Handle numeric step indices
        if (typeof step === 'number') {
          const stepKeys = [
            'biometric',
            'chiefComplaint',
            'visualAcuity',
            'doctorObservation',
            'internalExamination',
            'refractiveProcedure'
          ];
          const stepKey = stepKeys[step];

          if (step === 0) {
            // Handle biometric data
            const updatedFormData = {
              ...state.formData,
              patientName: (data as { patientName?: string }).patientName ?? state.formData.patientName,
              patientId: (data as { patientId?: string }).patientId ?? state.formData.patientId,
              isRegisteredPatient: (data as { isRegisteredPatient?: boolean }).isRegisteredPatient ?? state.formData.isRegisteredPatient,
              age: (data as { age?: number | string }).age
                ? parseInt(String((data as { age?: number | string }).age))
                : state.formData.age,
              phone: (data as { phone?: string }).phone ?? state.formData.phone,
              email: (data as { email?: string }).email ?? state.formData.email,
            };
            set({
              formData: updatedFormData
            });
          } else {
            const updatedFormData = {
              ...state.formData,
              [stepKey]: data
            };
            const syncUpdate: Partial<PatientRecordStoreState> = {
              formData: updatedFormData
            };
            // Sync convenience properties based on what was updated
            if (stepKey === 'doctorObservation') {
              syncUpdate.doctorObservation = data as DoctorObservationData;
            } else if (stepKey === 'internalExamination') {
              syncUpdate.internalExamination = data as InternalExaminationData;
            } else if (stepKey === 'refractiveProcedure') {
              syncUpdate.refractiveProcedure = data as RefractiveProcedureData;
            } else if (stepKey === 'visualAcuity') {
              syncUpdate.visualAcuity = data as VisualAcuityData;
            } else if (stepKey === 'chiefComplaint') {
              syncUpdate.chiefComplaint = data as ChiefComplaintData;
            }
            set(syncUpdate);
          }
        }
        // Handle direct property updates (for _id and other fields)
        else if (typeof step === 'string') {
          const updatedFormData = {
            ...state.formData,
            [step]: data
          };
          const syncUpdate: Partial<PatientRecordStoreState> = {
            formData: updatedFormData
          };
          // Sync convenience properties if the step is one of them
          if (step === 'doctorObservation') {
            syncUpdate.doctorObservation = data as DoctorObservationData;
          } else if (step === 'internalExamination') {
            syncUpdate.internalExamination = data as InternalExaminationData;
          } else if (step === 'refractiveProcedure') {
            syncUpdate.refractiveProcedure = data as RefractiveProcedureData;
          } else if (step === 'visualAcuity') {
            syncUpdate.visualAcuity = data as VisualAcuityData;
          } else if (step === 'chiefComplaint') {
            syncUpdate.chiefComplaint = data as ChiefComplaintData;
          }
          set(syncUpdate);
        }
      },

      updateDoctorObservation: (data: Partial<DoctorObservationData>): void => {
        const state = get();
        const updatedDoctorObservation = {
          ...state.formData.doctorObservation,
          ...data
        };
        set({
          formData: {
            ...state.formData,
            // @ts-expect-error - Type issue
            doctorObservation: updatedDoctorObservation
          },
          // @ts-expect-error - Type issu
          doctorObservation: updatedDoctorObservation
        });
      },

      updateInternalExamination: (data: Partial<InternalExaminationData>): void => {
        const state = get();
        const updatedInternalExamination = {
          ...state.formData.internalExamination,
          ...data
        };
        set({
          formData: {
            ...state.formData,
            // @ts-expect-error - Type issue
            internalExamination: updatedInternalExamination
          },
          // @ts-expect-error - Type issue
          internalExamination: updatedInternalExamination
        });
      },

      updateRefractiveProcedure: (data: Partial<RefractiveProcedureData>): void => {
        const state = get();
        const updatedRefractiveProcedure = {
          ...state.formData.refractiveProcedure,
          ...data
        };
        set({
          formData: {
            ...state.formData,
            refractiveProcedure: updatedRefractiveProcedure
          },
          refractiveProcedure: updatedRefractiveProcedure
        });
      },

      loadRecord: (record: PatientRecord): void => {
        const loadedFormData = {
          _id: record._id,
          patientName: record.patientName,
          patientId: record.patientId,
          isRegisteredPatient: record.isRegisteredPatient ?? false,
          age: record.age,
          phone: record.phone ?? '',
          email: record.email ?? '',
          chiefComplaint: record.chiefComplaint,
          visualAcuity: record.visualAcuity,
          doctorObservation: record.doctorObservation,
          internalExamination: record.internalExamination,
          refractiveProcedure: record.refractiveProcedure
        };
        set({
          // @ts-expect-error - Type issue
          formData: loadedFormData,
          doctorObservation: loadedFormData.doctorObservation,
          internalExamination: loadedFormData.internalExamination,
          refractiveProcedure: loadedFormData.refractiveProcedure,
          visualAcuity: loadedFormData.visualAcuity,
          // @ts-expect-error - Type issue
          chiefComplaint: loadedFormData.chiefComplaint,
          currentStep: 0,
          showForm: true
        });
      },

      resetForm: (): void => {
        set({
          currentStep: 0,
          formData: initialFormData,
          doctorObservation: initialFormData.doctorObservation,
          internalExamination: initialFormData.internalExamination,
          refractiveProcedure: initialFormData.refractiveProcedure,
          visualAcuity: initialFormData.visualAcuity,
          chiefComplaint: initialFormData.chiefComplaint,
          showForm: false,
          showSuccessModal: false
        });
      },

      setShowSuccessModal: (show: boolean): void => {
        set({ showSuccessModal: show });
      },

      setShowForm: (show: boolean): void => {
        set({ showForm: show });
      }
    }),
    {
      name: 'patient-record-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData,
        showForm: state.showForm
      }),
      merge: (persistedState, currentState) => {
        // @ts-expect-error - Type issue
        const merged = { ...currentState, ...persistedState };
        // Sync convenience properties with formData after rehydration
        if (merged.formData) {
          merged.doctorObservation = merged.formData.doctorObservation ?? initialFormData.doctorObservation;
          merged.internalExamination = merged.formData.internalExamination ?? initialFormData.internalExamination;
          merged.refractiveProcedure = merged.formData.refractiveProcedure ?? initialFormData.refractiveProcedure;
          merged.visualAcuity = merged.formData.visualAcuity ?? initialFormData.visualAcuity;
          merged.chiefComplaint = merged.formData.chiefComplaint ?? initialFormData.chiefComplaint;
        }
        return merged;
      }
    }
  )
);

// Export types for use in components
export type {
  VisualAcuityData,
  ChiefComplaintData,
  RefractiveProcedureData,
  DoctorObservationData,
  InternalExaminationData,
  EyeData,
  VisualAcuityEye,
  RefractiveProcedureEye
};

// Export selector functions for reactive data access
export const useDoctorObservation = () => usePatientRecordStore((state) => state.formData.doctorObservation);
export const useInternalExamination = () => usePatientRecordStore((state) => state.formData.internalExamination);
export const useRefractiveProcedure = () => usePatientRecordStore((state) => state.formData.refractiveProcedure);
export const useVisualAcuity = () => usePatientRecordStore((state) => state.formData.visualAcuity);
export const useChiefComplaint = () => usePatientRecordStore((state) => state.formData.chiefComplaint);