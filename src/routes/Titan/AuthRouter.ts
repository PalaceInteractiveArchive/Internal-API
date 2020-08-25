import * as jwtConfig from '@/config/middleware/jwtAuth';
import { AuthComponent } from '@/components';
import { Router } from 'express';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.post('/login', AuthComponent.login);

router.post('/logout', jwtConfig.isUserAuthenticated, AuthComponent.logout);

router.get('/user', jwtConfig.isUserAuthenticated, AuthComponent.user);

/**
 * @export {express.Router}
 */
export default router;
