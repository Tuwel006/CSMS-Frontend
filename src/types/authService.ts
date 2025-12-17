export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  status: number;
  code: string;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      name?: string;
    }
  }
}
