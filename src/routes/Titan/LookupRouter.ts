import { LookupComponent } from '@/components/Titan';
import { Router } from 'express';
import { managerOAuthCheck, requiresOAuth } from '@/config/titan/authAccess';


/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.post('/general', requiresOAuth, LookupComponent.getUserDetails);

router.post('/moderation', requiresOAuth, LookupComponent.getUserModlog);

router.post('/chat', managerOAuthCheck, LookupComponent.getChatHistory);

/**
 * @export {express.Router}
 */
export default router;
