import * as mongodb from '@/config/db/mongodb';
// import * as sql from '@/config/db/sql';
const mongoose = require('mongoose');


/* App Setting Schema */
const mongoAppSettingSchema = new mongoose.Schema({
    settingType: String,
    name: String,
    appId: Number,
    status: String,
    selectedUsers: Array,
    applicationLayout: Object
})

/* Player Schema */
const mongoPlayerSchema = new mongoose.Schema({
    uuid: String,
    username: String,
    rank: String,
    tags: Array,
    discordUsername: String,
    forums: Object,
    titanLogin: Object
})

/* Application Schema */
const mongoApplicationSchema = new mongoose.Schema({
    id: String,
    uuid: String,
    appId: String,
    application: Array,
    openToResponse: Boolean,
    responses: [{
        message: {
            blocks: Array,
            entityMap: { "type": [Object], "default": {} },
        },
        sender: String  
    }],
    outcome: String,
    notifyInGame: Boolean
})

export const mongoAppSetting = mongodb.db.model('App Setting', mongoAppSettingSchema, 'titan_settings');
export const mongoPlayer = mongodb.db.model('Player', mongoPlayerSchema, 'players');
export const mongoApplication = mongodb.db.model('Application', mongoApplicationSchema, 'titan_applications')
