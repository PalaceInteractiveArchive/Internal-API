import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import config from '@/config/titan';
import Axios from 'axios';
import HttpError from '@/config/error';
import { mongoUser } from '@/components/Titan/User/model';
import * as http from 'http';

export const requiresOAuth = function(req: Request, res: Response, next: NextFunction): void {
    if (!req.body.accessToken) {
        return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
    } else {
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
                if (config.allowedGroups.includes(user.pgroup)) {
                    return next();
                } else {
                    // they got in, but are not in the right group - kick them out
                    console.log('wrong group')
                    return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
                }
            } else {
                // user has been updated on IPB or they tampered with the cookie - kick them out
                console.log('tampered')
                return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
            }
        })
        .catch(function (err) {
            console.log(err);
            return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
        });
    }
};

export const managerOAuthCheck = function(req: Request, res: Response, next: NextFunction): void {
    console.log(req.body.accessToken)
    if (!req.body.accessToken) {
        return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
    } else {
        Axios({
            method: 'GET',
            url: 'https://forums.palace.network/api/core/me',
            headers: {
                authorization: `Bearer ${req.body.accessToken}`
            }
        })
        .then(async function (res2: any) {
            var user = {
                id: res2.data.id,
                name: res2.data.name,
                pgroup: res2.data.primaryGroup.id,
                avatar: res2.data.photoUrl,
                sgroups: res2.data.secondaryGroups
            }
            if (user.pgroup === req.body.user.pgroup) {
                let sGroups = await Axios.get(`https://forums.palace.network/api/core/members/${user.id}?key=${config.ipbApi}`);
                await mongoUser.findOne({id: user.id}).exec(function (err, results) {
                    if (err) {
                        return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
                    }
                    sGroups.data.secondaryGroups.forEach((element: any) => {
                        if (config.sensitiveGroups.includes(element.id)) {
                            return next();
                        }
                    });
                    if (results.toObject().allowedRoutes.includes(req.body.routeType)) {
                        return next();
                    } else {
                        if (config.sensitiveGroups.includes(user.pgroup)) {
                            return next();
                        } else {
                            // they got in, but are not in the right group - kick them out
                            console.log('wrong group')
                            return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
                        }
                    }
                }); 
            } else {
                // user has been updated on IPB or they tampered with the cookie - kick them out
                console.log('tampered')
                return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
            }
        })
        .catch(function (err) {
            console.log(err);
            return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
        });
    }
};