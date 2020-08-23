import { IUserModel } from '@/components/User/model';

/**
 * @export
 * @interaface IAuthService
 */
export interface IAuthService {
    
    getUser(IUserModel: IUserModel): Promise<IUserModel>;
}
