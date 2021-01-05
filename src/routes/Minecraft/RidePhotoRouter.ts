import { Router } from "express";
import { checkAccess, ridePhotoGen, returnUsersRecent } from "@/components/RidePhotos"

/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.get('/create/:ride/:playerList', checkAccess, ridePhotoGen);

router.get('/player/:uuid', returnUsersRecent );


/**
 * @export {express.Router}
 */
export default router;
