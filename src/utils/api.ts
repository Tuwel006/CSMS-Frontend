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

  /**
   * Dynamic Event Stream Handler
   * @param path - API endpoint path
   * @param options - Configuration options for the event stream
   * @returns Object with close method to terminate the stream
   * 
   * @example
   * const stream = apiClient.event('/matches/123/live-score', {
   *   onMessage: (data) => console.log('Received:', data),
   *   onError: (error) => console.error('Error:', error),
   *   onComplete: () => console.log('Stream ended')
   * });
   * 
   * // Later, to close the stream:
   * stream.close();
   */
  event<T = any>(
    path: string,
    options: {
      params?: Record<string, any>;
      onMessage?: (data: T, rawEvent?: MessageEvent) => void;
      onError?: (error: { message: string; event?: Event }) => void;
      onComplete?: () => void;
      onOpen?: () => void;
    } = {}
  ): { close: () => void; eventSource: EventSource } {
    const { params, onMessage, onError, onComplete, onOpen } = options;

    // Build URL with base URL and query parameters
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    let url = `${baseURL}${path.startsWith('/') ? path : `/${path}`}`;

    // Add query parameters if provided
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Add auth token to URL if available
    const token = localStorage.getItem('authToken');
    if (token) {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}token=${encodeURIComponent(token)}`;
    }

    // Create EventSource
    const eventSource = new EventSource(url, { withCredentials: true });

    // Handle connection open
    if (onOpen) {
      eventSource.addEventListener('open', () => {
        console.log('[SSE Debug] EventSource opened:', url);
        onOpen();
      });
    }

    // Handle incoming messages
    eventSource.addEventListener('message', (event: MessageEvent) => {
      console.log('[SSE Debug] Standard message received:', event.data);
      if (onMessage) {
        try {
          // Try to parse as JSON
          const data = JSON.parse(event.data) as T;
          onMessage(data, event);
        } catch (error) {
          // If not JSON, pass raw data
          onMessage(event.data as T, event);
        }
      }
    });

    // Handle custom event types (e.g., 'update', 'score', etc.)
    // This allows the server to send different event types
    const customEventHandler = (event: MessageEvent) => {
      if (onMessage) {
        try {
          const data = JSON.parse(event.data) as T;
          onMessage(data, event);
        } catch (error) {
          onMessage(event.data as T, event);
        }
      }
    };

    // Listen for common custom event types
    ['update', 'score', 'data', 'notification', 'status', 'live-score', 'match-update'].forEach((eventType) => {
      eventSource.addEventListener(eventType, (event) => {
        console.log(`[SSE Debug] Received Custom Event (${eventType}):`, event.data);
        customEventHandler(event);
      });
    });

    // Add a general message listener log
    eventSource.onmessage = (event) => {
      console.log('[SSE Debug] onmessage handler triggered:', event.data);
    };

    // Handle errors
    eventSource.addEventListener('error', (event: Event) => {
      console.error('[SSE Debug] SSE Error Event:', event);
      if (onError) {
        const errorMessage = eventSource.readyState === EventSource.CLOSED
          ? 'Connection closed'
          : 'Connection error occurred';

        onError({
          message: errorMessage,
          event,
        });
      }

      // Auto-close on error
      if (eventSource.readyState === EventSource.CLOSED) {
        eventSource.close();
        if (onComplete) {
          onComplete();
        }
      }
    });

    // Return control object
    return {
      close: () => {
        eventSource.close();
        if (onComplete) {
          onComplete();
        }
      },
      eventSource,
    };
  }
}

/**
 * Route helper for SSE endpoints
 * @param matchId - The match ID
 * @returns The SSE endpoint path
 */
export const routes = {
  sse: {
    liveScore: (matchId: string) => `/sse/score/${matchId}`,
  },
};

export const apiClient = new ApiClient();
export default apiClient;