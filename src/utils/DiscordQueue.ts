import * as amqp from 'amqplib/callback_api';
import config from '@/config/env';

export class DiscordQueue {
    private channelInstance: amqp.Channel;

    public initializeQueueListener() {
        amqp.connect({
            hostname: config.messagequeue.hostname,
            port: config.messagequeue.port,
            username: config.messagequeue.discordUsername,
            password: config.messagequeue.discordPassword,
            vhost: 'palacemc',
        }, (err0: any, connection: amqp.Connection) => {
            if (err0) {
                throw err0;
            }
            connection.on("error", function(e: any) { console.log(e); setTimeout(this.initializeQueueListener, 2000) });
            connection.createChannel((err1: any, channel: amqp.Channel) => {
                if (err1) {
                    throw err1;
                }
                var queue = 'bot-networking';

                channel.assertQueue(queue, {
                    durable: true,
                    autoDelete: false
                });
                console.log('Opened Discord MQ')
                this.setChannelInstance(channel);
            });
        });
    }

    public sendQueueMsg(msg: object) {
        this.channelInstance.sendToQueue('bot-networking', Buffer.from(JSON.stringify(msg)));
    }

    public setChannelInstance(i: amqp.Channel) {
        this.channelInstance = i;
    }
}
