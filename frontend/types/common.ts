
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
export interface RequestDto {
    method: Method;
    body: unknown;
}
export interface SuccessResponse {
    success: boolean;
    data: unknown;
    message: string;
}
export interface ErrorResponse {
    success: boolean;
    error: unknown;
    message: string;
}

export type Response = SuccessResponse | ErrorResponse