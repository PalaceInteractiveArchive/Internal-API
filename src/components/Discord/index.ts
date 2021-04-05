import Axios from 'axios'
import { Request, Response } from 'express'
import { mongoDPlayer } from './model';
import { BotServerCheck } from './service';

export const Link = async (req: Request, response: Response) => {
  const client_id = '543141358496383048';
  const client_secret = 'RI_ubQFraTuKXPS9JFuczgZdF--4RaUX';
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
  const config = {
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
            .then(() => response.send(data));
        })
        .catch((err) => {
          console.log(err.data)
          response.status(500).send({message: 'Failed to fetch discord user data.'})
        })
    })
    .catch((err) => {
      console.log(err)
      response.sendStatus(500)
    })
}

export const Verify = async (req: Request, response: Response) => {
  // const user = req.params.user;

}


export const Unlink = async (req: Request, response: Response) => {

}
