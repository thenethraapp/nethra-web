// types/record.types.ts
export interface EyeData {
  value: string;
  remark: string;
}

export interface EyeDataPair {
  OD: EyeData;
  OS: EyeData;
}

export interface VisualAcuityEye {
  unaided: {
    at6m: string;
    at04m: string;
  };
  supplementary: {
    ph: string;
  };
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

export interface RefractiveProcedureEye {
  prescription: string;
  va: string;
}

export interface ChiefComplaint {
  complaint: string;
  lastEyeExam?: Date | string;
  lastMedicalExam?: Date | string;
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

export interface VisualAcuity {
  right: VisualAcuityEye;
  left: VisualAcuityEye;
}

export interface DoctorObservation {
  [key: string]: EyeDataPair;
}

export interface InternalExamination {
  [key: string]: {
    od: EyeData;
    os: EyeData;
  };
}

export interface RefractiveProcedure {
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

export interface PatientRecord {
  _id?: string;
  patientName: string;
  patientId?: string; // Reference to registered patient (if applicable)
  isRegisteredPatient?: boolean; // Flag indicating if patient is registered
  age: number;
  phone?: string;
  email?: string;
  chiefComplaint: ChiefComplaint;
  visualAcuity: VisualAcuity;
  doctorObservation: DoctorObservation;
  internalExamination: InternalExamination;
  refractiveProcedure: RefractiveProcedure;
  status?: "completed" | "incomplete" | "draft";
  completedAt?: string;
  createdBy?: string | {
    _id: string;
    fullName?: string;
    email?: string;
    certificateType?: string;
    idNumber?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface RecordListResponse {
  success: boolean;
  data: PatientRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface RecordResponse {
  success: boolean;
  data: PatientRecord;
  message?: string;
}

export interface DeleteRecordResponse {
  success: boolean;
  message: string;
  data: Record<string, never>;
}