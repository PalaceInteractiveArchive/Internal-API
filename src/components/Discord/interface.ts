import { User } from 'discord.js';
import { IDiscordModel, LinkingInfo } from './model';

/**
 * @export
 * @interface IDiscordService
 */
export interface IDiscordService {
    findDiscordUserByTag(discordTag: string): Promise<User>;
    
    /**
     * @param {string} code
     * @returns {Promise<IDiscordModel>}
     * @memberof IDiscordService
     */
    findUserByUUID(uuid: string): Promise<IDiscordModel>;

    /**
     * @param {string} code
     * @returns {Promise<IDiscordModel>}
     * @memberof IDiscordService
     */
    findUserByDiscordID(discordId: string): Promise<IDiscordModel>;

    findLinkInfoByUUID(uuid: string): Promise<LinkingInfo>;

    findLinkInfoByDiscordID(discordId: string): Promise<LinkingInfo>;

    /**
     * @returns {Promise<Number>}
     * @memberof IDiscordService
     */
    generatePin(): Promise<Number>;

    /**
     * @param info the linking info
     */
    storeLinkInfo(info: LinkingInfo): Promise<void>;
}
