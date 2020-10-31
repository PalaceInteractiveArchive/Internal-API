import * as mongodb from '@/config/db/mongodb';
import { Document, Schema } from 'mongoose';

/**
 * @export
 * @interface IUserModel
 * @extends {Document}
 */
export interface IDiscordModel extends Document {
    uuid: string;
    discordId: string;
}

export class LinkingInfo {
    minecraftUUID: string;
    discordId: string;
    pin: Number;
    expires: Number;
}

const DiscordSchema: Schema = new Schema(
    {
        uuid: String,
        discordId: String
    },
    {
        collection: 'players',
        versionKey: false,
    }
);

export default mongodb.db.model<IDiscordModel>('DiscordModel', DiscordSchema);
