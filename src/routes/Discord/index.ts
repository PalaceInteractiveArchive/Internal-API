import { Link, Verify } from "@/components/Discord";
import { Router } from "express";

const router: Router = Router();

router.get('/link', Link);
router.post('/verify', Verify);

export default router;
