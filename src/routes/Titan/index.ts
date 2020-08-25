import AuthRouter from "./AuthRouter";
import { Router } from 'express';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.use('/auth', AuthRouter);

/**
 * @export {express.Router}
 */
export default router;
