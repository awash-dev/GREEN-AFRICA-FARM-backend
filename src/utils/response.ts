import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

export function successResponse<T>(res: Response, data: T, message?: string, statusCode = 200) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  };
  return res.status(statusCode).json(response);
}

export function errorResponse(res: Response, error: string, statusCode = 400) {
  const response: ApiResponse<null> = {
    success: false,
    error
  };
  return res.status(statusCode).json(response);
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
  return res.status(200).json(response);
}
