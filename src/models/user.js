import mongoose from 'mongoose'
import Promise from 'bluebird'

const User = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    index: true
  },
  last_name: {
    type: String,
    index: true
  },
  user_type: {
    type: String,
    index: true
  },
  rfid: {
    type: String,
    unique: true
  }
})

User.statics = {
  createUser: user => {
    return m.create(user)
  },

  findByEmail: email => {
    return m.findOne({email})
  }
}

mongoose.model('user', User)

const m = mongoose.model('user')
Promise.promisifyAll(m)

module.exports = m
