import { AlertComponent } from '@/components';
import { Router } from 'express';
import { requiresOAuth } from '@/config/titan/authAccess';


/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.post('/getAll', requiresOAuth, AlertComponent.getAlerts);

router.post('/get/:id', requiresOAuth, AlertComponent.getSingleAlert);

router.post('/read/:id', requiresOAuth, AlertComponent.setUserRead);

/**
 * @export {express.Router}
 */
export default router;
