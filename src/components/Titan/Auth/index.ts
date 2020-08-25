import * as HttpStatus from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { IUserModel, IUserRequest } from '@/components/Titan/User/model';
import HttpError from '@/config/error';
import AuthService from './service';
import UserService from '@/components/Titan/User/service';
import app from '@/config/server/server';

interface RequestWithUser extends Request {
    user: IUserRequest;
    token: string;
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user: IUserModel = await AuthService.getUser(req.body);

        const token: string = jwt.sign({ uuid: user.uuid, username: user.username }, app.get('secret'));

        user.titan.token = token;

        user.save();

        res.status(HttpStatus.OK)
            .header({
                Authorization: token,
            })
            .send({
                success: true
            });
    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(HttpStatus.BAD_REQUEST)
            .send({
                success: false,
                message: error.message,
            });
    }
}

export async function logout(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
        const user: IUserModel = await UserService.findOne(req.user.uuid);

        if (user.titan.token !== req.token) {
            res.status(HttpStatus.UNAUTHORIZED).send({ success: false, message: 'Invalid token!' });
            return;
        }

        user.titan.token = null;

        user.save();

        res.status(HttpStatus.OK)
            .send({
                success: true
            });
    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(HttpStatus.BAD_REQUEST)
            .send({
                success: false,
                message: error.message,
            });
    }
}

export async function user(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
        const user: IUserModel = await UserService.findOne(req.user.uuid, {
            uuid: 1, username: 1, rank: 1, tags: 1, titan: 1
        });

        if (user.titan === undefined || user.titan.token !== req.token) {
            res.status(HttpStatus.UNAUTHORIZED).send({ success: false, message: 'Invalid token!' });
            return;
        }

        const data = {
            uuid: user.uuid,
            username: user.username,
            rank: user.rank,
            rank_tags: user.tags
        }

        res.status(HttpStatus.OK)
            .send({
                success: true,
                user: data
            });
    } catch (error) {
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(HttpStatus.BAD_REQUEST)
            .send({
                success: false,
                message: error.message
            });
    }
}

// /**
//  * @export
//  * @param {RequestWithUser} req
//  * @param {Response} res
//  * @param {NextFunction} next
//  * @returns {Promise < void >}
//  */
// export async function user(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
//     try {
//         const user: IUserModel = await UserService.findOne(req.user.id);

//         res.status(HttpStatus.OK)
//             .send({ user });
//     } catch (error) {
//         if (error.code === HttpStatus.INTERNAL_SERVER_ERROR) {
//             return next(new HttpError(error.message.status, error.message));
//         }
//         res.status(HttpStatus.BAD_REQUEST)
//             .send({
//                 message: error.message,
//             });
//     }
// }
