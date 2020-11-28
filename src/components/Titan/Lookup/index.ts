//import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { mongoPlayer, mongoChat } from '@/components/Titan/User/model';
// import HttpError from '@/config/error';
// import UserService from '@/components/Titan/User/service';
// import config from '@/config/env';
import Axios from 'axios';


export async function getUserDetails(req: Request, response: Response, next: NextFunction): Promise<void> {
    if (!req.body.accessToken) {
        response.send({});
    }

    await mongoPlayer.find({username: req.body.username}).lean().exec(function (err, results) {
        if (!results.length) {
            response.send({})
        } else {
            let temp = JSON.stringify(results[0])
            let resJson = JSON.parse(temp);
            if (resJson.hasOwnProperty('forums')) {
                Axios({
                    method: 'GET',
                    url: `https://forums.palace.network/api/core/members/${resJson.forums.member_id}`,
                    headers: {
                        authorization: `Bearer ${req.body.accessToken}`
                    }
                })
                .then(function (res: any) {
                    let gameObj = {uuid: resJson.uuid, username: resJson.username, lastOnline: resJson.lastOnline, rank: resJson.rank, tags: resJson.tags, discordUsername: resJson.hasOwnProperty('discordUsername') ? resJson.discordUsername : ""}
                    let sentObj = {forum: res.data, game: gameObj}
                    response.send(sentObj)
                })
                .catch(function (err) {
                    console.error(err)
                    response.send({});
                });
            } else {
                let gameObj = {uuid: resJson.uuid, username: resJson.username, lastOnline: resJson.lastOnline, rank: resJson.rank, tags: resJson.tags, discordUsername: resJson.hasOwnProperty('discordUsername') ? resJson.discordUsername : ""}
                let sentObj = {game: gameObj}
                response.send(sentObj)
            }
            
        }
    })
}

export async function getUserModlog(req: Request, response: Response, next: NextFunction): Promise<void> {
    if (!req.body.accessToken) {
        response.send({});
    }

    await mongoPlayer.find({uuid: req.body.uuid}).lean().exec(function (err, results) {
        let temp = JSON.stringify(results[0])
        let resJson = JSON.parse(temp);

        let sentObj = {warnings: resJson.warnings, mutes: resJson.mutes, kicks: resJson.kicks, bans: resJson.bans};
        response.send(sentObj);
    });

}

export async function getChatHistory(req: Request, response: Response, next: NextFunction): Promise<void> {
    if (!req.body.accessToken && !req.body.page && !req.body.uuid) {
        response.send({});
    }
    let skipAmount = 0;

    if (req.body.page > 1) {
        skipAmount = 50 * req.body.page;
    }

    await mongoChat.find({uuid: req.body.uuid}).sort({_id: -1}).limit(50).skip(skipAmount).lean().exec(function (err, results) {
        response.send({chat: results})
    })

}