import express, { Request, Response } from "express";
import { User } from "../../models/user.model";
import { requireAuth, BadRequestError, RoleType } from "@jogging/common";
import { UserUpdatedPublisher } from "../../events/publishers/user-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.patch("/api/auth/admin-email",
    requireAuth,
    async (req: Request, res: Response) => {

        const admin = await User.findById(req.currentUser!.id);

        if (!admin || admin.role !== RoleType.Admin) {
            throw new BadRequestError("User have no this permission");
        }

        const user = await User.findOne({ email: req.query.email });

        if (!user || !user.email.includes("@jogging")) {
            throw new BadRequestError("User Not Found");
        }

        user.isReserved = true;

        const userData = await user.save();

        if (userData) {
            await new UserUpdatedPublisher(natsWrapper.client).publish({
                id: userData.id,
                version: userData.version
            });
        }

        res.status(200).send({ status: 200, user, success: true });

    });
export { router as emailReservedRouter };