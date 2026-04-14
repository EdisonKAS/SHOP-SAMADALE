// api.ts
// API Type Definitions

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export interface ApiError {
    code: number;
    message: string;
    details?: any;
}

export interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{
                text: string;
            }>
        };
    }>
}

export interface ExchangeRateResponse {
    rate: number;
    timestamp: string;
}