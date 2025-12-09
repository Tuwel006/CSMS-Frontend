export interface ApiResponse<T = any> {
  status: string;
  code: string;
  message: string;
  data?: T;
  error?: any;
}