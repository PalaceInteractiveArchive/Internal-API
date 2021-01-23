import { NextFunction, Request, Response } from "express";
const mergeImages = require('merge-images');
import { Canvas, Image } from "canvas";
const fs = require('fs');
const request = require('request');
const path = require('path');
const delay = (ms: any) => new Promise(res => setTimeout(res, ms));

export default async function RockNRoller(req: Request, response: Response, next: NextFunction): Promise<void> {
    var playerArr = req.params.playerList.split(',');
    if (playerArr.length > 4) {
        response.sendStatus(400);
        return;
    }
    var players: String[] = [];
    var totalPlayers = 0;

    playerArr.forEach(element => {
        players.push(element)
        totalPlayers++;
    });
    for (let index = 0; index < 4- totalPlayers; index++) {
        players.push('');
    }
    players = await shuffle(players);


    var url = function(name: any, ratio: any, hr: any) {
        return `https://avatar.palace.network/3d.php?user=${name}&vr=-18&hr=${hr}&hrh=0&vrll=90&vrrl=90&vrla=30&vrra=30&displayHair=true&headOnly=false&format=png&ratio=${ratio}&aa=false&layers=true`
        //return `https://avatar.palace.network/3d.php?user=${name}&vr=-25&hr=${hr}&hrh=0&vrll=86&vrrl=86&vrla=30&vrra=36&displayHair=true&headOnly=false&format=png&ratio=${ratio}&aa=false&layers=true`
    }
    
    var downloaded = 0;
    var download = function(uri: any, filename: any){
        request.head(uri, async function(err: any, res: any, body: any){
            if (err) {
                console.error(err);
            }
          await request(uri).pipe(fs.createWriteStream(filename));
          await downloaded++;
          if (downloaded == 4) {
              makeFile();
          }
        });
    };
    
    var i = 0;
    
    
    async function createImg () {  
        for (const element of players) {
            i++;
            var picUrl;
            if (i == 2) {
                picUrl = url(element, 4.4, '-30');
            } else if (i == 4) {
                picUrl = url(element, 5, '-27;');
            } else {
                picUrl = url(element, 4.8, '-37');
            }
            if (element == '') {
                fs.writeFile(path.join(__dirname,`../../../../storage/ride/rrc/players/tempPlayer${i}.png`), 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==', 'base64', function(err: any) {
                    if (err) {
                        console.log(err);
                    }
                    downloaded++;
                });
            } else {
                download(picUrl, path.join(__dirname,`../../../../storage/ride/rrc/players/tempPlayer${i}.png`));
            }
        }
    }
    path.join(__dirname,)
    async function makeFile() {
        await delay(1500);
        fs.readdir(path.join(__dirname,'../../../../storage/ride/rrc/players'), (err: any, files: any) => {
            if (files.length == 4) {
                mergeImages([
                    { src: path.join(__dirname,'../../../../storage/ride/rrc/background.png'), x: 0, y: 0 },
                    { src: path.join(__dirname,'../../../../storage/ride/rrc/players/tempPlayer1.png'), x: 191, y: 206},
                    { src: path.join(__dirname,'../../../../storage/ride/rrc/players/tempPlayer2.png'), x: 278, y: 230 },
                    { src: path.join(__dirname,'../../../../storage/ride/rrc/overlay-1.png'), x: 0, y: 0 },
                    { src: path.join(__dirname,'../../../../storage/ride/rrc/players/tempPlayer3.png'), x: 155, y: 250},
                    { src: path.join(__dirname,'../../../../storage/ride/rrc/players/tempPlayer4.png'), x: 239, y: 275 },
                    { src: path.join(__dirname,'../../../../storage/ride/rrc/overlay-2.png'), x: 0, y: 0 }
                ], {
                    Canvas: Canvas,
                    Image: Image
                })
                .then((b64: String) => {
                    var base64Data = b64.replace(/^data:image\/png;base64,/, "");
                    fs.writeFile(path.join(__dirname,"../../../../storage/ride/rrc/rrc.png"), base64Data, 'base64', async function(err: any) {
                        if (err) {
                            console.log(err);
                        }
                        fs.unlink(path.join(__dirname,'../../../../storage/ride/rrc/players/tempPlayer1.png'), function(err: any) {
                            if (err) {
                              throw err
                            }
                        })
                        fs.unlink(path.join(__dirname,'../../../../storage/ride/rrc/players/tempPlayer2.png'), function(err: any) {
                            if (err) {
                              throw err
                            }
                        })
                        fs.unlink(path.join(__dirname,'../../../../storage/ride/rrc/players/tempPlayer3.png'), function(err: any) {
                            if (err) {
                              throw err
                            }
                        })
                        fs.unlink(path.join(__dirname,'../../../../storage/ride/rrc/players/tempPlayer4.png'), function(err: any) {
                            if (err) {
                              throw err
                            }
                        })
                        console.log('[RidePhotos] Sent RRC Pic')
                        response.sendFile(path.join(__dirname,"../../../../storage/ride/rrc/rrc.png"));
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

export async function EmptyRRC(req: Request, response: Response, next: NextFunction): Promise<void> {
    mergeImages([
        { src: path.join(__dirname,'../../../../storage/ride/rrc/background.png'), x: 0, y: 0 },
        { src: path.join(__dirname,'../../../../storage/ride/rrc/overlay-1.png'), x: 0, y: 0 },
        { src: path.join(__dirname,'../../../../storage/ride/rrc/overlay-2.png'), x: 0, y: 0 }
    ], {
        Canvas: Canvas,
        Image: Image
    })
    .then((b64: String) => {
        var base64Data = b64.replace(/^data:image\/png;base64,/, "");
        fs.writeFile(path.join(__dirname,"../../../../storage/ride/rrc/rrc.png"), base64Data, 'base64', async function(err: any) {
            if (err) {
                console.log(err);
            }
            console.log('[RidePhotos] Sent Empty RRC Pic')
            response.sendFile(path.join(__dirname,"../../../../storage/ride/rrc/rrc.png"));
            return;
        });
    })
    .catch((err: any) => {
        console.log('[RidePhotos] Error');
    })
}
