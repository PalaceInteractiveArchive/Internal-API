import * as HttpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { mongoApplication, mongoAppSetting, mongoPlayer } from "./model";
import { mongoUser } from "@/components/Titan/User/model";
import HttpError from "@/config/error";
// import UserService from '@/components/Titan/User/service';
// import config from '@/config/env';
import Axios from "axios";
import * as http from "http";
import config from '@/config/titan/index';
import names from "./consts";
import { Webhook, MessageBuilder } from 'discord-webhook-node';
const hook = new Webhook("https://discord.com/api/webhooks/816980178856574997/EsLgbFM5sDIwJ73wzF6s3yh_THC5o6tIDSDsGedrgKfNR8YowOdMLPDj7EOJ2u1_WR33");

export async function oAuthFormCheck(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.body.formData.additional.accessToken) {
    return next(
      new HttpError(
        HttpStatus.UNAUTHORIZED,
        http.STATUS_CODES[HttpStatus.UNAUTHORIZED]
      )
    );
  } else {
    Axios({
      method: "GET",
      url: "https://forums.palace.network/api/core/me",
      headers: {
        authorization: `Bearer ${req.body.formData.additional.accessToken}`,
      },
    })
      .then(async function (res2: any) {
        var user = {
          id: res2.data.id,
          name: res2.data.name,
          pgroup: res2.data.primaryGroup.id,
          avatar: res2.data.photoUrl,
          sgroups: res2.data.secondaryGroups,
        };
        if (user.pgroup === req.body.formData.additional.user.pgroup) {
          let sGroups = await Axios.get(
            `https://forums.palace.network/api/core/members/${user.id}?key=${config.ipbApi}`
          );
          await mongoUser
            .findOne({ id: user.id })
            .exec(function (err, results) {
              if (err) {
                return next(
                  new HttpError(
                    HttpStatus.UNAUTHORIZED,
                    http.STATUS_CODES[HttpStatus.UNAUTHORIZED]
                  )
                );
              }
              var sGroupFound = false;
              sGroups.data.secondaryGroups.forEach((element: any) => {
                if (
                  config.sensitiveGroups.includes(element.id) &&
                  !sGroupFound
                ) {
                  sGroupFound = true;
                  return next();
                }
              });
              if (!sGroupFound) {
                if (
                  results.toObject().allowedRoutes.includes(req.body.routeType)
                ) {
                  return next();
                } else {
                  if (config.sensitiveGroups.includes(user.pgroup)) {
                    return next();
                  } else {
                    // they got in, but are not in the right group - kick them out
                    console.log("wrong group");
                    return next(
                      new HttpError(
                        HttpStatus.UNAUTHORIZED,
                        http.STATUS_CODES[HttpStatus.UNAUTHORIZED]
                      )
                    );
                  }
                }
              }
            });
        } else {
          // user has been updated on IPB or they tampered with the cookie - kick them out
          console.log("tampered");
          return next(
            new HttpError(
              HttpStatus.UNAUTHORIZED,
              http.STATUS_CODES[HttpStatus.UNAUTHORIZED]
            )
          );
        }
      })
      .catch(function (err) {
        console.log(err);
        return next(
          new HttpError(
            HttpStatus.UNAUTHORIZED,
            http.STATUS_CODES[HttpStatus.UNAUTHORIZED]
          )
        );
      });
  }

}

export async function saveFormData(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  var formId = req.params.formId;
  if (formId === null) {
    return next(
      new HttpError(
        HttpStatus.BAD_REQUEST,
        http.STATUS_CODES[HttpStatus.BAD_REQUEST]
      )
    );
  } else {
    await mongoAppSetting.findOneAndUpdate(
      { settingType: "applicationType", appId: formId },
      { applicationLayout: req.body.formData.task_data },
      { upsert: true },
      function (err, result) {
        if (err) {
          return console.error(err);
        } else {
          res.sendStatus(200);
        }
      }
    );
  }
}

export async function returnFormData(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  var formId = req.params.formId;
  if (formId === null) {
    return next(
      new HttpError(
        HttpStatus.BAD_REQUEST,
        http.STATUS_CODES[HttpStatus.BAD_REQUEST]
      )
    );
  }
  await mongoAppSetting
    .findOne({ settingType: "applicationType", appId: formId })
    .exec(function (err, result) {
      if (err) {
        return next(
          new HttpError(
            HttpStatus.BAD_REQUEST,
            http.STATUS_CODES[HttpStatus.BAD_REQUEST]
          )
        );
      }
      res.send(result.toObject().applicationLayout);
    });
}

