import * as Joi from 'joi';
import AuthValidation from './validation';
import UserModel, { IUserModel } from '@/components/User/model';
import { IAuthService } from './interface';

/**
 * @export
 * @implements {IAuthService}
 */
const AuthService: IAuthService = {

    async getUser(body: IUserModel): Promise<IUserModel> {
        try {
            const validate: Joi.ValidationResult = AuthValidation.getUserForLogin(body);

            if (validate.error) {
                throw new Error(validate.error.message);
            }

            const user: IUserModel = await UserModel.findOne({
                username: body.username,
            }, { uuid: 1, username: 1, staffPassword: 1 });

            const isMatched: boolean = user && (await user.comparePassword(body.staffPassword));

            if (isMatched) {
                return user;
            }

            throw new Error('Invalid username/password combination');
        } catch (error) {
            throw new Error(error);
        }
    },

    // async getUserByUUID(body: IUserModel): Promise<IUserModel> {
    //     try {
    //         const validate: Joi.ValidationResult = AuthValidation.getUserByUUID(body);

    //         if (validate.error) {
    //             throw new Error(validate.error.message);
    //         }

    //         const user: IUserModel = await UserModel.findOne({
    //             uuid: body.uuid,
    //         }, { username: 1, staffPassword: 1 });
            
    //         if (user) {
    //             return user;
    //         }

    //         throw new Error('Invalid UUID');
    //     } catch (error) {
    //         throw new Error(error);
    //     }
    // }
};

export default AuthService;
