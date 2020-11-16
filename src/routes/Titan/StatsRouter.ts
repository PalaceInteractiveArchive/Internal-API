import { StatsComponent } from '@/components';
import { Router } from 'express';
import { requiresOAuth } from '@/config/titan/authAccess';


/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.post('/titanUsers', requiresOAuth, StatsComponent.titanUsers);

router.post('/totalUsers', requiresOAuth, StatsComponent.totalPlayers);

router.post('/totalHelps', requiresOAuth, StatsComponent.totalHelps);

router.post('/getFriends/:uuid', requiresOAuth, StatsComponent.findUserFriends);

router.post('/getUser/:user/', requiresOAuth, StatsComponent.getUserDetails);



/**
 * @export {express.Router}
 */
export default router;