export async function returnAllTypes(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await mongoAppSetting
      .find({ settingType: "applicationType" })
      .exec(function (err, result) {
        if (err) {
          return next(
            new HttpError(
              HttpStatus.BAD_REQUEST,
              http.STATUS_CODES[HttpStatus.BAD_REQUEST]
            )
          );
        }
        res.send(result);
      });
}

export async function changeStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  var formId = req.params.formId;
  if (formId === null) {
    return next(
      new HttpError(
        HttpStatus.BAD_REQUEST,
        http.STATUS_CODES[HttpStatus.BAD_REQUEST]
      )
    );
  } else {
    switch (req.params.status) {
      case "open":
        await mongoAppSetting.findOneAndUpdate(
          { settingType: "applicationType", appId: formId },
          { status: "Open" },
          { upsert: true },
          function (err, result) {
            if (err) {
              return console.error(err);
            } else {
              res.sendStatus(200);
            }
          }
        );
        break;
      case "closed":
        await mongoAppSetting.findOneAndUpdate(
          { settingType: "applicationType", appId: formId },
          { status: "Closed" },
          { upsert: true },
          function (err, result) {
            if (err) {
              return console.error(err);
            } else {
              res.sendStatus(200);
            }
          }
        );
        break;
      case "selected":
        await mongoAppSetting.findOneAndUpdate(
          { settingType: "applicationType", appId: formId },
          { status: "Selected", selectedUsers: req.body.selected },
          { upsert: true },
          function (err, result) {
            if (err) {
              return console.error(err);
            } else {
              res.sendStatus(200);
            }
          }
        );
        break;
      default:
        res.sendStatus(403);
        break;
    }
  }
}

export async function checkLoginCode(req: Request, res: Response, next: NextFunction): Promise<void> {
  let loginCode = req.params.loginCode;
  let uuid = req.params.uuid;
  await mongoPlayer.findOne({ uuid: uuid }).exec(function (err, result) {
    if (err) {
      res.sendStatus(500);
    }
    try {
      console.log(loginCode)
      console.log(result.toObject().titanLogin)
      if (loginCode === result.toObject().titanLogin.code && result.toObject().titanLogin.expires > Math.floor(Date.now() / 1000)) {
        let mongoObj = result.toObject();
        let sentObj: {[k: string]: any} = {};
        sentObj.username = mongoObj.username;
        sentObj.uuid = mongoObj.uuid;
        sentObj.loginCode = mongoObj.titanLogin;
        sentObj.rank = mongoObj.rank;
        sentObj.tags = mongoObj.tags;
        sentObj.forums = mongoObj.forums;
        sentObj.discord = mongoObj.discordUsername; 
        res.send(sentObj);
      } else {
        res.sendStatus(403);
      }
    } catch(err) {
        console.log("Failed Titan Application Auth")
    }
  })
}

export async function returnAllowed(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let groups = names;
  await mongoAppSetting
    .find({ settingType: "applicationType" })
    .exec(function (err, result) {
      if (err) {
        console.log(err);
        return next(
          new HttpError(
            HttpStatus.BAD_REQUEST,
            http.STATUS_CODES[HttpStatus.BAD_REQUEST]
          )
        );
      }
      let rank = groups.get(req.body.user.rank);
      let tags = [Number];
      req.body.user.tags.forEach((e: Number) => {
        let tag = groups.get(e);
        if (tag != undefined) {
          tags.push(tag);
        }
      });
      let apps: any = [];
      result.forEach(e => {
        let entry = e.toObject();
        if (rank !== null) {
          if (entry.status === "Open") {
            apps.push(entry);
          }
          if (entry.status === "Selected") {
            if (entry.selectedUsers.includes(rank)) {
              apps.push(entry);
            }
            for (var element of tags) {
              if (entry.selectedUsers.includes(element.toString())) {
                apps.push(entry);
                break;
              }
            }
          }
        } else {
          if (entry.status === "Open") {
            apps.push(entry);
          }
        }
      })
      res.send(apps);
      return;
    });
}

