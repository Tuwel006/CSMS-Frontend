import apiClient from '../utils/api';
import { ApiResponse } from '../types/api';
import { LoginData, SignupData, AuthResponse } from '../types/authService';

export class AuthService {
  private static readonly REDIRECT_URI = import.meta.env.VITE_OAUTH_REDIRECT_URI || 'http://localhost:5173/auth/callback';

  static async login(data: LoginData): Promise<ApiResponse<AuthResponse['data']>> {
    return apiClient.post<AuthResponse['data']>('user/auth/login', data);
  }

  static async signup(data: SignupData): Promise<ApiResponse<AuthResponse['data']>> {
    return apiClient.post<AuthResponse['data']>('user/auth/signup', data);
  }

  static initiateGoogleAuth(): void {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (clientId) {
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: this.REDIRECT_URI,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent'
      });
      
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    } else {
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/google`;
    }
  }

  static initiateMicrosoftAuth(): void {
    const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
    
    if (clientId) {
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: this.REDIRECT_URI,
        response_type: 'code',
        scope: 'openid email profile',
        response_mode: 'query'
      });
      
      window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
    } else {
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/microsoft`;
    }
  }

  static initiateFacebookAuth(): void {
    const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
    
    if (appId) {
      const params = new URLSearchParams({
        client_id: appId,
        redirect_uri: this.REDIRECT_URI,
        response_type: 'code',
        scope: 'email,public_profile'
      });
      
      window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
    } else {
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/facebook`;
    }
  }
}

export default AuthService;