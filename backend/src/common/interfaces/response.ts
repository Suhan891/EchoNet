export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  timestamp: string;
}

export interface ExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}
