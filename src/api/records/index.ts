// api/record.ts
import apiClient from "../core/apiClient";
import { AxiosError } from "axios";
import type {
  PatientRecord,
  RecordListResponse,
  RecordResponse,
  DeleteRecordResponse,
} from "@/types/api/record";

// Custom error class for better error handling
export class RecordApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "RecordApiError";
  }
}

// Type-safe error handler
const handleRecordError = (e: unknown): never => {
  if (e instanceof AxiosError) {
    const errorData = e.response?.data as
      | { message?: string; error?: string; details?: unknown }
      | undefined;
    const errorMessage =
      errorData?.message || errorData?.error || "Something went wrong";
    const statusCode = e.response?.status;
    const details = errorData?.details;

    throw new RecordApiError(errorMessage, statusCode, details);
  }
  throw new RecordApiError("An unexpected error occurred");
};

export async function createRecord(
  data: Partial<PatientRecord>
) {
  try {
    const res = await apiClient.post<RecordResponse>(
      "/api/record/create-record",
      data
    );

    if (!res.data.success || !res.data.data) {
      throw new RecordApiError("Failed to create record - invalid response");
    }

    return res.data.data;
  } catch (e) {
    handleRecordError(e);
  }
}

export async function getAllRecords(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  try {
    const res = await apiClient.get<RecordListResponse>(
      "/api/record/get-all-records",
      { params }
    );

    if (!res.data.success) {
      throw new RecordApiError("Failed to fetch records - invalid response");
    }

    return res.data;
  } catch (e) {
    handleRecordError(e);
  }
}

export async function getRecordById(id: string) {
  try {
    if (!id || typeof id !== "string") {
      throw new RecordApiError("Invalid record ID provided");
    }

    const res = await apiClient.get<RecordResponse>(
      `/api/record/get-record-by-id/${id}`
    );

    if (!res.data.success || !res.data.data) {
      throw new RecordApiError("Failed to fetch record - invalid response");
    }

    return res.data.data;
  } catch (e) {
    handleRecordError(e);
  }
}

export async function updateRecord(
  id: string,
  data: Partial<PatientRecord>
) {
  try {
    if (!id || typeof id !== "string") {
      throw new RecordApiError("Invalid record ID provided");
    }

    const res = await apiClient.put<RecordResponse>(
      `/api/record/update-record/${id}`,
      data
    );

    if (!res.data.success || !res.data.data) {
      throw new RecordApiError("Failed to update record - invalid response");
    }

    return res.data.data;
  } catch (e) {
    handleRecordError(e);
  }
}

export async function deleteRecord(id: string): Promise<void> {
  try {

    if (!id || typeof id !== "string") {
      throw new RecordApiError("Invalid record ID provided");
    }

    const res = await apiClient.delete<DeleteRecordResponse>(
      `/api/record/delete-record/${id}`
    );

    if (!res.data.success) {
      throw new RecordApiError("Failed to delete record - invalid response");
    }

  } catch (e) {
    handleRecordError(e);
  }
}

export async function searchRecords(searchTerm: string) {
  try {
    if (!searchTerm || typeof searchTerm !== "string") {
      throw new RecordApiError("Invalid search term provided");
    }

    const res = await apiClient.get<RecordListResponse>(
      "/api/record/get-all-records",
      {
        params: { search: searchTerm, limit: 50 },
      }
    );

    if (!res.data.success) {
      throw new RecordApiError("Failed to search records - invalid response");
    }

    return res.data.data;
  } catch (e) {
    handleRecordError(e);
  }
}