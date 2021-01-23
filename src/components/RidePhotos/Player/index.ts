import { NextFunction, Request, Response } from 'express';
import { mongoPhoto } from '@/components/RidePhotos/Player/model';

export async function returnUsersRecent(req: Request, res: Response, next: NextFunction): Promise<void> {
    var date = new Date();
    date.setDate(date.getDate() - 30);
    const secondsSinceEpoch = Math.round(date.getTime() / 1000)
    await mongoPhoto.find({players: req.params.uuid, timestamp: { $gte: secondsSinceEpoch }}).sort({_id: -1}).limit(20).lean().exec(function (err, results) {
        if (err) {
            res.send({});
        }
        res.send(results);
    })
}