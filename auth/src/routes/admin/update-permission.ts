import express, { Request, Response } from "express";
import { User } from "../../models/user.model";
import { requireAuth, BadRequestError, RoleType } from "@jogging/common";
import { UserUpdatedPublisher } from "../../events/publishers/user-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.patch("/api/auth/admin-role",
    requireAuth,
    async (req: Request, res: Response) => {

        const admin = await User.findById(req.currentUser!.id);

        if (!admin || admin.role !== RoleType.Admin) {
            throw new BadRequestError("User have no this permission");
        }

        const coach = await User.findOne({ email: req.query.email });

        if (!coach) {
            throw new BadRequestError("Coach Not Found");
        }

        if (coach.role === RoleType.Coach) {
            throw new BadRequestError("User Have Coach Role");
        }

        coach.role = RoleType.Coach;

        const coachData = await coach.save();

        if (coachData) {
            await new UserUpdatedPublisher(natsWrapper.client).publish({
                id: coachData.id,
                role: coachData.role,
                version: coachData.version
            });
        }

        res.status(200).send({ status: 200, coach, success: true });

    });
export { router as updatePermissionRouter };