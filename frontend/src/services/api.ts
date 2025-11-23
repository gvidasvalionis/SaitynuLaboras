import axios, { AxiosError } from 'axios';
import type {
    User,
    LoginCredentials,
    RegisterData,
    TokenResponse,
    Strategy,
    CreateStrategyData,
    Team,
    Driver,
    GrandPrix,
} from '../types';

const API_BASE_UR = "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_BASE_UR,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // If 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await api.post<TokenResponse>(
                        '/auth/refresh',
                        { refresh_token: refreshToken }
                    );

                    const { access_token } = response.data;
                    localStorage.setItem('access_token', access_token);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, clear tokens and redirect to login
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
)

// Auth Services
export const authService = {
    async login(credentials: LoginCredentials): Promise<TokenResponse> {
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await api.post<TokenResponse>('/auth/token', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // Store tokens
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);

        return response.data;
    },

    async register(data: RegisterData): Promise<User> {
        const response = await api.post<User>('/users/', data);
        return response.data;
    },

    async logout(): Promise<void> {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            try {
                await api.post('/auth/logout', { refresh_token: refreshToken });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get<User>('/users/me');
        return response.data;
    },

    async refreshToken(): Promise<TokenResponse> {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await api.post<TokenResponse>('/auth/refresh', {
            refresh_token: refreshToken,
        });

        localStorage.setItem('access_token', response.data.access_token);
        return response.data;
    },
};

// Strategy Services
export const strategyService = {
    async getAllPublic(): Promise<Strategy[]> {
        const response = await api.get<Strategy[]>('/strategies/public');
        return response.data;
    },

    async getAll(): Promise<Strategy[]> {
        const response = await api.get<Strategy[]>('/strategies/');
        return response.data;
    },

    async getByUserAll(): Promise<Strategy[]> {
        const response = await api.get<Strategy[]>('/strategies/by-user-all');
        return response.data;
    },

    async getByIdUser(id: number): Promise<Strategy> {
        const response = await api.get<Strategy>(`/strategies/me/${id}`);
        return response.data;
    },

    async getById(id: number): Promise<Strategy> {
        const response = await api.get<Strategy>(`/strategies/${id}`);
        return response.data;
    },

    async create(data: CreateStrategyData): Promise<Strategy> {
        const response = await api.post<Strategy>('/strategies/me', data);
        return response.data;
    },

    async update(id: number, data: Partial<CreateStrategyData>): Promise<Strategy> {
        const response = await api.put<Strategy>(`/strategies/me/${id}`, data);
        return response.data;
    },

    async deleteUser(id: number): Promise<void> {
        await api.delete(`/strategies/me/${id}`);
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/strategies/${id}`);
    },

    async approve(id: number): Promise<Strategy> {
        const response = await api.put<Strategy>(`/strategies/${id}/approve`);
        return response.data;
    },
};

// Team Services
export const teamService = {
    async getAll(): Promise<Team[]> {
        const response = await api.get<Team[]>('/teams/');
        return response.data;
    },

    async getById(id: number): Promise<Team> {
        const response = await api.get<Team>(`/teams/${id}`);
        return response.data;
    },

    async create(name: string): Promise<Team> {
        const response = await api.post<Team>('/teams/', { name });
        return response.data;
    },

    async update(id: number, name: string): Promise<Team> {
        const response = await api.put<Team>(`/teams/${id}`, { name });
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/teams/${id}`);
    },
};

// Driver Services
export const driverService = {
    async getAll(): Promise<Driver[]> {
        const response = await api.get<Driver[]>('/drivers/');
        return response.data;
    },

    async getById(id: number): Promise<Driver> {
        const response = await api.get<Driver>(`/drivers/${id}`);
        return response.data;
    },

    async create(data: { name: string; surname: string; team_id: number }): Promise<Driver> {
        const response = await api.post<Driver>('/drivers/', data);
        return response.data;
    },

    async update(id: number, data: { name?: string; surname?: string; team_id?: number }): Promise<Driver> {
        const response = await api.put<Driver>(`/drivers/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/drivers/${id}`);
    },
};

// Grand Prix Services
export const grandPrixService = {
    async getAll(): Promise<GrandPrix[]> {
        const response = await api.get<GrandPrix[]>('/grand_prix/');
        return response.data;
    },

    async getById(id: number): Promise<GrandPrix> {
        const response = await api.get<GrandPrix>(`/grand_prix/${id}`);
        return response.data;
    },

    async create(data: { name: string; year: number }): Promise<GrandPrix> {
        const response = await api.post<GrandPrix>('/grand_prix/', data);
        return response.data;
    },

    async update(id: number, data: { name?: string; year?: number }): Promise<GrandPrix> {
        const response = await api.put<GrandPrix>(`/grand_prix/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/grand_prix/${id}`);
    },
};

export default api;