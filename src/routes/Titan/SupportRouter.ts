import { SupportComponent } from '@/components/Titan';
import { Router } from 'express';
import { managerOAuthCheck, requiresOAuth } from '@/config/titan/authAccess';


/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.post('/submitAbsence', requiresOAuth, SupportComponent.submitAbsence);

router.post('/currentAbsence', managerOAuthCheck, SupportComponent.getNewAbsences);

router.post('/allAbsence', managerOAuthCheck, SupportComponent.getThreeMonths);


/**
 * @export {express.Router}
 */
export default router;
