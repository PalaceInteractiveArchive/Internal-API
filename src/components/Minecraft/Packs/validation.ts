import * as Joi from 'joi';
import Validation from '@/components/validation';

/**
 * @export
 * @class PackValidation
 * @extends Validation
 */
class PackValidation extends Validation {
    /**
     * Creates an instance of PackValidation.
     * @memberof PackValidation
     */
    constructor() {
        super();
    }

    /**
     * @param {{ id: string }} body
     * @returns {Joi.ValidationResult<{ id: string }>}
     * @memberof PackValidation
     */
    getPack(body: {
        name: string,
        version: number;
    }): Joi.ValidationResult {

        const schema: Joi.ObjectSchema = Joi.object().keys({
            name: Joi.string().required(),
            version: Joi.number()
        });

        return schema.validate(body);
    }
}

export default new PackValidation();
