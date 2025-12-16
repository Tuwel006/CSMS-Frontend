import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { ApiResponse } from '../types/api';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async get<T>(path: string, params?: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.get(path, { params });
    return response.data;
  }

  async post<T>(path: string, body?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    console.log(body);
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.post(path, body, config);
    console.log(response.data);
    return response.data;
  }

  async put<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.put(path, body);
    return response.data;
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.delete(path);
    return response.data;
  }

  async patch<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.patch(path, body);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;