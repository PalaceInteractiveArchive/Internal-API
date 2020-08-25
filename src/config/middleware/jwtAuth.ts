import * as HttpStatus from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import app from '@/config/server/server';
import HttpError from '@/config/error';
import * as http from 'http';

interface RequestWithUser extends Request {
    user: object | string;
    token: string;
}

interface RequestWithService extends Request {
    service: object | string;
    token: string;
}

/**
 *
 * @param {RequestWithUser} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 * @swagger
 *  components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
export function isUserAuthenticated(req: RequestWithUser, res: Response, next: NextFunction): void {
    const token: any = req.headers.authorization;

    if (token && token.indexOf('Bearer ') !== -1) {
        try {
            const bearerToken = token.split('Bearer ')[1];
            const user: object | string = jwt.verify(bearerToken, app.get('secret'));

            req.user = user;
            req.token = bearerToken;

            return next();
        } catch (error) {
            return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
        }
    }

    return next(new HttpError(HttpStatus.BAD_REQUEST, 'No token provided'));
}

export function isServiceAuthenticated(req: RequestWithService, res: Response, next: NextFunction): void {
    const token: any = req.headers.authorization;

    if (token && token.indexOf('Bearer ') !== -1) {
        try {
            const bearerToken = token.split('Bearer ')[1];
            const service: object | string = jwt.verify(bearerToken, app.get('secret'));

            req.service = service;
            req.token = bearerToken;

            return next();
        } catch (error) {
            return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
        }
    }

    return next(new HttpError(HttpStatus.BAD_REQUEST, 'No token provided'));
}
