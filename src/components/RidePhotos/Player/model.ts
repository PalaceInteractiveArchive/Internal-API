import * as mongodb from '@/config/db/mongodb';
const mongoose = require('mongoose');

/*
Photo Schema
*/
const mongoPhotoSchema = new mongoose.Schema({
    url: String,
    players: [String],
    info: String
});

export const mongoPhoto = mongodb.db.model('photopass', mongoPhotoSchema, 'photopass');

