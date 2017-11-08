import User from '../models/user'
import _ from 'lodash'

async function authenticateUser (values) {
  const user = await User.findByEmail(values.email)
  if (!user || !(user.password === values.password)) {
    const err = new Error('Unauthorized')
    err.status = 400
    throw err
  }

  const filteredUserKeys = [ 'email', 'first_name', 'last_name' ]
  return _.pick(user, filteredUserKeys)
}

async function register (values) {
  const dupUser = await User.findByEmail(values.email)
  if (dupUser) {
    const err = new Error('This email is already a user')
    err.status = 400
    throw err
  }

  const newUser = await User.createUser(values)
  return newUser
}

async function findByEmail (email) {
  const user = await User.findByEmail(email)
  if (!user) {
    const err = new Error('User not found')
    err.status = 400
    throw err
  }

  return user
}

module.exports = {
  authenticateUser,
  register,
  findByEmail
}
