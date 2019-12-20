class UserError extends Error {
  constructor (message, DEBUG) {
    super(message)
    Error.stackTraceLimit = DEBUG ? 5 : 0
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = UserError
