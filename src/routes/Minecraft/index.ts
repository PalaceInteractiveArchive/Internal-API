import PacksRouter from './PacksRouter';
import ServerRouter from './ServerRouter';
import { Router } from 'express';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

/**
 * @description Resource Pack endpoints
 */
router.use('/packs', PacksRouter);

/**
 * @description Server endpoints
 */
router.use('/server', ServerRouter);

/**
 * @export {express.Router}
 */
export default router;
