import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { IDiscordModel, LinkingInfo } from '@/components/Discord/model';
import { parse as uuidParse, stringify as uuidStringify } from 'uuid';
import * as mysql from '../../config/db/sql';
import DiscordService from './service';

export async function link(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.body === undefined || req.body.minecraftUUID === undefined || req.body.discordTag === undefined) {
        res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: 'Invalid request body!' });
        return;
    }
    var uuid = uuidStringify(uuidParse(req.body.minecraftUUID));
    if (uuid === undefined) {
        res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: 'Invalid request body!' });
        return;
    }

    var user: IDiscordModel = await DiscordService.findUserByUUID(uuid);
    if (user == null) {
        res.status(HttpStatus.FORBIDDEN).send({ success: false, message: 'Could not find user with provided UUID' });
        return;
    }

    var linkInfo = await DiscordService.findLinkInfoByUUID(uuid);
    if (linkInfo != null || user.discordId !== undefined) {
        res.status(HttpStatus.FORBIDDEN).send({ success: false, message: 'This Minecraft account is already linked to a Discord account' });
        return;
    }

    var discordTag = req.body.discordTag;
    // TODO use Discord API for this
    var discordId = discordTag;
    if (discordId == null) {
        res.status(HttpStatus.FORBIDDEN).send({ success: false, message: 'Could not find user with provided Discord Tag' });
        return;
    }

    var linkInfo = await DiscordService.findLinkInfoByDiscordID(discordId);
    if (linkInfo != null) {
        res.status(HttpStatus.FORBIDDEN).send({ success: false, message: 'This Discord account is already linked to a Minecraft account' });
        return;
    }

    user = await DiscordService.findUserByDiscordID(discordId);
    if (user != null) {
        res.status(HttpStatus.FORBIDDEN).send({ success: false, message: 'This Discord account is already linked to a Minecraft account' });
        return;
    }

    var pin: Number = await DiscordService.generatePin();
    if (pin == null) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message: 'Internal error' });
        return;
    }

    var expires = 1000 * 60 * 5;
    var expiresTime = Date.now() + expires;

    // store pin and discordId in discord_linking table
    const info: LinkingInfo = {
        minecraftUUID: uuid, discordId, pin, expires: expiresTime
    }
    await DiscordService.storeLinkInfo(info);
    
    res.status(HttpStatus.OK).send({ success: true, pin, expires });

    // 1. check if MC account with the provided UUID has joined our server
    //    a. if no, cancel linking and return 403
    //    b. if yes, continue
    // 2. convert discord tag to discord user ID
    //    a. if a discord user with the provided tag (user#1234) is not found, cancel linking and return 403 error
    //    b. otherwise, continue
    // 3. check if another MC account is linked to that discord user ID
    //    a. if yes, cancel linking and return 403 error
    //    b. if no, continue
    // 4. generate unique 6-digit pin
    //    a. if generated pin is already present in linking table, regenerate (repeat until unique pin is found)
    // 5. return unique pin as well as how long until it expires (300000ms, or 5 minutes)
}

export async function unlink(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.body === undefined || req.body.uuid === undefined || req.body.message === undefined) {
        res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: 'Invalid request body!' });
        return;
    }
    var chatEntry = { uuid: req.body.uuid, message: req.body.message, time: Date.now() };
    mysql.pool.query('INSERT INTO chat SET ?', chatEntry, function (error: any, results: any, fields: any) {
        if (error != null) {
            console.log(error);
        }
    });
    res.status(HttpStatus.OK).send({ success: true });
}
