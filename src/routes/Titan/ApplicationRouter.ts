import { ApplicationComponent } from '@/components/Titan';
import { Router } from 'express';
//import { managerOAuthCheck } from '@/config/titan/authAccess';


/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.post('/saveFormData/:formId', ApplicationComponent.oAuthFormCheck, ApplicationComponent.saveFormData);

router.get('/getFormData/:formId',  ApplicationComponent.returnFormData);

router.get('/getAllTypes', ApplicationComponent.returnAllTypes)

/**
 * @export {express.Router}
 */
export default router;
