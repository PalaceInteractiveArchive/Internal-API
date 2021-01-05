import { NextFunction, Request, Response } from 'express';
import { mongoPhoto } from '@/components/RidePhotos/Player/model';

export async function returnUsersRecent(req: Request, res: Response, next: NextFunction): Promise<void> {
    await mongoPhoto.find({players: req.params.uuid}).sort({_id: -1}).limit(20).lean().exec(function (err, results) {
        if (err) {
            res.send({});
        }
        res.send(results);
    })
}