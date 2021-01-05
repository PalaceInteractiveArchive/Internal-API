import { NextFunction, Request, Response } from "express";
const mergeImages = require('merge-images');
import { Canvas, Image } from "canvas";
const fs = require('fs');
const request = require('request');
const path = require('path');

export default async function TestTrack(req: Request, response: Response, next: NextFunction): Promise<void> {

const url = `https://avatar.palace.network/3d.php?user=${req.params.playerList}&vr=-18&hr=-36&hrh=0&vrll=90&vrrl=90&vrla=30&vrra=30&displayHair=true&headOnly=false&format=png&ratio=12&aa=false&layers=true`;


var download = function(uri: any, filename: any, callback: any){
    request.head(uri, function(err: any, res: any, body: any){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};


download(url, path.join(__dirname,`../../../../storage/ride/sm/player/tempPlayer.png`), function(){
    mergeImages([
        { src: path.join(__dirname,`../../../../storage/ride/sm/background.png`), x: 0, y: 0 },
        { src: path.join(__dirname,`../../../../storage/ride/sm/player/tempPlayer.png`), x:135, y:70 },
        { src: path.join(__dirname,`../../../../storage/ride/sm/sm_overlay.png`), x: 0, y: 0 }
    ], {
        Canvas: Canvas,
        Image: Image
    })
    .then((b64: String) => {
        var base64Data = b64.replace(/^data:image\/png;base64,/, "");
        fs.writeFile(path.join(__dirname,`../../../../storage/ride/sm/out.png`), base64Data, 'base64', function(err: any) {
            if (err) {
                console.log(err);
            }
            fs.unlink(path.join(__dirname,'../../../../storage/ride/sm/player/tempPlayer.png'), function(err: any) {
                if (err) {
                  throw err
                }
            })
            console.log('[RidePhotos] Sent SM Pic');
            response.sendFile(path.join(__dirname,"../../../../storage/ride/sm/out.png"));
            return;
        });
    });
});
}
