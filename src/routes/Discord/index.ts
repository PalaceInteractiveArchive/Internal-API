import { Link, Unlink} from "@/components/Discord";
import { Router } from "express";

const router: Router = Router();

router.get('/link', Link);

router.get('/unlink/:uuid/:verify_code', Unlink)

export default router;
