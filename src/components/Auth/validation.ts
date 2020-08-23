import * as Joi from 'joi';
import Validation from '@/components/validation';
import { IUserModel } from '@/components/User/model';

/**
 * @export
 * @class AuthValidation
 * @extends Validation
 */
class AuthValidation extends Validation {
    /**
     * Creates an instance of AuthValidation.
     * @memberof AuthValidation
     */
    constructor() {
        super();
    }

    getUserForLogin(params: IUserModel): Joi.ValidationResult {
        const schema: Joi.ObjectSchema = Joi.object().keys({
            password: Joi.string().required(),
            username: Joi.string().required()
        });

        return schema.validate(params);
    }

    // getUserByUUID(params: IUserModel): Joi.ValidationResult {
    //     const schema: Joi.ObjectSchema = Joi.object().keys({
    //         uuid: Joi.string().required()
    //     });

    //     return schema.validate(params);
    // }
}

export default new AuthValidation();
