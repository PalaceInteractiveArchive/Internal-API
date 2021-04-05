import Logger from "@/utils/Logger";
import Axios from "axios"
import { mongoDPlayer } from "./model";

const config = {
  headers: {
    Authorization: "Bot NTQzMTQxMzU4NDk2MzgzMDQ4.XFx9zg.8cxp7dBLDgjjvkrXyErfrDZqGeE"
  }
}
const palaceGuildID = "809995525210243072"

export const BotServerCheck = async (id: number, uuid: any) => {
  await Axios.get(`https://discord.com/api/guilds/${palaceGuildID}/members/${id}`, config)
    .then(async (res) => {
      let data = res.data;
      if (!data) {
        Logger.warn('This user does not belong to our Discord server!');
        await mongoDPlayer.findOneAndUpdate({ uuid: uuid }, { $unset: { 'discord': ""} }, () => {
          Logger.info
        })
      } else {
        Logger.info(data.user);
      }
    })
    .catch((err) => {
      Logger.error(err);
    })
}
