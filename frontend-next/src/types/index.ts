export * from "./data-center";
export * from "./carbon-credit";
export * from "./heat-sink";
export * from "./prediction";

export interface PaginationRequest {
  page?: number;
  pageSize?: number;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ListResponse<T> {
  items: T[];
  pagination: PaginationMetadata;
}

export interface ApiError {
  code: string;
  message: string;
}
