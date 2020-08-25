import PacksRouter from './PacksRouter';
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
 * @export {express.Router}
 */
export default router;
