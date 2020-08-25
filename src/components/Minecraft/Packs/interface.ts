import { IPackModel } from './model';

/**
 * @export
 * @interface IPackService
 */
export interface IPackService {
    /**
     * @returns {Promise<IPackModel[]>}
     * @memberof IPackService
     */
    findAll(): Promise<IPackModel[]>;

    /**
     * @param {string} code
     * @returns {Promise<IPackModel>}
     * @memberof IPackService
     */
    findOne(name: string, version: number): Promise<IPackModel>;

    // /**
    //  * @param {IPackModel} IPackModel
    //  * @returns {Promise<IPackModel>}
    //  * @memberof IPackService
    //  */
    // insert(IPackModel: IPackModel): Promise<IPackModel>;

    // /**
    //  * @param {string} id
    //  * @returns {Promise<IPackModel>}
    //  * @memberof IPackService
    //  */
    // remove(id: string): Promise<IPackModel>;
}
