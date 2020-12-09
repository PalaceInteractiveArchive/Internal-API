import AuthRouter from "./AuthRouter";
import StatsRouter from "./StatsRouter";
import { Router } from 'express';
import SupportRouter from './SupportRouter';
import LookupRouter from './LookupRouter';
import AdminRouter from './AdminRouter';
import AlertRouter from './AlertRouter'

/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.use('/auth', AuthRouter);

router.use('/stats', StatsRouter);

router.use('/support', SupportRouter);

router.use('/lookup', LookupRouter);

router.use('/admin', AdminRouter);

router.use('/alerts', AlertRouter);

/**
 * @export {express.Router}
 */
export default router;
