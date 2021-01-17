import * as HttpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { mongoAppSetting } from "./model";
import { mongoUser } from "@/components/Titan/User/model";
import HttpError from "@/config/error";
// import UserService from '@/components/Titan/User/service';
// import config from '@/config/env';
import Axios from "axios";
import * as http from "http";
import config from '@/config/titan/index';


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