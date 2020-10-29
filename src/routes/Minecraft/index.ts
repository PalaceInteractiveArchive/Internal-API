import PacksRouter from './PacksRouter';
import ChatRouter from './ChatRouter';
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
 * @description Chat logging/analysis endpoints
 */
router.use('/chat', ChatRouter);

/**
 * @export {express.Router}
 */
export default router;
