import * as mongodb from '@/config/db/mongodb';
// import * as sql from '@/config/db/sql';
const mongoose = require('mongoose');


/* Alert Schema */
const mongoAppSettingSchema = new mongoose.Schema({
    settingType: String,
    name: String,
    appId: Number,
    applicationLayout: Object
})


export const mongoAppSetting = mongodb.db.model('App Setting', mongoAppSettingSchema, 'titan_settings');
