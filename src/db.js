import mongoose from 'mongoose'

export default callback => {
  mongoose.connect('mongodb://localhost/Matchsage')
  callback()
}
