
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
export interface RequestDto {
    method: Method;
    body: unknown;
}
export interface SuccessResponse<T> {
    success: boolean;
    data: T;
    message: string;
}
export interface ErrorResponse {
    success: boolean;
    error: unknown;
    message: string;
}

// export type Response = SuccessResponse<T> | ErrorResponse

// export interface AuthUser {
//     success: boolean;
//     message: string;
// }