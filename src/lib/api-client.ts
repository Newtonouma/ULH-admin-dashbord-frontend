// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      CHANGE_PASSWORD: '/auth/change-password',
    },
    USERS: {
      ME: '/auth/me',
    },
    CAUSES: '/causes',
    EVENTS: '/events',
    TEAMS: '/teams',
    GALLERY: '/gallery',
    DONATIONS: '/donations',
    HEALTH: '/health',
  },
};

// Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Token management
class TokenManager {
  private static ACCESS_TOKEN_KEY = 'ul_access_token';
  private static REFRESH_TOKEN_KEY = 'ul_refresh_token';

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static hasValidTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }
}

// Main API Client
class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getAccessToken();

    const config: RequestInit = {
      ...options,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    // Only set Content-Type to application/json if body is not FormData
    if (!(options.body instanceof FormData)) {
      config.headers = {
        'Content-Type': 'application/json',
        ...config.headers,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401 && token) {
        return this.handleTokenRefresh(endpoint, options);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'An error occurred',
          statusCode: response.status,
        }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      // Handle empty responses (like DELETE operations)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  private async handleTokenRefresh<T>(
    endpoint: string,
    originalOptions: RequestInit
  ): Promise<T> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then((token) => {
        return this.request(endpoint, {
          ...originalOptions,
          headers: {
            ...originalOptions.headers,
            Authorization: `Bearer ${token}`,
          },
        });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = TokenManager.getRefreshToken();
      console.log('Token refresh: Starting refresh with token:', refreshToken ? 'exists' : 'missing');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('Token refresh: Calling refresh endpoint...');
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      console.log('Token refresh: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Token refresh: Error response:', errorText);
        throw new Error(`Token refresh failed: ${response.status} - ${errorText}`);
      }

      const tokens: AuthTokens = await response.json();
      console.log('Token refresh: Success, got new tokens');
      TokenManager.setTokens(tokens);

      this.processQueue(tokens.accessToken, null);

      return this.request(endpoint, {
        ...originalOptions,
        headers: {
          ...originalOptions.headers,
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
    } catch (error) {
      console.log('Token refresh: Failed with error:', error);
      this.processQueue(null, error);
      TokenManager.clearTokens();
      
      // Redirect to login if we're in the browser and not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        console.log('Token refresh failed - redirecting to login');
        // Show user-friendly message
        alert('Your session has expired. Please log in again.');
        window.location.href = '/login';
      }
      
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(token: string | null, error: any) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (token) {
        resolve(token);
      } else {
        reject(error);
      }
    });
    this.failedQueue = [];
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
    
    TokenManager.setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    
    return response;
  }

  async register(data: RegisterData): Promise<void> {
    await this.request(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
      });
    } finally {
      TokenManager.clearTokens();
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.request(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async forgotPassword(email: string): Promise<void> {
    await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async getCurrentUser(): Promise<{ id: string; username: string; email: string }> {
    return this.get(API_CONFIG.ENDPOINTS.USERS.ME);
  }

  // Generic CRUD methods
  async validateToken(): Promise<boolean> {
    try {
      // Don't catch all errors - let token refresh happen naturally
      await this.get('/causes');
      return true;
    } catch (error) {
      // Only return false for non-auth errors or after refresh fails
      if (error instanceof Error && error.message.includes('Authentication failed')) {
        return false;
      }
      // For other errors, still consider token potentially valid
      // (might be network issues, backend down, etc.)
      return false;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request<T>(endpoint, {
      method: 'POST',
      body,
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body,
    });
  }

  async delete(endpoint: string): Promise<void> {
    await this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return TokenManager.hasValidTokens();
  }

  // Clear authentication
  clearAuth(): void {
    TokenManager.clearTokens();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export { TokenManager };