import * as HttpStatus from 'http-status-codes';
// import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { IPackModel } from '@/components/Minecraft/Packs/model';
import HttpError from '@/config/error';
import PackService from './service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const packs: IPackModel[] = await PackService.findAll();

        res.status(HttpStatus.OK)
            .send({
                success: true,
                packs
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

export async function get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        var version = undefined;
        if (req.query.version) {
            version = parseInt(req.query.version.toString());
        }
        
        const pack: IPackModel = await PackService.findOne(req.query.name.toString(), version);

        if (pack === undefined || pack == null) {
            res.status(HttpStatus.NOT_FOUND)
                .send({
                    success: false,
                    message: "Pack not found!"
                });
            return;
        }

        if (pack.versions) {
            for (let i = 0; i < pack.versions.length; i++) {
                const ver = pack.versions[i];
                if (ver.id === version) {
                    res.status(HttpStatus.OK)
                        .send({
                            success: true,
                            pack: {
                                name: pack.name,
                                version: ver.id,
                                url: ver.url,
                                hash: ver.hash
                            }
                        });
                    return;
                }
            }
        }

        res.status(HttpStatus.OK)
            .send({
                success: true,
                pack
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