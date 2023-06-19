import express from 'express'
const router = express.Router({ mergeParams: true })
// const router = require('express').Router({ mergeParams: true })
import { param, body } from 'express-validator'
import { verifyToken } from '../handlers/tokenHandler.js'
import { isObjectId, validate } from '../handlers/validation.js'
import { createTask, updateTask, deleteTask, updateTaskPosition } from '../controllers/task.controller.js'

router.post(
  '/',
  param('boardId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid board id')
    } else return Promise.resolve()
  }),
  body('sectionId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid section id')
    } else return Promise.resolve()
  }),
  validate,
  verifyToken,
  createTask
)

router.put(
  '/update-position',
  param('boardId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid board id')
    } else return Promise.resolve()
  }),
  validate,
  verifyToken,
  updateTaskPosition
)

router.delete(
  '/:taskId',
  param('boardId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid board id')
    } else return Promise.resolve()
  }),
  param('taskId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid task id')
    } else return Promise.resolve()
  }),
  validate,
  verifyToken,
  deleteTask
)

router.put(
  '/:taskId',
  param('boardId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid board id')
    } else return Promise.resolve()
  }),
  param('taskId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid task id')
    } else return Promise.resolve()
  }),
  validate,
  verifyToken,
  updateTask
)


export default router;