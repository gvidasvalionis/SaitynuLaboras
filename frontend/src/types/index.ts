export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface Team {
    id: number;
    name: string;
}

export interface Driver {
    id: number;
    name: string;
    surname: string;
    team_id: number;
}

export interface GrandPrix {
    id: number;
    name: string;
    year: number;
}

export interface PitStop {
    lap: number;
    tire: string;
    fuel?: string;
}

export interface StrategyParameters {
    pit_stops: PitStop[];
    fuel_load?: number;
    fuel_strategy?: Record<string, number>;
    tire_strategy?: string;
    fuel_mode?: string;
}

export interface Strategy {
    id: number;
    name: string;
    description: string;
    parameters: StrategyParameters;
    approved: boolean;
    grand_prix_id: number;
    driver_id: number;
    user_id: number;
    team_id: number;
}

export interface CreateStrategyData {
    name: string;
    description: string;
    parameters: StrategyParameters;
    grand_prix_id: number;
    driver_id: number;
    team_id: number;
}