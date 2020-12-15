//import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { mongoUser, mongoAlert } from '@/components/Titan/User/model';
// import HttpError from '@/config/error';
// import UserService from '@/components/Titan/User/service';
// import config from '@/config/env';

export async function updateUserSupport(req: Request, response: Response, next: NextFunction): Promise<void> {
    if (!req.body.accessToken) {
        response.send({});
    }

    switch (req.body.action) {
        case 'add':
            await mongoUser.updateOne({id: req.params.id}, { $addToSet: { allowedRoutes: "1"}}).lean().exec(function (err, results) {
                if (err) {
                    response.send(err)
                } else {
                    response.send(results)
                }
             });
            break;
            
        case 'remove':
            await mongoUser.updateOne({id: req.params.id}, { $pull: { allowedRoutes: "1"}}).lean().exec(function (err, results) {
                if (err) {
                    response.send(err)
                } else {
                    response.send(results)
                }
             });
             break;
        default:
            break;
    }
    

}

export async function updateUserChat(req: Request, response: Response, next: NextFunction): Promise<void> {
    if (!req.body.accessToken) {
        response.send({});
    }

    switch (req.body.action) {
        case 'add':
            await mongoUser.updateOne({id: req.params.id}, { $addToSet: { allowedRoutes: "2"}}).lean().exec(function (err, results) {
                if (err) {
                    response.send(err)
                } else {
                    response.send(results)
                }
             });
            break;
            
        case 'remove':
            await mongoUser.updateOne({id: req.params.id}, { $pull: { allowedRoutes: "2"}}).lean().exec(function (err, results) {
                if (err) {
                    response.send(err)
                } else {
                    response.send(results)
                }
             });
             break;
        default:
            break;
    }
    

}

export async function setAlert(req: Request, response: Response, next: NextFunction): Promise<void> {
    if (!req.body.accessToken) {
        response.send({});
    }
    if (!req.body.alertContent) {
        response.send({});
    }

    const alert = new mongoAlert({ id: Math.random().toString(36).slice(-6), message: req.body.alertContent});
    alert.save(function (err) {
        if (err) {
            response.send({ saved: false });
        }
        response.send({ saved: true })
    })

}