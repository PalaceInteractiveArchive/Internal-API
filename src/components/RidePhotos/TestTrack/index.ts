import { NextFunction, Request, Response } from "express";
const mergeImages = require('merge-images');
import { Canvas, Image } from "canvas";
const fs = require('fs');
const request = require('request');
const path = require('path');
const delay = (ms: any) => new Promise(res => setTimeout(res, ms));

export default async function TestTrack(req: Request, response: Response, next: NextFunction): Promise<void> {
    var playerArr = req.params.playerList.split(',');
    if (playerArr.length > 6) {
        response.sendStatus(400);
        return;
    }
    var players: String[] = [];
    var totalPlayers = 0;

    playerArr.forEach(element => {
        players.push(element)
        totalPlayers++;
    });
    for (let index = 0; index < 6- totalPlayers; index++) {
        players.push('');
    }
    players = await shuffle(players);


    var url = function(name: any, ratio: any, hr: any) {
        return `https://avatar.palace.network/3d.php?user=${name}&vr=-25&hr=${hr}&hrh=0&vrll=86&vrrl=86&vrla=30&vrra=36&displayHair=true&headOnly=false&format=png&ratio=${ratio}&aa=false&layers=true`
    }
    
    var downloaded = 0;
    var download = function(uri: any, filename: any){
        request.head(uri, async function(err: any, res: any, body: any){
            if (err) {
                console.error(err);
            }
          await request(uri).pipe(fs.createWriteStream(filename));
          await downloaded++;
          if (downloaded == 6) {
              makeFile();
          }
        });
    };
    
    var i = 0;
    
    
    async function createImg () {  
        for (const element of players) {
            i++;
            var picUrl;
            if (i == 4 || i == 5 || i == 6) {
                if (i == 6) {
                    picUrl = url(element, 7, '-50');
                } else {
                    picUrl = url(element, 6, '-50');
                }
            } else {
                picUrl = url(element, 6, '-50');
            }
            if (element == '') {
                fs.writeFile(path.join(__dirname,`../../../../storage/ride/tt/players/tempPlayer${i}.png`), 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==', 'base64', function(err: any) {
                    if (err) {
                        console.log(err);
                    }
                    downloaded++;
                });
            } else {
                download(picUrl, path.join(__dirname,`../../../../storage/ride/tt/players/tempPlayer${i}.png`));
            }
        }
    }
    path.join(__dirname,)
    async function makeFile() {
        await delay(1500);
        fs.readdir(path.join(__dirname,'../../../../storage/ride/tt/players'), (err: any, files: any) => {
            if (files.length == 6) {
                mergeImages([
                    { src: path.join(__dirname,'../../../../storage/ride/tt/background.png'), x: 0, y: 0 },
                    { src: path.join(__dirname,'../../../../storage/ride/tt/players/tempPlayer1.png'), x: 150, y: 130},
                    { src: path.join(__dirname,'../../../../storage/ride/tt/players/tempPlayer2.png'), x: 220, y: 150 },
                    { src: path.join(__dirname,'../../../../storage/ride/tt/players/tempPlayer3.png'), x: 280, y: 170 },
                    { src: path.join(__dirname,'../../../../storage/ride/tt/overlay-1.png'), x: 0, y: 0 },
                    { src: path.join(__dirname,'../../../../storage/ride/tt/players/tempPlayer4.png'), x: 20, y: 174},
                    { src: path.join(__dirname,'../../../../storage/ride/tt/players/tempPlayer5.png'), x: 90, y: 214 },
                    { src: path.join(__dirname,'../../../../storage/ride/tt/players/tempPlayer6.png'), x: 145, y: 252 },
                    { src: path.join(__dirname,'../../../../storage/ride/tt/overlay-2.png'), x: 0, y: 0 }
                ], {
                    Canvas: Canvas,
                    Image: Image
                })
                .then((b64: String) => {
                    var base64Data = b64.replace(/^data:image\/png;base64,/, "");
                    fs.writeFile(path.join(__dirname,"../../../../storage/ride/tt/tt.png"), base64Data, 'base64', async function(err: any) {
                        if (err) {
                            console.log(err);
                        }
                        fs.unlink(path.join(__dirname,'../../../../storage/ride/tt/players/tempPlayer1.png'), function(err: any) {
                            if (err) {
                              throw err
                            }
                        })
                        fs.unlink(path.join(__dirname,'../../../../storage/ride/tt/players/tempPlayer2.png'), function(err: any) {
                            if (err) {
                              throw err
                            }
                        })
                        fs.unlink(path.join(__dirname,'../../../../storage/ride/tt/players/tempPlayer3.png'), function(err: any) {
                            if (err) {
                              throw err
                            }
                        })
                        fs.unlink(path.join(__dirname,'../../../../storage/ride/tt/players/tempPlayer4.png'), function(err: any) {
                            if (err) {
                              throw err
                            }
                        })
                        fs.unlink(path.join(__dirname,'../../../../storage/ride/tt/players/tempPlayer5.png'), function(err: any) {
                            if (err) {
                              throw err
                            }
                        })
                        fs.unlink(path.join(__dirname,'../../../../storage/ride/tt/players/tempPlayer6.png'), function(err: any) {
                            if (err) {
                              throw err
                            }
                        })
                        console.log('[RidePhotos] Sent TT Pic')
                        response.sendFile(path.join(__dirname,"../../../../storage/ride/tt/tt.png"));
                        return;
                    });
                })
                .catch((err: any) => {
                    console.log('[RidePhotos] Error - rerunning ourself to see if this works.');
                    makeFile();
                })
            }
          });
    }
    
    createImg();
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
async function shuffle(a: String[]) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}