module.exports = class HttpError extends Error {
  constructor (message, status) {
    super(message)
    this.status = status
  }

  toJson () {
    return {
      message: this.message,
      status: this.status
    }
  }

  toString () {
    return `${this.status}: ${this.message}`
  }
}
