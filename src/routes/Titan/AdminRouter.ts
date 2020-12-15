import { AdminComponent } from '@/components';
import { Router } from 'express';
import { managerOAuthCheck } from '@/config/titan/authAccess';


/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.post('/update/:id/support', managerOAuthCheck, AdminComponent.updateUserSupport);

router.post('/update/:id/chat', managerOAuthCheck, AdminComponent.updateUserChat);

router.post('/alert/add', managerOAuthCheck, AdminComponent.setAlert);

/**
 * @export {express.Router}
 */
export default router;
