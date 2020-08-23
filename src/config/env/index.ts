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
        username: process.env.dbUsername,
        password: process.env.dbPassword,
        address: process.env.dbAddress,
        port: process.env.dbPort,
        database: process.env.dbDatabase
    }
}

export default config;
