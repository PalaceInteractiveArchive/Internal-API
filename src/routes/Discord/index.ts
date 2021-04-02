import { Link, Verify } from "@/components/Discord";
import { Router } from "express";

const router: Router = Router();

router.get('/link', Link);
router.get('/verify', Verify);

export default router;
