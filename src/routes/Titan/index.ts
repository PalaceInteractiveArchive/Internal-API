import AuthRouter from "./AuthRouter";
import StatsRouter from "./StatsRouter";
import { Router } from 'express';
import SupportRouter from './SupportRouter';
import LookupRouter from './LookupRouter';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.use('/auth', AuthRouter);

router.use('/stats', StatsRouter);

router.use('/support', SupportRouter);

router.use('/lookup', LookupRouter)

/**
 * @export {express.Router}
 */
export default router;
