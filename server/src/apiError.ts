export default class ApiError extends Error {
  status
  errors

  constructor(status, message) {
    super(message)
    this.status = status
  }
}
