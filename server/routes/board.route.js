import express from 'express'
const router = express.Router()

import { param } from 'express-validator'
import { validate, isObjectId } from '../handlers/validation.js'
import { verifyToken } from '../handlers/tokenHandler.js'
import { createBoard, getAllBoard, updateBoardPosition, getOneBoard, updateBoard, getFavouritesBoard, updateFavouriteBoardPosition, deleteBoard } from '../controllers/board.controller.js'

router.post(
  '/',
  verifyToken,
  createBoard
)

router.get(
  '/',
  verifyToken,
  getAllBoard
)

router.put(
  '/',
  verifyToken,
  updateBoardPosition
)

// Favourite 
router.get(
  '/favourites',
  verifyToken,
  getFavouritesBoard
)

router.put(
  '/favourites',
  verifyToken,
  updateFavouriteBoardPosition
)


// Board by id
router.get(
  '/:boardId',
  param('boardId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid id')
    } else return Promise.resolve()
  }),
  validate,
  verifyToken,
  getOneBoard
)

router.put(
  '/:boardId',
  param('boardId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid id')
    } else return Promise.resolve()
  }),
  validate,
  verifyToken,
  updateBoard
)

router.delete(
  '/:boardId',
  param('boardId').custom(value => {
    if (!isObjectId(value)) {
      return Promise.reject('invalid id')
    } else return Promise.resolve()
  }),
  validate,
  verifyToken,
  deleteBoard
)

export default router;