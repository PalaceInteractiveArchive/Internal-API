import Axios from 'axios'
import { Request, Response } from 'express'

export const Link = async (req: Request, response: Response) => {
  const client_id = '543141358496383048';
  const client_secret = 'RI_ubQFraTuKXPS9JFuczgZdF--4RaUX';
  const redirect_uri = 'https://dev-internal-api.palace.network/discord/verify';

  let code = req.query.code;
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
    .then((res) => {
      let data = res.data;
      response.send(data);
    })
    .catch((err) => {
      console.log(err);
      response.sendStatus(500);
    })
}

export const Verify = async (req: Request, res: Response) => {
  res.send({});
  res.sendStatus(200);
}
