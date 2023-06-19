import express from 'express'
const router = express.Router({ mergeParams: true })

import { param } from 'express-validator'
import { verifyToken } from '../handlers/tokenHandler.js'
import { createSection, updateSection, deleteSection } from '../controllers/section.controller.js'
import { isObjectId, validate } from '../handlers/validation.js'

router.post(
  '/',
  param('boardId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid id')
    } else return Promise.resolve()
  }),
  validate,
  verifyToken,
  createSection
)

router.put(
  '/:sectionId',
  param('boardId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid board id')
    } else return Promise.resolve()
  }),
  param('sectionId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid section id')
    } else return Promise.resolve()
  }),
  validate,
  verifyToken,
  updateSection
)

router.delete(
  '/:sectionId',
  param('boardId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid board id')
    } else return Promise.resolve()
  }),
  param('sectionId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid section id')
    } else return Promise.resolve()
  }),
  validate,
  verifyToken,
  deleteSection
)

export default router;