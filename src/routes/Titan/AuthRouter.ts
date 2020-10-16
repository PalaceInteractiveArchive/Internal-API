import * as jwtConfig from '@/config/middleware/jwtAuth';
import { AuthComponent } from '@/components';
import { Router } from 'express';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

// router.post('/login', AuthComponent.login);

router.post('/logout', jwtConfig.isUserAuthenticated, AuthComponent.logout);

router.get('/user', jwtConfig.isUserAuthenticated, AuthComponent.user);

router.get('/login', (req, res) => {
    res.redirect(`https://forums.palace.network/oauth/authorize/?client_id=88dfa993c042dbdc788a5cbbeecbea66&redirect_uri=https://internal-api.palace.network/titan/auth/redirect_uri&response_type=code&scope=profile`);
});

router.get('/redirect_uri', AuthComponent.redirect_uri);

/**
 * @export {express.Router}
 */
export default router;