export async function checkGuestLogin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let loginCode = req.body.user.loginCode;
  let uuid = req.body.user.uuid;
  await mongoPlayer.findOne({ uuid: uuid }).exec(function (err, result) {
    if (err) {
      return next(
        new HttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          http.STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR]
        )
      );
    }
    try {
      if (loginCode.code === result.toObject().titanLogin.code && result.toObject().titanLogin.expires > Math.floor(Date.now() / 1000) && result.toObject().titanLogin.expires === loginCode.expires) {
        let mongoObj = result.toObject();
        let sentObj: {[k: string]: any} = {};
        sentObj.username = mongoObj.username;
        sentObj.uuid = mongoObj.uuid;
        sentObj.loginCode = mongoObj.titanLogin;
        sentObj.rank = mongoObj.rank;
        sentObj.tags = mongoObj.tags;
        sentObj.forums = mongoObj.forums;
        sentObj.discord = mongoObj.discordUsername;
        if (JSON.stringify(sentObj) === JSON.stringify(req.body.user)) {
          return next();
        }
        return next(
          new HttpError(
            HttpStatus.UNAUTHORIZED,
            http.STATUS_CODES[HttpStatus.UNAUTHORIZED]
          )
        );
      } else {
        return next(
          new HttpError(
            HttpStatus.UNAUTHORIZED,
            http.STATUS_CODES[HttpStatus.UNAUTHORIZED]
          )
        );
      }
    } catch(err) {
        console.log("Failed Titan Application Auth")
        return next(
          new HttpError(
            HttpStatus.UNAUTHORIZED,
            http.STATUS_CODES[HttpStatus.UNAUTHORIZED]
          )
        );
    }
  })
}

export async function returnSpecified(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  await mongoAppSetting
    .findOne({ settingType: "applicationType", appId: req.params.appId })
    .exec(function (err, result) {
      if (err) {
        return next(
          new HttpError(
            HttpStatus.BAD_REQUEST,
            http.STATUS_CODES[HttpStatus.BAD_REQUEST]
          )
        );
      }
      if (result.toObject().status !== "Closed") {
        res.send(result);
      } else {
        res.sendStatus(403);
      }
    });
}

export async function submitApplication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let groups = names;
  let user = req.body.user;
  let apps: any = [];
  await mongoAppSetting
    .find({ settingType: "applicationType" })
    .exec(function (err, result) {
      if (err) {
        return next(
          new HttpError(
            HttpStatus.BAD_REQUEST,
            http.STATUS_CODES[HttpStatus.BAD_REQUEST]
          )
        );
      }
      let rank = groups.get(req.body.user.rank);
      let tags = [Number];
      req.body.user.tags.forEach((e: Number) => {
        let tag = groups.get(e);
        if (tag != undefined) {
          tags.push(tag);
        }
      });
      result.forEach(e => {
        let entry = e.toObject();
        if (rank !== null) {
          if (entry.status === "Open") {
            apps.push(entry);
          }
          if (entry.status === "Selected") {
            if (entry.selectedUsers.includes(rank)) {
              apps.push(entry);
            }
            for (var element of tags) {
              if (entry.selectedUsers.includes(element)) {
                apps.push(entry);
                break;
              }
            }
          }
        } else {
          if (entry.status === "Open") {
            apps.push(entry);
          }
        }
      })
      var found = false;
      var foundType: any;
      apps.forEach((e: any) => {
        if (e.appId == req.params.appId) {
          foundType = e;
          found = true;
        }
      });
      if (found) {
        let appId = Math.random().toString(36).slice(-5);
        const application = new mongoApplication({ id: appId, appId: req.params.appId, uuid: user.uuid, application: req.body.formData, openToResponse: true, responses: [], outcome: "pending", notifyInGame: false });
        application.save(function (err) {
          if (err) {
            return res.sendStatus(500);
          }
          Axios.get(`https://api.ashcon.app/mojang/v2/user/${user.uuid}`)
          .then((res) => {
            const embed = new MessageBuilder()
            embed.setTitle('New Titan Application!')
            embed.setAuthor('Titan', 'https://cdn.discordapp.com/embed/avatars/0.png', 'https://www.titan.palace.network')
            //embed.setUrl('https://www.titan.palace.network/appView/' + appId)
            embed.addField('User', res.data.username)
            embed.addField('Application Type', foundType.name)
            embed.addField('Direct URL', 'https://titan.palace.network/dash/appView/' + appId)
            embed.setThumbnail('https://mc-heads.net/avatar/' + user.uuid)
            embed.setDescription('This is now available to view online')
            embed.setTimestamp();
            
            hook.send(embed);
          })
          return res.sendStatus(200);
        })
      } else {
        res.sendStatus(403);
      }
    });
    
}

export async function getAllPendingApplicants(req: Request, res: Response, next: NextFunction): Promise<void> {
  mongoApplication.find({ $or: [ {outcome: "pending"}, {outcome: "waiting response"} ]}).sort({ _id: -1}).exec(function(err, result) {
    if (err) {
      res.send({});
    } else {
      res.send(result);
    }
  });
}

