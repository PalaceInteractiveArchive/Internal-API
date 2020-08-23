import * as mongoose from 'mongoose';
import config from '@/config/env';
import Logger from '@/utils/Logger';

const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    auth: {
        user: config.mongodb.username,
        password: config.mongodb.password
    },
    authSource: config.mongodb.database
};

const MONGO_URI: string = `mongodb://${config.mongodb.address}:${config.mongodb.port}/${config.mongodb.database}`;

console.log(MONGO_URI);

export const db: mongoose.Connection = mongoose.createConnection(MONGO_URI, connectOptions);

// handlers
db.on('connecting', () => {
    Logger.info('[MongoDB] connecting');
});

db.on('error', (error: any) => {
    Logger.error(`[MongoDB] connection ${error}`);
    mongoose.disconnect();
});

db.on('connected', () => {
    Logger.info('[MongoDB] connected');
});

db.once('open', () => {
    Logger.info('[MongoDB] connection opened');
});

db.on('reconnected', () => {
    Logger.warn('[MongoDB] reconnected');
});

db.on('reconnectFailed', () => {
    Logger.error('[MongoDB] reconnectFailed');
});

db.on('disconnected', () => {
    Logger.warn('[MongoDB] disconnected');
});

db.on('fullsetup', () => {
    Logger.debug('[MongoDB] reconnecting... %d');
});
