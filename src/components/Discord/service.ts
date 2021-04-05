import Axios from "axios"
import { mongoDPlayer } from "./model";

export const BotServerCheck = async (id: number, uuid: any) => {
  const config = {
    headers: {
      Authorization: "Bot NTQzMTQxMzU4NDk2MzgzMDQ4.XFx9zg.8cxp7dBLDgjjvkrXyErfrDZqGeE"
    }
  }
  await Axios.get(`https://discord.com/api/guilds/809995525210243072/members/${id}`, config)
    .then(async (res) => {
      let data = res.data;
      if (!data) {
        console.log('This user is not apart of our Discord server!');
        await mongoDPlayer.findOneAndUpdate({ uuid: uuid }, { $unset: { 'discord': ""} }, () => {
          console.log
        })
      } else {
        console.log(data.user);
      }
    })
    .catch((err) => {
      console.log(err);
    })
}
