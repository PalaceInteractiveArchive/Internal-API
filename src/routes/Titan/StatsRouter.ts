import { StatsComponent } from '@/components/Titan';
import { Router } from 'express';
import { requiresOAuth, managerOAuthCheck } from '@/config/titan/authAccess';


/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.post('/titanUsers', requiresOAuth, StatsComponent.titanUsersNumber);

router.post('/titanUserList', managerOAuthCheck, StatsComponent.titanUsers);

router.post('/totalUsers', requiresOAuth, StatsComponent.totalPlayers);

router.post('/totalHelps', requiresOAuth, StatsComponent.totalHelps);

router.post('/getFriends/:uuid', requiresOAuth, StatsComponent.findUserFriends);

router.post('/getUser/:user/', requiresOAuth, StatsComponent.getUserDetails);

router.post('/getGroups', requiresOAuth, StatsComponent.getGroupInfo);

router.post('/onlineStaff', requiresOAuth, StatsComponent.onlineStaff);


/**
 * @export {express.Router}
 */
export default router;
