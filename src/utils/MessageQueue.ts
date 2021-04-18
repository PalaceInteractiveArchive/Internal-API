import * as amqp from 'amqplib/callback_api';
import config from '@/config/env';
import ChatService from '@/components/Minecraft/Chat/service';
import * as influx from '@/config/db/influx';

interface KVP {
    [key: string]: object;
}

interface KSP {
    [key: string]: string;
}

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
            connection.on("error", function(e: any) { console.log(e); setTimeout(this.initializeQueueListener, 2000) });
            connection.createChannel(function (err1: any, channel: amqp.Channel) {
                if (err1) {
                    throw err1;
                }
                var queue = 'chat_analysis';

                channel.assertQueue(queue, {
                    durable: true,
                    autoDelete: false
                });
                channel.assertExchange('proxy_direct', 'direct', {
                    durable: false
                });
                channel.prefetch(1);
                console.log(' [X] Listening for chat analysis requests');

                channel.consume(queue, function reply(msg) {
                    try {
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
                            } else {
                                console.log("Invalid packet: " + msg.content.toString());
                                channel.ack(msg);
                            }
                        }
                    } catch (error) {
                        console.log("Error handling message: " + error);
                        channel.ack(msg);
                    }
                }, { noAck: false });
            });

            connection.createChannel(function (err1: any, channel: amqp.Channel) {
                if (err1) {
                    throw err1;
                }
                var queue = 'statistics';

                channel.assertQueue(queue, {
                    durable: true,
                    autoDelete: false
                });
                channel.prefetch(1);
                console.log(' [X] Listening for statistics requests');

                channel.consume(queue, function reply(msg) {
                    try {
                        if (msg.content) {
                            console.log(" [x] %s", msg.content.toString());
                            var packet = JSON.parse(msg.content.toString());
                            if (packet.id && packet.id == 35 && packet.measurement) {
                                var measurement = packet.measurement;
                                var packetFields = packet.fields;
                                var packetTags = packet.tags;

                                var tags: KSP = {};
                                var fields: KVP = {};

                                for (var i = 0; i < packetFields.length; i++) {
                                    var obj = packetFields[i];
                                    var key = obj.key;
                                    var value = obj.value;
                                    fields[key] = value;
                                }

                                for (var i = 0; i < packetTags.length; i++) {
                                    var obj = packetTags[i];
                                    var key = obj.key;
                                    var value = obj.value;
                                    tags[key] = value;
                                }

                                influx.influx.writePoints([{
                                    measurement,
                                    tags,
                                    fields
                                }]).catch((err) => {
                                    console.error(`Error saving data to InfluxDB! ${err.stack}`);
                                });

                                channel.ack(msg);
                            } else {
                                console.log("Invalid packet: " + msg.content.toString());
                                channel.ack(msg);
                            }
                        }
                    } catch (error) {
                        console.log("Error handling message: " + error);
                        channel.ack(msg);
                    }
                }, { noAck: false });
            });

          connection.createChannel((err2: any, channel: amqp.Channel) => {
            if (err2) throw err2;
            let queue = 'all_mc';

            channel.assertQueue(queue, {
              durable: false
            })

            console.log(" [*] Waiting for messages in %s", queue);
            channel.consume(queue, (msg) => {
                console.log("[*] Receieved %s", msg.content.toString());
            }, {
                noAck: true
            })
          })
        });
    }
}
