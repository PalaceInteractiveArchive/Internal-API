import * as mysql from 'mysql';
import config from '@/config/env';
import Logger from '@/utils/Logger';

const pool = mysql.createPool({
    host: config.sql.address + ":" + config.sql.port,
    user: config.sql.username,
    password: config.sql.password,
    database: config.sql.database
});

var getConnection = function(callback: (err: mysql.MysqlError, connection: mysql.PoolConnection) => void) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

pool.on('connection', function (connection) {
    Logger.info('[MySQL] new connection');
});

// const connectOptions = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     auth: {
//         user: config.database.username,
//         password: config.database.password
//     },
//     authSource: config.database.database
// };

// const MONGO_URI: string = `mongodb://${config.database.address}:${config.database.port}/${config.database.database}`;

// console.log(MONGO_URI);

// export const db: mongoose.Connection = mongoose.createConnection(MONGO_URI, connectOptions);

// // handlers
// db.on('connecting', () => {
//     Logger.info('[MongoDB] connecting');
// });

// db.on('error', (error: any) => {
//     Logger.error(`[MongoDB] connection ${error}`);
//     mongoose.disconnect();
// });

// db.on('connected', () => {
//     Logger.info('[MongoDB] connected');
// });

// db.once('open', () => {
//     Logger.info('[MongoDB] connection opened');
// });

// db.on('reconnected', () => {
//     Logger.warn('[MongoDB] reconnected');
// });

// db.on('reconnectFailed', () => {
//     Logger.error('[MongoDB] reconnectFailed');
// });

// db.on('disconnected', () => {
//     Logger.warn('[MongoDB] disconnected');
// });

// db.on('fullsetup', () => {
//     Logger.debug('[MongoDB] reconnecting... %d');
// });

module.exports = getConnection;