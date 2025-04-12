const { UnauthenticatedError } = require('../errors')

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    throw new UnauthenticatedError('Not authorized as admin')
  }
  next()
}

module.exports = isAdmin
