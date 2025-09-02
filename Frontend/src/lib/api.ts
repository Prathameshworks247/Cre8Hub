const API_BASE_URL = import.meta.env.VITE_API_URL ;

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle backend error response format
        if (data.error && typeof data.error === 'object' && data.error.message) {
          return {
            error: data.error.message,
          };
        }
        return {
          error: data.error || data.message || 'An error occurred',
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication endpoints
  async signIn(email: string, password: string) {
    return this.request('/users/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signUp(email: string, password: string, name: string) {
    return this.request('/users/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName: name }),
    });
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return { error: 'No refresh token available' };
    }

    return this.request('/users/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout() {
    return this.request('/users/logout', {
      method: 'POST',
    });
  }

  // User profile endpoints
  async getCurrentUser() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateRoleSpecificProfile(roleData: any) {
    return this.request('/users/profile/role-specific', {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
  }
  // Persona endpoints
  async extractPersonaFromYouTube(channelId: string) {
    return this.request('/youtube/extract-persona', {
      method: 'POST',
      body: JSON.stringify({ channelId }),
    });
  }

  async saveManualPersona(persona: any) {
    return this.request('/youtube/manual-persona', {
      method: 'POST',
      body: JSON.stringify({ persona }),
    });
  }
  async updatePersona(personaData: any) {
    return this.request('/users/persona', {
      method: 'PUT',
      body: JSON.stringify(personaData),
    });
  }

  async addPastOutput(outputData: any) {
    return this.request('/users/past-outputs', {
      method: 'POST',
      body: JSON.stringify(outputData),
    });
  }

  async deleteUserAccount() {
    return this.request('/users/account', {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService(API_BASE_URL);
