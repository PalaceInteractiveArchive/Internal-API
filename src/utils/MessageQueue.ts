import * as amqp from 'amqplib/callback_api';
import config from '@/config/env';
import ChatService from '@/components/Minecraft/Chat/service';

export class MessageQueue {

    public initializeQueueListener() {
        amqp.connect({
            hostname: config.messagequeue.hostname,
            port: config.messagequeue.port,
            username: config.messagequeue.username,
            password: config.messagequeue.password,
            vhost: config.messagequeue.vhost,
        }, function (err0: any, connection: amqp.Connection) {
            if (err0) {
                throw err0;
            }
            connection.createChannel(function (err1: any, channel: amqp.Channel) {
                if (err1) {
                    throw err1;
                }
                var queue = 'chat_analysis';

                channel.assertQueue(queue, {
                    durable: true
                });
                channel.assertExchange('proxy_direct', 'direct', {
                    durable: false
                });
                channel.prefetch(1);
                console.log(' [X] Listening for chat analysis requests');

                channel.consume(queue, function reply(msg) {
                    if (msg.content) {
                        console.log(" [x] %s", msg.content.toString());
                        var packet = JSON.parse(msg.content.toString());
                        if (packet.id && packet.id == 13 && packet.message) {
                            var message = packet.message;
                            console.log("Analysing message '" + message + "'...");
                            var swear = ChatService.swearCheck(message);
                            if (swear != null) {
                                var filter: string = swear[0];
                                var offendingText: string = swear[1];

                                var response = {
                                    id: 14,
                                    requestId: packet.requestId,
                                    okay: false,
                                    filter_caught: filter,
                                    offending_text: offendingText
                                }

                                channel.ack(msg);
                                channel.publish('proxy_direct', packet.sendingProxy, Buffer.from(JSON.stringify(response)));
                                return;
                            }
                            var link = ChatService.linkCheck(message);
                            if (link != null) {
                                var filter: string = link[0];
                                var offendingText: string = link[1];

                                var response = {
                                    id: 14,
                                    requestId: packet.requestId,
                                    okay: false,
                                    filter_caught: filter,
                                    offending_text: offendingText
                                }

                                channel.ack(msg);
                                channel.publish('proxy_direct', packet.sendingProxy, Buffer.from(JSON.stringify(response)));
                                return;
                            }
                            var character = ChatService.characterCheck(message);
                            if (character != null) {
                                var filter: string = character[0];
                                var offendingText: string = character[1];

                                var response = {
                                    id: 14,
                                    requestId: packet.requestId,
                                    okay: false,
                                    filter_caught: filter,
                                    offending_text: offendingText
                                }

                                channel.ack(msg);
                                channel.publish('proxy_direct', packet.sendingProxy, Buffer.from(JSON.stringify(response)));
                                return;
                            }

                            var response2 = {
                                id: 14,
                                requestId: packet.requestId,
                                okay: true,
                                message
                            }

                            channel.ack(msg);
                            channel.publish('proxy_direct', packet.sendingProxy, Buffer.from(JSON.stringify(response2)));
                        }
                    }
                }, { noAck: false });
            })
        });
    }
}