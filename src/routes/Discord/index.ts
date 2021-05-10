import { Link} from "@/components/Discord";
import { Router } from "express";

const router: Router = Router();

router.get('/link', Link);

export default router;
