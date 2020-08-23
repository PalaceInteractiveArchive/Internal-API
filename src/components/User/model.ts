import * as bcrypt from 'bcrypt';
import * as mongodb from '@/config/db/mongodb';
// import * as sql from '@/config/db/sql';
import * as crypto from 'crypto';
import { Document, Schema } from 'mongoose';
import { NextFunction } from 'express';

/**
 * @export
 * @interface IUserRequest
 */
export interface IUserRequest {
    uuid: string;
    username: string;
}

/**
 * @export
 * @interface IUserModel
 * @extends {Document}
 */
export interface IUserModel extends Document {
    user: any;
    uuid: string;
    username: string;
    staffPassword: string;

    titan: {
        email: String,
        token: String
    },

    comparePassword: (password: string) => Promise<boolean>;
    gravatar: (size: number) => string;
}

const UserSchema: Schema = new Schema(
    {
        uuid: String,
        username: String,
        titan: {
            email: String,
            token: String
        },
        staffPassword: String
    },
    {
        collection: 'players',
        versionKey: false,
    }
).pre('save', async function (next: NextFunction): Promise<void> {
    const user: any = this; // tslint:disable-line

    if (!user.isModified('staffPassword')) {
        return next();
    }

    try {
        const salt: string = await bcrypt.genSalt(10);

        const hash: string = await bcrypt.hash(user.staffPassword, salt);

        user.staffPassword = hash;
        next();
    } catch (error) {
        return next(error);
    }
});

/**
 * Method for comparing passwords
 */
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        const match: boolean = await bcrypt.compare(candidatePassword, this.staffPassword);

        return match;
    } catch (error) {
        return error;
    }
};

/**
 * Helper method for getting user's gravatar.
 */
UserSchema.methods.gravatar = function (size: number): string {
    if (!size) {
        size = 200;
    }
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5: string = crypto
        .createHash('md5')
        .update(this.email)
        .digest('hex');

    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export default mongodb.db.model<IUserModel>('UserModel', UserSchema);
