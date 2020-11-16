import { LookupComponent } from '@/components';
import { Router } from 'express';
import { requiresOAuth } from '@/config/titan/authAccess';


/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.post('/general', requiresOAuth, LookupComponent.getUserDetails);

router.post('/moderation', requiresOAuth, LookupComponent.getUserModlog);

router.post('/chat', requiresOAuth, LookupComponent.getChatHistory);

/**
 * @export {express.Router}
 */
export default router;
