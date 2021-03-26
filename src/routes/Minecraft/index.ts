import PacksRouter from './PacksRouter';
import ChatRouter from './ChatRouter';
import ServerRouter from './ServerRouter';
import RideRouter from './RidePhotoRouter';
import PlayerRouter from './PlayerRouter';
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
 * @description Server endpoints
 */
router.use('/server', ServerRouter);

/**
 * @description Ridephoto endpoints
 */
router.use('/ridephoto', RideRouter);

router.use('/player', PlayerRouter);

/**
 * @export {express.Router}
 */
export default router;
