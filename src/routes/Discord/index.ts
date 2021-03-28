import { Link, Verify } from "@/components/Discord";
import { Router } from "express";

const router: Router = Router();

router.post('/link', Link);
router.post('/verify', Verify);

export default router;