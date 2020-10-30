import * as mysql from 'mysql';
import config from '@/config/env';
import Logger from '@/utils/Logger';

const pool = mysql.createPool({
    host: config.sql.address,
    port: parseInt(config.sql.port),
    user: config.sql.username,
    password: config.sql.password,
    database: config.sql.database
});

pool.on('connection', function (connection) {
    Logger.info('[MySQL] new connection');
});

export async function log(uuid: string, message: string) {
    var chatEntry = { uuid, message, time: Date.now() };
    pool.query('INSERT INTO chat SET ?', chatEntry, function (error:any, results:any, fields:any) {
        if (error != null) {
            console.log(error);
        }
    });
}
