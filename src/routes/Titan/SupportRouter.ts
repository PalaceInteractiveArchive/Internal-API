import { SupportComponent } from '@/components';
import { Router } from 'express';
import { managerOAuthCheck } from '@/config/titan/authAccess';


/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.post('/submitAbsence', managerOAuthCheck, SupportComponent.submitAbsence);

router.post('/currentAbsence', managerOAuthCheck, SupportComponent.getNewAbsences);

router.post('/allAbsence', managerOAuthCheck, SupportComponent.getThreeMonths);


/**
 * @export {express.Router}
 */
export default router;
