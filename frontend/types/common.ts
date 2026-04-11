
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
export interface RequestDto {
    method: Method;
    body: unknown | FormData;
}
export interface SuccessResponse<T> {
    success: boolean;
    data: T;
    message: string;
    timestamp?: string;
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