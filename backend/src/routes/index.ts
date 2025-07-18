import { Router } from 'express'
import { indexWelcome } from '../controller/IndexController';

const router = Router();

router.route('/')
    .get(indexWelcome);

export default router;