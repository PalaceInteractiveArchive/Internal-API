const path = require('path');

module.exports = {
    openapi: '3.0.0',
    info: {
        // API informations (required)
        title: 'Palace Internal API', // Title (required)
        version: '1.0.0', // Version (required)
        description: 'Titan, Bungees, AudioServer, Core', // Description (optional)
    },
    servers: [
        { url: 'https://internal-api.palace.network' }
    ],
    apis: [path.join(__dirname, './src/**/**/*.ts')]
};
