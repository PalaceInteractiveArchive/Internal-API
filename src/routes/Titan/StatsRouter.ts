import * as HttpStatus from 'http-status-codes';
import { StatsComponent } from '@/components';
import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import config from '@/config/env';
import Axios from 'axios';
import HttpError from '@/config/error';
import * as http from 'http';


/**
 * @constant {express.Router}
 */
const router: Router = Router();

let requiresOAuth = function(req: Request, res: Response, next: NextFunction) {
    if (!req.body.accessToken) {
        return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
    }
    Axios({
        method: 'GET',
        url: 'https://forums.palace.network/api/core/me',
        headers: {
            authorization: `Bearer ${req.body.accessToken}`
        }
    })
    .then(function (res2: any) {
        var user = {
            id: res2.data.id,
            name: res2.data.name,
            pgroup: res2.data.primaryGroup.id,
            avatar: res2.data.photoUrl,
            sgroups: res2.data.secondaryGroups
        }
        if (user.pgroup === req.body.user.pgroup) {
            if (config.oauth.allowedGroups.includes(user.pgroup)) {
                return next();
            } else {
                // they got in, but are not in the right group - kick them out
                return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
            }
        } else {
            // user has been updated on IPB or they tampered with the cookie - kick them out
            return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
        }
    })
    .catch(function (err) {
        return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
        console.log(err);
    });
  };

router.get('/titanUsers', requiresOAuth, StatsComponent.titanUsers);

router.get('/totalUsers', requiresOAuth, StatsComponent.totalPlayers);

router.get('/totalHelps', requiresOAuth, StatsComponent.totalHelps);

router.get('/getFriends/:uuid', requiresOAuth, StatsComponent.findUserFriends);

router.get('/getUser/:user/:accesstoken', requiresOAuth, StatsComponent.getUserDetails);



/**
 * @export {express.Router}
 */
export default router;
