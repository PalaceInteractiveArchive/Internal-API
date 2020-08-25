import * as mongodb from '@/config/db/mongodb';
import { Document, Schema } from 'mongoose';

/**
 * @export
 * @interface IUserModel
 * @extends {Document}
 */
export interface IPackModel extends Document {
    name: string;
    url: string;
    hash: string;
    versions: [{
        id: number;
        url: string;
        hash: string;
    }];
}

const PackSchema: Schema = new Schema(
    {
        name: String,
        url: String,
        hash: String,
        versions: [{
            id: Number,
            url: String,
            hash: String
        }]
    },
    {
        collection: 'resourcepacks',
        versionKey: false,
    }
);

export default mongodb.db.model<IPackModel>('PackModel', PackSchema);
