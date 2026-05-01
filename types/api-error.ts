export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

export type SuccessResponse<T> = {
  status: 'success'
  data: T
}

export type ErrorResponse = {
  status: 'error'
  error: {
    message: string
  }
}