export async function getAllCompletedApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
  mongoApplication.find({ outcome: {$ne: "pending"} }).sort({ _id: -1}).exec(function(err, result) {
    if (err) {
      res.send({});
    } else {
      res.send(result);
    }
  });
}

export async function getSingleApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  mongoApplication.findOne({ id: req.body.id }).exec(function(err, result) {
    if (err) {
      res.send({});
    } else {
      res.send(result);
    }
  });
}

export async function getGuestApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  mongoApplication.findOne({ id: req.params.id, uuid: req.body.user.uuid }).exec(function(err, result) {
    if (err) {
      res.send({});
    } else {
      let app = result.toObject();
      mongoAppSetting
          .findOne({ settingType: "applicationType", appId: app.appId })
          .exec(function (err, result2) {
            if (err) {
              return next(
                new HttpError(
                  HttpStatus.BAD_REQUEST,
                  http.STATUS_CODES[HttpStatus.BAD_REQUEST]
                )
              );
            }
            app.appName = result2.toObject().name;
            res.send(app);
            mongoApplication.findOneAndUpdate({ id: req.params.id, uuid: req.body.user.uuid }, { notifyInGame: false}).exec(function(err, res) {
              if (err) {
                console.error(err)
              }
            })
          });
    }
  });
}

export async function addAdminComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  let outcome: String;
  switch (req.body.status) {
    case "1":
      outcome = "waiting response"
      break;
    case "2":
      outcome = "accepted"
      break;
    case "3":
      outcome = "declined"
      break;
    default:
      break;
  }
  mongoApplication.findOneAndUpdate({ id: req.params.id }, { notifyInGame: true, outcome: outcome, openToResponse: req.body.openToResponse, $push: { responses: req.body.response }}).exec(function(err, result) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
}

export async function addGuestComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  mongoApplication.findOneAndUpdate({ id: req.params.id, uuid: req.body.user.uuid }, { $push: { responses: req.body.response }}).exec(function(err, result) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
      const embed = new MessageBuilder()
      embed.setTitle('New reply to application')
      embed.setAuthor('Titan', 'https://cdn.discordapp.com/embed/avatars/0.png', 'https://www.titan.palace.network')
      //embed.setUrl('https://www.titan.palace.network/appView/' + appId)
      embed.addField('User', req.body.user.username)
      embed.addField('Direct URL', 'https://titan.palace.network/dash/appView/' + req.params.id)
      embed.setThumbnail('https://mc-heads.net/avatar/' + req.body.user.uuid)
      embed.setDescription('This is now available to view online')
      embed.setTimestamp();
      
      hook.send(embed);
    }
  });
}

export async function createNewType(req: Request, res: Response, next: NextFunction): Promise<void> {
  let randomId = Math.floor(Math.random() * 100000);
  const newType = new mongoAppSetting({ settingType: "applicationType", appId: randomId, name: req.body.appName, status: "Closed", applicationLayout: [], selectedUsers: []});
  try {
    newType.save();
    const embed = new MessageBuilder()
    embed.setTitle('New Application Type Made')
    embed.setAuthor('Titan', 'https://cdn.discordapp.com/embed/avatars/0.png', 'https://www.titan.palace.network')
    embed.addField('Name:', req.body.appName)
    embed.addField('Created by:', req.body.user.name)
    embed.setDescription('Someone created a new application type on Titan. It has been set automatically to closed.')
    embed.setTimestamp();
    
    hook.send(embed);
    res.send({ id: randomId});
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function getAllUserApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
  mongoApplication.find({ uuid: req.body.user.uuid }).sort({ _id: -1}).exec(function(err, result) {
    if (err) {
      res.send([]);
    } else {
      let placeholder: any[] = [];
      var prom = new Promise<void>((resolve, reject) =>{
        let i = 0;
        result.forEach((element) => {
          mongoAppSetting
          .findOne({ settingType: "applicationType", appId: element.get('appId') })
          .exec(function (err, result2) {
            if (err) {
              return next(
                new HttpError(
                  HttpStatus.BAD_REQUEST,
                  http.STATUS_CODES[HttpStatus.BAD_REQUEST]
                )
              );
            }
            let temp = element.toObject();
            temp.appName = result2.get('name');
            placeholder.push(temp)
            i++;
            if (i === result.length) {
              resolve()
            }
          });
        });
      })
      prom.then(() => {
        res.send(placeholder);
      })
    }
  });
}