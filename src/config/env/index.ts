import * as dotenv from 'dotenv';

dotenv.config();

const config = {
    mongodb: {
        username: process.env.dbUsername,
        password: process.env.dbPassword,
        address: process.env.dbAddress,
        port: process.env.dbPort,
        database: process.env.dbDatabase
    },
    sql: {
        username: process.env.sqlUsername,
        password: process.env.sqlPassword,
        address: process.env.sqlAddress,
        port: process.env.sqlPort,
        database: process.env.sqlDatabase
    },
    oauth: {
        clientSecret: process.env.oauthClientSecret,
        clientId: process.env.oauthClientId,
        allowedGroups: [8, 4, 44]
    },
    messagequeue: {
        hostname: process.env.mqHostname,
        port: parseInt(process.env.mqPort),
        username: process.env.mqUsername,
        password: process.env.mqPassword,
        vhost: process.env.mqVhost
    },
    influx: {
        host: process.env.influxHost,
        port: parseInt(process.env.influxPort),
        username: process.env.influxUsername,
        password: process.env.influxPassword,
        database: process.env.influxDatabase
    }
}

export default config;
