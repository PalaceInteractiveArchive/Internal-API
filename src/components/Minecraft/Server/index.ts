import * as HttpStatus from 'http-status-codes';
// import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
// import { IPackModel } from '@/components/Minecraft/Packs/model';
// import HttpError from '@/config/error';
// import PackService from './service';

import mcping = require('mcping-js');

const server = new mcping.MinecraftServer('play.palace.network', 25565);

var cache = {
    online: false,
    players: 0,
    maxPlayers: 0,
    lastUpdated: 0,
    checking: false
};

export async function onlineCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!cache.checking && Date.now() - cache.lastUpdated <= 60000) {
            if (cache.online) {
                res.status(HttpStatus.OK).send({
                    online: cache.online,
                    players: cache.players,
                    maxPlayers: cache.maxPlayers
                });
            } else {
                res.status(HttpStatus.OK).send({
                    online: cache.online
                });
            }
        } else {
            cache.checking = true;
            server.ping(3000, 578, (err: any, resp: any) => {
                if (resp === undefined || resp == null) {
                    res.status(HttpStatus.OK).send({
                        online: false
                    });
                    cache.checking = false;
                    cache.online = false;
                } else {
                    var players = resp.players.online;
                    var maxPlayers = resp.players.max;
                    res.status(HttpStatus.OK).send({
                        online: true,
                        players,
                        maxPlayers
                    });
                    cache.checking = false;
                    cache.online = true;
                    cache.players = players;
                    cache.maxPlayers = maxPlayers;
                    cache.lastUpdated = Date.now();
                }
            });
        }
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send({
                success: false,
                message: error.message
            })
    }
}