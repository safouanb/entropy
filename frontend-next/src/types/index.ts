export * from "./data-center";
export * from "./carbon-credit";
export * from "./heat-sink";
export * from "./prediction";

export interface PaginationRequest {
  page?: number;
  page_size?: number;
}

export interface PaginationMetadata {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ListResponse<T> {
  items: T[];
  pagination: PaginationMetadata;
}

export interface ApiError {
  code: string;
  message: string;
}
