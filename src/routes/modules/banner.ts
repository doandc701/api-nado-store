import express, { Request, Response } from "express";

import {
    GET_BANNER,
    POST_BANNER,
    PUT_BANNER,
    DELETE_BANNER
} from '../../controllers/BannerController'
import uploads from "../../middlewares/upload";

const router = express.Router();

router.delete('/:id', DELETE_BANNER)
router.put('/:id', PUT_BANNER)
router.post('/', uploads.single("thumbnail"), POST_BANNER)
router.get('/', GET_BANNER)


export default router;
