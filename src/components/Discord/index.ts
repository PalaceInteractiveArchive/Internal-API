import Logger from '@/utils/Logger';
import Axios from 'axios'
import Config from '@/config/env';
import { Request, response, Response } from 'express'
import { mongoDPlayer } from './model';

export const Link = async (req: Request, response: Response) => {
  const client_id = Config.discord.clientId;
  const client_secret = Config.discord.clientSecret;
  const redirect_uri = 'https://dev-internal-api.palace.network/discord/link';

  let code = req.query.code;
  let uuid = req.query.state;
  let data = {
    client_id: client_id,
    client_secret: client_secret,
    code: code.toString(),
    grant_type: 'authorization_code',
    redirect_uri: redirect_uri,
    scope: 'identify',
  }
  let config = {
    headers: {'content-type': 'application/x-www-form-urlencoded'}
  }
  await Axios.post('https://discord.com/api/oauth2/token', new URLSearchParams(data), config)
    .then(async (res) => {
      let data = res.data;
      await mongoDPlayer.findOneAndUpdate(
        { uuid: uuid },
        { $set: {'discord.access_token': data.access_token, 'discord.expires_in': data.expires_in, 'discord.refresh_token': data.refresh_token}})
      let config = {
        headers: {
          authorization: `${data.token_type} ${data.access_token}`
        }
      }
      await Axios.get('https://discord.com/api/users/@me', config)
        .then(async (res) => {
          let data = res.data
          await mongoDPlayer.findOneAndUpdate({uuid: uuid}, {$set: { 'discord.discordID': data.id}})
          BotServerCheck(data.id, uuid)
          .then(() => {
            response.send(data)
          })
        })
        .catch((err) => {
          Logger.error(err.data)
          response.status(500).send({message: 'Failed to fetch discord user data.'})
        })
    })
    .catch((err) => {
      Logger.error(err.data)
      response.sendStatus(500)
    })
}

const BotServerCheck = async (id: number, uuid: any) => {
  const palaceGuildId = Config.discord.guildId

  let config = {
    headers: {
      authorization: `Bot ${Config.discord.botToken}`
    }
  }

  await Axios.get(`https://discord.com/api/guilds${palaceGuildId}/members/${id}`, config)
    .then(async (res) => {
      let data = res.data;
      if (!data) {
        Logger.warn('This user does not belong to our Discord server!');
        await mongoDPlayer.findOneAndUpdate({uuid: uuid}, {$unset: { 'discord': ''}}, () => {
          response.status(200).send({ message: 'User is not part of our discord.'});
        })
      }
      Logger.info(data.user)
    })
    .catch((err) => {
      Logger.error(err)
    })
}

export const Unlink = async (req: Request, response: Response) => {

}
