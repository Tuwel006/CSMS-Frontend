export interface ApiResponse<T = any> {
  status: number;
  code: string;
  message: string;
  data?: T;
  error?: any;
}