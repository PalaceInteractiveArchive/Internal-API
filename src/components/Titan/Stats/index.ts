//import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { mongoUser, mongoPlayer, mongoHelpme, mongoFriend } from '@/components/Titan/User/model';
// import HttpError from '@/config/error';
// import UserService from '@/components/Titan/User/service';
// import config from '@/config/env';
import Axios from 'axios';

export async function titanUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    const number = await mongoUser.countDocuments();
    res.send(number.toString())
}

export async function totalPlayers(req: Request, res: Response, next: NextFunction): Promise<void> {
    const number = await mongoPlayer.countDocuments();
    res.send(number.toString())
}

export async function totalHelps(req: Request, res: Response, next: NextFunction): Promise<void> {
    const number = await mongoHelpme.countDocuments();
    res.send(number.toString())
}

export async function findUserFriends(req: Request, res: Response, next: NextFunction): Promise<void> {
    await mongoFriend.find({$or: [{sender: req.params.uuid}, {receiver: req.params.uuid}]}).exec(function (err, results) {
        let number = results.length
        res.send(number.toString())
    })
}

export async function getUserDetails(req: Request, response: Response, next: NextFunction): Promise<void> {
    await mongoPlayer.find({username: req.params.user}).lean().exec(function (err, results) {
        if (!results.length) {
            response.send({})
        } else {
            let temp = JSON.stringify(results[0])
            let resJson = JSON.parse(temp);
            Axios({
                method: 'GET',
                url: `https://forums.palace.network/api/core/members/${resJson.forums.member_id}`,
                headers: {
                    authorization: `Bearer ${req.params.accesstoken}`
                }
            })
            .then(function (res: any) {
                let gameObj = {uuid: resJson.uuid, username: resJson.username, forums: {member_id: resJson.forums.member_id}, onlineTime: resJson.onlineTime}
                let sentObj = {forum: res.data, game: gameObj}
                response.send(sentObj)
            })
            .catch(function (err) {
                console.error(err)
            });
        }
    })
}