import AuthRouter from "./AuthRouter";
import StatsRouter from "./StatsRouter";
import { Router } from 'express';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.use('/auth', AuthRouter);

router.use('/stats', StatsRouter);

/**
 * @export {express.Router}
 */
export default router;
