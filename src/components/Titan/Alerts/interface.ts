import * as mongoose from 'mongoose';

export interface IAlertModel extends mongoose.Document {
    id: String;
    message: String;
}

export interface ITitanUser extends mongoose.Document {
    id: Number,
    name: String,
    pgroup: Number,
    avatar: String,
    allowedRoutes: [String],
    readAlerts: [String]
}