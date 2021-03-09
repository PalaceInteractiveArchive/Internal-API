import { ApplicationComponent } from '@/components/Titan';
import { managerOAuthCheck } from '@/config/titan/authAccess';
import { Router } from 'express';
//import { managerOAuthCheck } from '@/config/titan/authAccess';


/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.post('/saveFormData/:formId', ApplicationComponent.oAuthFormCheck, ApplicationComponent.saveFormData);

router.get('/getFormData/:formId',  ApplicationComponent.returnFormData);

router.post('/getAllTypes', managerOAuthCheck, ApplicationComponent.returnAllTypes);

router.post('/getAllPendingApplicants', managerOAuthCheck, ApplicationComponent.getAllPendingApplicants);

router.post('/getSingleApplicationAdmin', managerOAuthCheck, ApplicationComponent.getSingleApplication);

router.post('/getAllCompleteApplicants', managerOAuthCheck, ApplicationComponent.getAllCompletedApplications);

router.post('/updateStatus/:formId/:status', managerOAuthCheck, ApplicationComponent.changeStatus);

router.get('/login/:loginCode/:uuid', ApplicationComponent.checkLoginCode);

router.post('/getAllOpen', ApplicationComponent.checkGuestLogin, ApplicationComponent.returnAllowed);

router.post('/getMyApplications', ApplicationComponent.checkGuestLogin, ApplicationComponent.getAllUserApplications);

router.post('/get/:appId', ApplicationComponent.checkGuestLogin, ApplicationComponent.returnSpecified);

router.post('/submit/:appId', ApplicationComponent.checkGuestLogin, ApplicationComponent.submitApplication);

router.post('/getMyApplication/:id', ApplicationComponent.checkGuestLogin, ApplicationComponent.getGuestApplication);

router.post('/sendAdminResponse/:id', managerOAuthCheck, ApplicationComponent.addAdminComment);

router.post('/sendGuestResponse/:id', ApplicationComponent.checkGuestLogin, ApplicationComponent.addGuestComment);

router.post('/createNewType', managerOAuthCheck, ApplicationComponent.createNewType);


/**
 * @export {express.Router}
 */
export default router;
