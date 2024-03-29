require('dotenv').config()
import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { IUserModel, IUserRequest, mongoUser } from '@/components/Titan/User/model';
import HttpError from '@/config/error';
import UserService from '@/components/Titan/User/service';
import config from '@/config/titan';
import Axios from 'axios';

interface RequestWithUser extends Request {
    user: IUserRequest;
    token: string;
}

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
            if (config.allowedGroups.includes(user.pgroup)) {
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
            var user = {
                id: res2.data.id,
                name: res2.data.name,
                pgroup: res2.data.primaryGroup.id,
                avatar: res2.data.photoUrl,
                sgroups: res2.data.secondaryGroups
            }
            let groupAllowed = false;

            if (config.allowedGroups.includes(user.pgroup)) {
                groupAllowed = true;
            }


            switch (groupAllowed) {
                case true:
                    let sgroups: number[] = []
                    Axios({
                        method: 'get',
                        url: `https://forums.palace.network/api/core/members/${user.id}?key=${process.env.ipbApi}`
                    })
                    .then(function (res1: any) {
                        let secondarys = res1.data.secondaryGroups;
                        secondarys.forEach((el: any) => {
                            sgroups.push(el.id)
                        });
                        const queryUser = new mongoUser(user);
                        var queryData = queryUser.toObject();
                        delete queryData._id;

                        mongoUser.findOneAndUpdate({id: user.id}, { 'id': user.id, 'avatar': user.avatar, 'name': user.name, 'pgroup': user.pgroup}, {upsert:true}, function(err, result) {
                            if (err) {
                                return console.error(err)
                            } else {
                                res.send(`<script>window.opener.postMessage({status: "success", accessToken: "${response.data.access_token}", user: ${JSON.stringify(result)}, otherStuff: ${JSON.stringify(res2.data)}, sGroups: ${JSON.stringify(sgroups)}},'*');</script><h1>You can close this page</h1>`)
                            }
                        })
                    })
                    
                    break;
                default:
                    res.send(`<script>window.opener.postMessage({status: "failed"},'*');</script><h1>You can close this page</h1>`)
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
