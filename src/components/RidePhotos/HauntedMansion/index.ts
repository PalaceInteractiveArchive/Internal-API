import { NextFunction, Request, Response } from "express";
const mergeImages = require('merge-images');
import { Canvas, Image } from "canvas";
const fs = require('fs');
const request = require('request');
const path = require('path');
const delay = (ms: any) => new Promise(res => setTimeout(res, ms));

export default async function HauntedMansion(req: Request, response: Response, next: NextFunction): Promise<void> {
    var playerArr = req.params.playerList.split(',');
    if (playerArr.length > 2) {
        response.sendStatus(400);
        return;
    }
    var players: String[] = [];
    var totalPlayers = 0;

    playerArr.forEach(element => {
        players.push(element)
        totalPlayers++;
    });
    for (let index = 0; index < 2- totalPlayers; index++) {
        players.push('');
    }

    var url = function(name: any) {
        return `https://avatar.palace.network/3d.php?user=${name}&vr=-8&hr=0&hrh=-2&vrll=90&vrrl=90&vrla=0&vrra=0&displayHair=true&headOnly=false&format=png&ratio=7&aa=false&layers=true`
    }
    
    var downloaded = 0;
    var download = function(uri: any, filename: any){
        request.head(uri, async function(err: any, res: any, body: any){
            if (err) {
                console.error(err);
            }
          await request(uri).pipe(fs.createWriteStream(filename));
          await downloaded++;
          if (downloaded == 2) {
              makeFile();
          }
        });
    };
    
    var i = 0;
    
    
    async function createImg () {  
        for (const element of players) {
            i++;
            var picUrl = url(element);
            if (element == '') {
                fs.writeFile(path.join(__dirname,`../../../../storage/ride/hm/players/tempPlayer${i}.png`), 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==', 'base64', function(err: any) {
                    if (err) {
                        console.log(err);
                    }
                    downloaded++;
                });
            } else {
                download(picUrl, path.join(__dirname,`../../../../storage/ride/hm/players/tempPlayer${i}.png`));
            }
        }
    }
    path.join(__dirname,)
    async function makeFile() {
        await delay(1500);
        fs.readdir(path.join(__dirname,'../../../../storage/ride/hm/players'), (err: any, files: any) => {
            if (files.length == 2) {
                mergeImages([
                    { src: path.join(__dirname,'../../../../storage/ride/hm/background.png'), x: 0, y: 0 },
                    { src: path.join(__dirname,'../../../../storage/ride/hm/players/tempPlayer1.png'), x: 265, y: 200},
                    { src: path.join(__dirname,'../../../../storage/ride/hm/players/tempPlayer2.png'), x: 380, y: 200},
                    { src: path.join(__dirname,'../../../../storage/ride/hm/hm_overlay.png'), x: 0, y: 0 }
                ], {
                    Canvas: Canvas,
                    Image: Image
                })
                .then((b64: String) => {
                    var base64Data = b64.replace(/^data:image\/png;base64,/, "");
                    fs.writeFile(path.join(__dirname,"../../../../storage/ride/hm/hm.png"), base64Data, 'base64', async function(err: any) {
                        if (err) {
                            console.log(err);
                        }
                        fs.unlink(path.join(__dirname,'../../../../storage/ride/hm/players/tempPlayer1.png'), function(err: any) {
                            if (err) {
                              throw err
                            }
                        })
                        fs.unlink(path.join(__dirname,'../../../../storage/ride/hm/players/tempPlayer2.png'), function(err: any) {
                            if (err) {
                              throw err
                            }
                        })
                        console.log('[RidePhotos] Sent HM Pic')
                        response.sendFile(path.join(__dirname,"../../../../storage/ride/hm/hm.png"));
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
