import DiscordModel, { IDiscordModel, LinkingInfo } from './model';
import { IDiscordService } from './interface';
import * as mysql from '../../config/db/sql';
import {Client, User} from 'discord.js';
import util = require('util');

const discordClient: Client = new Client({fetchAllMembers: true});
discordClient.login(process.env.DISCORD_BOT_TOKEN);

const pool = mysql.pool;
const query = util.promisify(pool.query).bind(pool);

/**
 * @export
 * @implements {IDiscordModelService}
 */
const DiscordService: IDiscordService = {
    async findDiscordUserByTag(discordTag: string): Promise<User> {
        var returningUser = null;
        await discordClient.guilds.fetch('582659944793243798').then(guild => {
            if (guild.available) {
                guild.members.fetch().then(users => {
                    const arr = users.array();
                    for (var i = 0; i < arr.length; i++) {
                        var user = arr[i];
                        if (user !== undefined && user != null) {
                            const tag = user.user.username + "#" + user.user.discriminator;
                            if (tag == discordTag) {
                                returningUser = user.user;
                                break;
                            }
                        }
                    }
                });
            }
        })
        return returningUser;
    },
    async findUserByUUID(uuid: string): Promise<IDiscordModel> {
        try {
            return await DiscordModel.findOne({ uuid }, { _id: 0 });
        } catch (error) {
            throw new Error(error.message);
        }
    },
    async findUserByDiscordID(discordId: string): Promise<IDiscordModel> {
        try {
            return await DiscordModel.findOne({ discordId }, { _id: 0 });
        } catch (error) {
            throw new Error(error.message);
        }
    },
    async findLinkInfoByUUID(uuid: string): Promise<LinkingInfo> {
        const results = await query('SELECT * FROM discord_linking WHERE minecraftUUID=?', uuid);
        if (results.length == 0) {
            return null;
        }
        const result = results[0];
        const info: LinkingInfo = {
            minecraftUUID: result['minecraftUUID'],
            discordId: result['discordId'],
            pin: result['pin'],
            expires: result['expires']
        }
        return info;
    },
    async findLinkInfoByDiscordID(discordId: string): Promise<LinkingInfo> {
        const results = await query('SELECT * FROM discord_linking WHERE discordId=?', discordId);
        if (results.length == 0) {
            return null;
        }
        const result = results[0];
        const info: LinkingInfo = {
            minecraftUUID: result['minecraftUUID'],
            discordId: result['discordId'],
            pin: result['pin'],
            expires: result['expires']
        }
        return info;
    },
    async generatePin(): Promise<Number> {
        try {
            var pin: Number;
            var pinToReturn: Number = null;
            var runs = 0;
            while (runs < 5 && pinToReturn == null) {
                pin = Math.floor(Math.random() * 900000) + 100000;
                runs++;
                const results = await query('SELECT pin FROM discord_linking WHERE pin=?', pin);
                if (results.length == 0) {
                    pinToReturn = pin;
                }
            }
            return pinToReturn;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    async storeLinkInfo(info: LinkingInfo): Promise<void> {
        try {
            const values = {
                minecraftUUID: info.minecraftUUID,
                discordId: info.discordId,
                pin: info.pin,
                expires: info.expires
            }
            await query('INSERT INTO discord_linking SET ?', values);
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

export default DiscordService;
