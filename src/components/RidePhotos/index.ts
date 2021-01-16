import * as HttpStatus from 'http-status-codes';
import * as http from 'http';
import { HttpError } from "@/config/error";
import { NextFunction, Request, Response } from "express";
import TestTrack from "./TestTrack/index";
import SpaceMountain from "./SpaceMountain/index";
import {returnUsersRecent} from "./Player/index";
import { accessKeys } from "@/config/ridePhoto/access";
import HauntedMansion from './HauntedMansion';
import BuzzLightyear from './BuzzLightyear';
import RockNRoller from './RockNRoller';

export async function ridePhotoGen(req: Request, response: Response, next: NextFunction): Promise<void> {
    switch (req.params.ride) {
        case 'TestTrack':
            TestTrack(req, response, next);
            break;
        case 'SpaceMountain':
            SpaceMountain(req, response, next);
            break;
        case 'HauntedMansion':
            HauntedMansion(req, response, next)
            break;
        case 'BuzzLightyear':
            BuzzLightyear(req, response, next);
            break;
        case 'RockNRoller':
            RockNRoller(req, response, next);
            break;
        default:
            response.sendStatus(400);
            break;
    }
}

export async function checkAccess(req: Request, response: Response, next: NextFunction): Promise<void> {
    let accessToken: any = req.query.access;
    if (!accessToken) {
        return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
    }
    if (accessKeys.includes(accessToken)) {
        return next();
    } else {
        return next(new HttpError(HttpStatus.UNAUTHORIZED, http.STATUS_CODES[HttpStatus.UNAUTHORIZED]));
    }
}

export { returnUsersRecent }