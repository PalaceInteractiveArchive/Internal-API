import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { IUserModel, IUserRequest, mongoUser } from '@/components/Titan/User/model';
import HttpError from '@/config/error';
import UserService from '@/components/Titan/User/service';
import config from '@/config/env';
import Axios from 'axios';
//var _ = require('lodash');

interface RequestWithUser extends Request {
    user: IUserRequest;
    token: string;
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
// export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//         const user: IUserModel = await AuthService.getUser(req.body);

//         const token: string = jwt.sign({ uuid: user.uuid, username: user.username }, app.get('secret'));

//         user.titan.token = token;

//         user.save();

//         res.status(HttpStatus.OK)
//             .header({
//                 Authorization: token,
//             })
//             .send({
//                 success: true
//             });
//     } catch (error) {
//         if (error.code === 500) {
//             return next(new HttpError(error.message.status, error.message));
//         }
//         res.status(HttpStatus.BAD_REQUEST)
//             .send({
//                 success: false,
//                 message: error.message,
//             });
//     }
// }

// export async function logout(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
//     try {
//         const user: IUserModel = await UserService.findOne(req.user.uuid);

//         if (user.titan.token !== req.token) {
//             res.status(HttpStatus.UNAUTHORIZED).send({ success: false, message: 'Invalid token!' });
//             return;
//         }

//         user.titan.token = null;

//         user.save();

//         res.status(HttpStatus.OK)
//             .send({
//                 success: true
//             });
//     } catch (error) {
//         if (error.code === 500) {
//             return next(new HttpError(error.message.status, error.message));
//         }
//         res.status(HttpStatus.BAD_REQUEST)
//             .send({
//                 success: false,
//                 message: error.message,
//             });
//     }
// }

export async function user(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
        const user: IUserModel = await UserService.findOne(req.user.uuid, {
            uuid: 1, username: 1, rank: 1, tags: 1, titan: 1
        });

        if (user.titan === undefined || user.titan.token !== req.token) {
            res.status(HttpStatus.UNAUTHORIZED).send({ success: false, message: 'Invalid token!' });
            return;
        }

        const data = {
            uuid: user.uuid,
            username: user.username,
            rank: user.rank,
            rank_tags: user.tags
        }

        res.status(HttpStatus.OK)
            .send({
                success: true,
                user: data
            });
    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(HttpStatus.BAD_REQUEST)
            .send({
                success: false,
                message: error.message
            });
    }
}

export async function verify(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    //console.log(req.body)
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
                res.send(true);
            } else {
                // they got in, but are not in the right group - kick them out
                res.send(false)
            }
        } else {
            // user has been updated on IPB or they tampered with the cookie - kick them out
            res.send(false);
        }
    })
    .catch(function (err) {
        res.send(false);
        console.log(err);
    });
}

export async function redirect_uri(req: Request, res: Response, next: NextFunction): Promise<void> {

    //console.log(req.query.code)

    var params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', `${req.query.code}`);
    params.append('client_id', '88dfa993c042dbdc788a5cbbeecbea66');
    params.append('client_secret', '406f215a07b12aafe4af5b6bd886e8c5ec8ef0848f85aa35')

    Axios({
        method: 'post',
        url: `https://forums.palace.network/oauth/token/?grant_type=authorization_code&code=${req.query.code}&client_id=${config.oauth.clientId}&client_secret=${config.oauth.clientSecret}&redirect_uri=https://internal-api.palace.network/titan/auth/redirect_uri`,
        data: params,
        headers: {
        'Authorization': `Basic ${req.query.code}`,
        'content-type': 'application/x-www-form-urlencoded'
        }
    })
    .then(function (response: any) {
        Axios({
            method: 'GET',
            url: 'https://forums.palace.network/api/core/me',
            headers: {
                authorization: `Bearer ${response.data.access_token}`
            }
        })
        .then(function (res2: any) {
            //console.log(res2.data);
            var user = {
                id: res2.data.id,
                name: res2.data.name,
                pgroup: res2.data.primaryGroup.id,
                avatar: res2.data.photoUrl,
                sgroups: res2.data.secondaryGroups
            }

            let groupAllowed = false;

            if (config.oauth.allowedGroups.includes(user.pgroup)) {
                groupAllowed = true;
            }

            // config.oauth.allowedGroups.forEach(e => {
            //     for (let i = 0; i < user.sgroups.length; i++) {
            //         if (user.sgroups[i].id == e) {
            //             groupAllowed = true;
            //         }
            //     }
            // });

            switch (groupAllowed) {
                case true:
                    const queryUser = new mongoUser(user);
                    var queryData = queryUser.toObject();
                    delete queryData._id;

                    mongoUser.findOneAndUpdate({id: user.id}, queryData, {upsert:true}, function(err) {
                        if (err) {
                            return console.error(err)
                            res.send()
                        } else {
                            res.send(`<script>window.opener.postMessage({status: "success", accessToken: "${response.data.access_token}", user: ${JSON.stringify(user)}, otherStuff: ${JSON.stringify(res2.data)}},'*');</script><h1>You can close this page</h1>`)
                        }
                    })
                    break;
                default:
                    res.redirect(`<script>window.opener.postMessage({status: "failed"},'*');</script>`)
                    break;
            }

            
        })
        .catch(function (err) {
            console.error(err)
        })
    })
    .catch(function (error: any) {
        console.error('err ' + JSON.stringify(error.response.data));
        console.error(error);
    })

    
}


//oo

// /**
//  * @export
//  * @param {RequestWithUser} req
//  * @param {Response} res
//  * @param {NextFunction} next
//  * @returns {Promise < void >}
//  */
// export async function user(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
//     try {
//         const user: IUserModel = await UserService.findOne(req.user.id);

//         res.status(HttpStatus.OK)
//             .send({ user });
//     } catch (error) {
//         if (error.code === HttpStatus.INTERNAL_SERVER_ERROR) {
//             return next(new HttpError(error.message.status, error.message));
//         }
//         res.status(HttpStatus.BAD_REQUEST)
//             .send({
//                 message: error.message,
//             });
//     }
// }
