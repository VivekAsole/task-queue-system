import express from 'express'
import { handleTask } from '../controllers/taskController.js'

const router = express.Router()

router.post('/task', handleTask)

export default router
