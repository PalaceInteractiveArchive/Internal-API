//import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { mongoPlayer, mongoChat, mongoHelpme } from '@/components/Titan/User/model';
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

export async function getGuideLog(req: Request, response: Response, next: NextFunction): Promise<void> {
    if (!req.body.accessToken) {
        response.send({});
    }
    console.log(req.body.uuid)
    await mongoHelpme.find({helping: req.body.uuid}).exec(function (err, results) {
        if (err) {
            console.log(err)
            response.send({});
            return;
        }
        var requests: any[] = [];
        results.forEach(res => {
            var r = res.toObject();
            if (r.time != null) {
                requests.push(r.time);
            }
        });
        var dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);

        var weekAgo = new Date();
        weekAgo.setDate(dayAgo.getDate() - 7);

        var monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        var dayTotal = 0, monthTotal = 0, weekTotal = 0, total = 0;
        requests.forEach(r => {
            if (r >= dayAgo.valueOf()) dayTotal++;
            if (r >= weekAgo.valueOf()) weekTotal++;
            if (r >= monthAgo.valueOf()) monthTotal++;
            total++;
        });

        var jsonObj = {"day": dayTotal, "week": weekTotal, "month": monthTotal, "total": total}

        response.send(jsonObj);
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