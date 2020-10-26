import * as bcrypt from 'bcrypt';
import * as mongodb from '@/config/db/mongodb';
// import * as sql from '@/config/db/sql';
import * as crypto from 'crypto';
import { Document, Schema } from 'mongoose';
const mongoose = require('mongoose');
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
    rank: string;
    tags: [string];

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
        rank: String,
        tags: [String],
        
        staffPassword: String,
        titan: {
            email: String,
            token: String
        }
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

/*
OAuth Mongo Schema
*/
const mongoUserSchema = new mongoose.Schema({
    id: Number,
    name: String,
    pgroup: Number,
    avatar: String
});

/*
Players Schema
*/
const mongoPlayerSchema = new mongoose.Schema({
    uuid: String,
    username: String,
    rank: String,
    onlineTime: String,
    forums: {member_id: Number} 
});

/*
Helpme Schema
*/
const mongoHelpmeSchema = new mongoose.Schema({
    requesting: String,
    helping: String,
    time: Number
});

/*
Friend Schema
*/
const mongoFriendSchema = new mongoose.Schema({
    sending: String,
    recieving: String
});

export const mongoPlayer = mongodb.db.model('Player', mongoPlayerSchema, 'players');

export const mongoHelpme = mongodb.db.model('help_request', mongoHelpmeSchema, 'help_requests');

export const mongoUser = mongodb.db.model('User', mongoUserSchema, 'titan_users');

export const mongoFriend = mongodb.db.model('Friend', mongoFriendSchema, 'friends');


export default mongodb.db.model<IUserModel>('UserModel', UserSchema);
