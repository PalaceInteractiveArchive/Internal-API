// import * as jwtConfig from '@/config/middleware/jwtAuth';
import { StatsComponent } from '@/components';
import { Router } from 'express';


/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.get('/titanUsers', StatsComponent.titanUsers);

router.get('/totalUsers', StatsComponent.totalPlayers);

router.get('/totalHelps', StatsComponent.totalHelps);

router.get('/getFriends/:uuid', StatsComponent.findUserFriends);

router.get('/getUser/:user/:accesstoken', StatsComponent.getUserDetails);



/**
 * @export {express.Router}
 */
export default router;
