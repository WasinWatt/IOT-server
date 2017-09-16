import { version } from '../../package.json'
import { Router } from 'express'
import AuthService from '../services/auth'

import _ from 'lodash'
import fs from 'fs'
import path from 'path'

const filteredUserKeys = [ 'email', 'first_name', 'user_type' ]
const dataPath = path.join(__dirname, '..', '..', 'temp.txt')

let newestRfid

export default ({ config, db }) => {
  let api = Router()

  const readNewRFID = (eventType, filename) => {
    return new Promise((resolve, reject) => {
      if (filename) {
        fs.readFile(dataPath, 'utf-8', (err, data) => {
          if (err) {
            reject(err)
          } else {
            const datas = _.split(data, '\n')
            console.log(datas)
            resolve(datas[datas.length - 2])
          }
        })
      }
    })
  }

  api.get('/rfid-register', (req, res) => {
    fs.watch(dataPath, async (eventType, filename) => {
      newestRfid = await readNewRFID(eventType, filename)
      console.log(newestRfid)
      res.json({ success: true })
    })
  })

  api.post('/register', async (req, res) => {
    try {
      const body = req.body
      const newUser = await AuthService.signUp(body)
      res.json(_.pick(newUser, filteredUserKeys))
    } catch (error) {
      res.status(error.status).send(error.message)
    }
  })

  api.post('/read-rfid', async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await AuthService.findByEmail({ email, password })
      res.json(_.pick(user, filteredUserKeys))
    } catch (error) {
      res.status(error.status).send(error.messege)
    }
  })

  api.get('/', (req, res) => {
    res.json({ version })
  })

  return api
}
