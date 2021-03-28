import * as HttpStatus from 'http-status-codes';
import * as http from 'http';

import { NextFunction, Request, Response } from 'express';
import HttpError from '@/config/error';
import { mongoPlayer } from '@/components/Titan/User/model';

export const getPlayer = async (req: Request, res: Response, next: NextFunction):Promise<void> => {

    if (!req.headers['service-api-key']) {
        return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
    } else {
        await mongoPlayer.find({username: req.params.user}).lean().exec((err, results) => {
            if (!results.length) {
                res.send({message: 'Player Not Found!'})
            } else {
                let data = JSON.stringify(results[0]);
                let parseData = JSON.parse(data);
                let playerData = {uuid: parseData.uuid, username: parseData.username, rank: parseData.rank, onlineTime: parseData.onlineTime, tokens: parseData.tokens, balance: parseData.balance, tags: parseData.tags, server: parseData.server }
                res.send(playerData);
            }
        })
    }
}