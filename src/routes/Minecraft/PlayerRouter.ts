import { PlayerComponent } from '@/components/Minecraft';
import { Router } from 'express';

/** 
 * @constant {express.Router} 
 */
const router: Router = Router();

router.get('/:user', PlayerComponent.getPlayer);

export default router;