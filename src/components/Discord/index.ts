import Logger from '@/utils/Logger';
import Axios from 'axios'
import Config from '@/config/env';
import { Request, Response } from 'express'
import { mongoDPlayer } from './model';
import { DiscordQueue } from '@/utils/DiscordQueue';

const discordQueue: DiscordQueue = new DiscordQueue();
discordQueue.initializeQueueListener();

export const Link = async (req: Request, response: Response) => {
  const client_id = Config.discord.clientId;
  const client_secret = Config.discord.clientSecret;
  const redirect_uri = 'https://dev-internal-api.palace.network/discord/link';

  let code = req.query.code;
  let uuid = req.query.state as string;
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
  let decodedUUID = Buffer.from(uuid, 'base64').toString('ascii');
  await Axios.post('https://discord.com/api/oauth2/token', new URLSearchParams(data), config)
    .then(async (res) => {
      let data = res.data;
      await mongoDPlayer.findOneAndUpdate(
        { uuid: decodedUUID },
        { $set: {'discord.access_token': data.access_token, 'discord.expires_in': data.expires_in, 'discord.refresh_token': data.refresh_token}})
      let config = {
        headers: {
          authorization: `${data.token_type} ${data.access_token}`
        }
      }
      await Axios.get('https://discord.com/api/users/@me', config)
        .then(async (res) => {
          let data = res.data
          await mongoDPlayer.findOneAndUpdate({uuid: decodedUUID}, {$set: { 'discord.discordID': data.id}}, (e: any, doc: any) => {
            discordQueue.sendQueueMsg({id: 1, rank: doc.rank, username: doc.username, user: data.id, tags: doc.tags});
            response.redirect('https://discord.palace.network/?status=linked');
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

export const Unlink = async (req: Request, response: Response) => {

}