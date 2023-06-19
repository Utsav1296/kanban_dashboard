import { validationResult } from 'express-validator'
import mongoose from 'mongoose'

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

export { validate, isObjectId }