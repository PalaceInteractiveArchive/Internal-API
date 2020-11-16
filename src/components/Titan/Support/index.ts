//import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { mongoPlayerAbsence } from '@/components/Titan/Support/model';
// import HttpError from '@/config/error';
// import UserService from '@/components/Titan/User/service';
// import config from '@/config/env';
// import Axios from 'axios';

export async function submitAbsence(req: Request, res: Response, next: NextFunction): Promise<void> {
    await mongoPlayerAbsence.create({ name: req.body.name, startDate: req.body.startDate, endDate: req.body.endDate, reason: req.body.reason })
    .then(result => {
        res.send(true);
    })
    .catch(err => {
        res.send(false);
    })
}

export async function getThreeMonths(req: Request, res: Response, next: NextFunction): Promise<void> {
    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    d.setHours(0, 0, 0);
    d.setMilliseconds(0);
    await mongoPlayerAbsence.find({ startDate: { $gte: Math.floor(d.getTime()/1000|0)}}).lean().exec(function (err, results) {
        res.send(results)
    })
}

export async function getNewAbsences(req: Request, res: Response, next: NextFunction): Promise<void> {
    await mongoPlayerAbsence.find({ endDate: { $gte: Math.floor(Date.now() / 1000)}}).lean().exec(function (err, results) {

        res.send(results)
    })
}