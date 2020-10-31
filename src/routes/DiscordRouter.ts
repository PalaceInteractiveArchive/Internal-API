import * as jwtConfig from '@/config/middleware/jwtAuth';
import { DiscordComponent } from '@/components';
import { Router } from 'express';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.post('/link', jwtConfig.isServiceAuthenticated, DiscordComponent.link);

router.post('/unlink', jwtConfig.isServiceAuthenticated, DiscordComponent.unlink);

/**
 * @export {express.Router}
 */
export default router;
