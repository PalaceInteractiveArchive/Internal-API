import * as jwtConfig from '@/config/middleware/jwtAuth';
import { ChatComponent } from '@/components/Minecraft';
import { Router } from 'express';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.post('/analyze', jwtConfig.isServiceAuthenticated, ChatComponent.analyze);

router.post('/log', jwtConfig.isServiceAuthenticated, ChatComponent.log);

/**
 * @export {express.Router}
 */
export default router;
