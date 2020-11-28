const config = {
    oauth: {
        clientSecret: process.env.oauthClientSecret,
        clientId: process.env.oauthClientId
    },
    allowedGroups: [8, 4, 44, 19, 7, 33, 42, 6, 35, 37, 9, 40],
    sensitiveGroups: [8, 33, 4, 44, 7, 42]
}

export default config;