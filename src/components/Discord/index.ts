import Axios from 'axios'
import { Request, Response } from 'express'

export const Link = async (req: Request, res: Response) => {
    let client_id = '543141358496383048';
    let client_secret = 'RI_ubQFraTuKXPS9JFuczgZdF--4RaUX'
    let redirect_uri = 'https://internal-api.palace.network/discord/verify'

    await Axios.post('https://discord.com/api/oauth2/token', {
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': 'authorization_code',
        'code': req.params.code,
        'redirect_uri': redirect_uri
    })
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
    })
}

export const Verify = async (req: Request, res: Response) => {
    res.send({message: 'This is an endpoint, it doesn\'t work yet.'})
}
