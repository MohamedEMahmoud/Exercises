import express, { Request, Response } from "express";
import { User } from "../../models/user.model";
import { requireAuth, BadRequestError, RoleType } from "@jogging/common";

const router = express.Router();

router.get("/api/auth/admin-email",
    requireAuth,
    async (req: Request, res: Response) => {

        const admin = await User.findById(req.currentUser!.id);

        if (!admin || admin.role !== RoleType.Admin) {
            throw new BadRequestError("User have no this permission");
        }

        const emails = await User.find({ creator: admin.id });

        if (emails.length === 0) {
            throw new BadRequestError("No Users found");
        }

        res.status(200).send({ status: 200, emails, success: true });

    });
export { router as emailCreatorRouter };