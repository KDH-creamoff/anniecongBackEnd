import Router from 'express'
import {templateList, templateAdd, labelPrint} from '../controllers/labelController.js'

const router = Router()

router.get('/template', templateList)
router.post('/template', templateAdd)
router.post('/print', labelPrint)

export default router