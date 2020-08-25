import { IUserModel } from '@/components/Titan/User/model';

/**
 * @export
 * @interaface IAuthService
 */
export interface IAuthService {
    
    getUser(IUserModel: IUserModel): Promise<IUserModel>;
}
