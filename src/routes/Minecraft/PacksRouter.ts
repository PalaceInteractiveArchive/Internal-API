import * as jwtConfig from '@/config/middleware/jwtAuth';
import { PacksComponent } from '@/components/Minecraft';
import { Router } from 'express';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.get('/list', jwtConfig.isServiceAuthenticated, PacksComponent.list);

router.get('/get', jwtConfig.isServiceAuthenticated, PacksComponent.get);

/**
 * @export {express.Router}
 */
export default router;
