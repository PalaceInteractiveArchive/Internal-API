// import * as jwtConfig from '@/config/middleware/jwtAuth';
import { AuthComponent } from '@/components/Titan';
import { Router } from 'express';
var cors = require('cors');


/**
 * @constant {express.Router}
 */
const router: Router = Router();

// router.post('/login', AuthComponent.login);


// router.get('/user', jwtConfig.isUserAuthenticated, AuthComponent.user);

router.get('/login', cors(), (req, res) => {
    res.send(`https://forums.palace.network/oauth/authorize/?client_id=88dfa993c042dbdc788a5cbbeecbea66&redirect_uri=https://internal-api.palace.network/titan/auth/redirect_uri&response_type=code&scope=profile`);
});

router.get('/redirect_uri', AuthComponent.redirect_uri);

router.post('/verify', AuthComponent.verify);

/**
 * @export {express.Router}
 */
export default router;
