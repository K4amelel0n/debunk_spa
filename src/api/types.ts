export type ApiErrorDetails = {
  code?: string;
  message: string;
  details?: any;
};

export interface HttpErrorResponse {
  success: false;
  message?: string;
  data?: undefined;
  error: ApiErrorDetails;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiErrorDetails;
}
