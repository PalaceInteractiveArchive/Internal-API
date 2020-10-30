import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { Rank } from '../../../handlers/rank';
import { parse as uuidParse, stringify as uuidStringify } from 'uuid';
import ChatService from '@/components/Minecraft/Chat/service';
import * as mysql from '../../../config/db/sql';

export async function analyze(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.body === undefined || req.body.uuid === undefined || req.body.rank === undefined
        || req.body.message === undefined || req.body.server === undefined) {
        res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: 'Invalid request body!' });
        return;
    }
    var uuid = uuidParse(req.body.uuid);
    var rank: Rank = Rank.fromString(req.body.rank);
    var message: string = req.body.message;

    if (rank >= 12) {
        res.status(HttpStatus.OK).send({ success: true, uuid: uuidStringify(uuid), okay: true, message: req.body.message });
        return;
    } else {
        var swear = ChatService.swearCheck(message);
        if (swear != null) {
            var filter: string = swear[0];
            var offendingText: string = swear[1];
            res.status(HttpStatus.OK).send({ success: true, uuid: uuidStringify(uuid), okay: false, filter_caught: filter, offending_text: offendingText });
            return;
        }
        var link = ChatService.linkCheck(message);
        if (link != null) {
            var filter: string = link[0];
            var offendingText: string = link[1];
            res.status(HttpStatus.OK).send({ success: true, uuid: uuidStringify(uuid), okay: false, filter_caught: filter, offending_text: offendingText });
            return;
        }
        var character = ChatService.characterCheck(message);
        if (character != null) {
            var filter: string = character[0];
            var offendingText: string = character[1];
            res.status(HttpStatus.OK).send({ success: true, uuid: uuidStringify(uuid), okay: false, filter_caught: filter, offending_text: offendingText });
            return;
        }
        res.status(HttpStatus.OK).send({ success: true, uuid: uuidStringify(uuid), okay: true, message: req.body.message });
    }
}

export async function log(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.body === undefined || req.body.uuid === undefined || req.body.message === undefined) {
        res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: 'Invalid request body!' });
        return;
    }
    var chatEntry = { uuid: req.body.uuid, message: req.body.message, time: Date.now() };
    mysql.pool.query('INSERT INTO chat SET ?', chatEntry, function (error:any, results:any, fields:any) {
        if (error != null) {
            console.log(error);
        }
    });
    res.status(HttpStatus.OK).send({ success: true });
}
