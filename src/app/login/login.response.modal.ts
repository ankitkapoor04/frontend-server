export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    username: string;
    role: string;
}