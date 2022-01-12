
export const httpStatusResponse = (
  response, code: number, status: string, message: string, data?: any
) => {
  response.status(code).json({
    status: status,
    message: message,
    data: data && data,
  })
}
