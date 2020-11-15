import * as mongodb from '@/config/db/mongodb';
// import * as sql from '@/config/db/sql';
const mongoose = require('mongoose');


/*
Absence Schema
*/
const mongoPlayerAbsenceSchema = new mongoose.Schema({
    name: String,
    startDate: Number,
    endDate: Number,
    reason: String
})

export const mongoPlayerAbsence = mongodb.db.model('Absence', mongoPlayerAbsenceSchema, 'titan_absence')