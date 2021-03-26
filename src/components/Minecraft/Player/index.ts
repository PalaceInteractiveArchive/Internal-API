import { mongoPlayer } from '@/components/Titan/User/model';
import { Request, Response, NextFunction } from 'express';

export const getPlayer = async (req: Request, response: Response, next: NextFunction):Promise<void> => {
    await mongoPlayer.find({username: req.params.user}).lean().exec((err, results) => {
        if (!results.length) response.send({})
        let temp = JSON.stringify(results[0])
        let resJson = JSON.parse(temp)
        let pResult = {uuid: resJson.uuid, username: resJson.username, rank: resJson.rank, onlineTime: resJson.onlineTime, tokens: resJson.tokens, balance: resJson.balance, tags: resJson.tags, server: resJson.server }
        response.send(pResult)
    }).catch((err) => {
        console.error(err);
    })
}