// import * as jwtConfig from '@/config/middleware/jwtAuth';
import { ServerComponent } from '@/components/Minecraft';
import { Router } from 'express';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.get('/online', ServerComponent.onlineCount);

/**
 * @export {express.Router}
 */
export default router;
