import * as Joi from 'joi';
import PackModel, { IPackModel } from './model';
import PackValidation from './validation';
import { IPackService } from './interface';

/**
 * @export
 * @implements {IPackModelService}
 */
const PackService: IPackService = {
    /**
     * @returns {Promise < IPackModel[] >}
     * @memberof PackService
     */
    async findAll(): Promise<IPackModel[]> {
        try {
            return await PackModel.find({}, { _id: 0 });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async findOne(name: string, version: number): Promise<IPackModel> {
        try {
            const validate: Joi.ValidationResult = PackValidation.getPack({ name, version });

            if (validate.error) {
                throw new Error(validate.error.message);
            }

            return await PackModel.findOne({ name }, { _id: 0 });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // /**
    //  * @param {IPackModel} Pack
    //  * @returns {Promise < IPackModel >}
    //  * @memberof PackService
    //  */
    // async insert(body: IPackModel): Promise<IPackModel> {
    //     try {
    //         const validate: Joi.ValidationResult = PackValidation.createPack(body);

    //         if (validate.error) {
    //             throw new Error(validate.error.message);
    //         }

    //         const Pack: IPackModel = await PackModel.create(body);

    //         return Pack;
    //     } catch (error) {
    //         throw new Error(error.message);
    //     }
    // },

    // /**
    //  * @param {string} id
    //  * @returns {Promise < IPackModel >}
    //  * @memberof PackService
    //  */
    // async remove(id: string): Promise<IPackModel> {
    //     try {
    //         const validate: Joi.ValidationResult = PackValidation.removePack({
    //             id,
    //         });

    //         if (validate.error) {
    //             throw new Error(validate.error.message);
    //         }

    //         const Pack: IPackModel = await PackModel.findOneAndRemove({
    //             _id: Types.ObjectId(id),
    //         });

    //         return Pack;
    //     } catch (error) {
    //         throw new Error(error.message);
    //     }
    // },
};

export default PackService;
