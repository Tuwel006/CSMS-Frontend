export interface ApiResponse<T> {
  status: number;
  message: string;
  code: string;
  data?: T;
  error?: string;
}