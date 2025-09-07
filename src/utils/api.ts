import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

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

  async get<T>(path: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(path, { params });
    return response.data;
  }

  async post<T>(path: string, body?: any, config?: AxiosRequestConfig): Promise<T> {
    console.log(body);
    const response: AxiosResponse<T> = await this.instance.post(path, body, config);
    console.log(response.data);
    return response.data;
  }

  async put<T>(path: string, body?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(path, body);
    return response.data;
  }

  async delete<T>(path: string): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(path);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;