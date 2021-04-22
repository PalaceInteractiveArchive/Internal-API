import { Schema } from 'mongoose';
import * as mongodb from '@/config/db/mongodb';

let PlayerSchema = new Schema({
  uuid: String,
  username: String,
  rank: String,
  tags: [String],
  discord: {
    access_token: String,
    expires_in: Number,
    refresh_token: String,
    discordID: String,
  }
});

export const mongoDPlayer = mongodb.db.model('Player', PlayerSchema, 'players');
