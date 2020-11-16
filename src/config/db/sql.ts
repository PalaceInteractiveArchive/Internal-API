import * as mysql from 'mysql';
import config from '@/config/env';
import Logger from '@/utils/Logger';

export const pool: mysql.Pool = mysql.createPool({
    host: config.sql.address,
    port: parseInt(config.sql.port),
    user: config.sql.username,
    password: config.sql.password,
    database: config.sql.database
});

pool.on('connection', function (connection) {
    Logger.info('[MySQL] new connection');
});
