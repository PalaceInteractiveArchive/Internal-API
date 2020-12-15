//import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { mongoUser, mongoAlert } from '@/components/Titan/User/model';
// import HttpError from '@/config/error';
// import UserService from '@/components/Titan/User/service';
// import config from '@/config/env';

export async function getAlerts(req: Request, response: Response, next: NextFunction): Promise<void> {
    if (!req.body.accessToken) {
        response.send({});
    }

    await mongoAlert.find({}).exec(async function(err, results) {
        if (err) {
            response.send({});
        }
        var alertIds: String[] = [];

        results.forEach(element => {
            alertIds.push(element.id)
        });

        await mongoUser.findOne({ id: req.body.user.id}).exec(function (err, result2) {
            if (err) {
                response.send({});
            }

            var userAlerts: String[] = result2.readAlerts;

            var difference = alertIds.filter(item => userAlerts.indexOf(item) < 0);

            response.send(difference);
        })
    })
}

export async function getSingleAlert(req: Request, response: Response, next: NextFunction): Promise<void> {
    if (!req.body.accessToken) {
        response.send({});
    }

    await mongoAlert.findOne({ id: req.params.id }).exec(function (err, result) {
        if (err) {
            response.send({});
        }

        response.send(result)
    })
}

export async function setUserRead(req: Request, response: Response, next: NextFunction): Promise<void> {
    if (!req.body.accessToken) {
        response.send({});
    }

    await mongoUser.updateOne({id: req.body.user.id}, { $addToSet: { readAlerts: req.params.id }}).lean().exec(function (err, results) {
        if (err) {
            response.send(err)
        } else {
            response.send(true)
        }
     });

}