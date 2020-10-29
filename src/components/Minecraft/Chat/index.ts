import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { Rank } from '../../../handlers/rank';
import { parse as uuidParse, stringify as uuidStringify } from 'uuid';
// import { mongoUser, mongoPlayer, mongoHelpme, mongoFriend } from '@/components/Titan/User/model';
// import HttpError from '@/config/error';
// import UserService from '@/components/Titan/User/service';
// import config from '@/config/env';
// import Axios from 'axios';
import ChatService from '@/components/Minecraft/Chat/service';

export async function analyze(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.body === undefined || req.body.uuid === undefined || req.body.rank === undefined
        || req.body.message === undefined || req.body.server === undefined) {
        res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: 'Invalid request body!' });
        return;
    }
    var uuid = uuidParse(req.body.uuid);
    var rank: Rank = Rank.fromString(req.body.rank);
    var message: string = req.body.message;

    // console.log(uuidStringify(uuid))
    // console.log(rank)
    // console.log(req.body.message)
    // console.log(req.body.server)

    if (rank >= 12) {
        res.status(HttpStatus.OK).send({ success: true, uuid: uuidStringify(uuid), okay: true, message: req.body.message });
        return;
    } else {
        var swear = ChatService.swearCheck(message);
        if (swear != null) {
            var filter: string = swear[0];
            var offendingText: string = swear[1];
            res.status(HttpStatus.OK).send({ success: true, uuid: uuidStringify(uuid), okay: false, player_response: filter, staff_response: offendingText });
            return;
        }
        var link = ChatService.linkCheck(message);
        if (link != null) {
            var filter: string = link[0];
            var offendingText: string = link[1];
            res.status(HttpStatus.OK).send({ success: true, uuid: uuidStringify(uuid), okay: false, player_response: filter, staff_response: offendingText });
            return;
        }
        var character = ChatService.characterCheck(message);
        if (character != null) {
            var filter: string = character[0];
            var offendingText: string = character[1];
            res.status(HttpStatus.OK).send({ success: true, uuid: uuidStringify(uuid), okay: false, player_response: filter, staff_response: offendingText });
            return;
        }
        res.status(HttpStatus.OK).send({ success: true, uuid: uuidStringify(uuid), okay: true, message: req.body.message });
    }
}

export async function log(req: Request, res: Response, next: NextFunction): Promise<void> {
    // const number = await mongoPlayer.countDocuments();
    // res.send(number.toString())
}