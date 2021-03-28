import { mongoPlayer } from '@/components/Titan/User/model';
import { Request, Response } from 'express';

export const getPlayer = async (req: Request, res: Response):Promise<void> => {
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