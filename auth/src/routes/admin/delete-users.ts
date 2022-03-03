import express, { Request, Response } from "express";
import { User } from "../../models/user.model";
import { requireAuth, BadRequestError, RoleType } from "@jogging/common";
import mongoose from "mongoose";
import { UserDeletedPublisher } from "../../events/publishers/user-deleted-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.delete("/api/auth/admin",
    requireAuth,
    async (req: Request, res: Response) => {

        const admin = await User.findById(req.currentUser!.id);

        if (!admin || admin.role !== RoleType.Admin) {
            throw new BadRequestError("User have no this permission");
        }

        if (!req.query.id || !mongoose.Types.ObjectId.isValid(String(req.query.id))) {
            throw new BadRequestError("Id Is Invalid");
        }

        const deletedUser = await User.findByIdAndDelete(req.query.id);

        if (!deletedUser) {
            throw new BadRequestError("Invalid credentials");
        }

        await new UserDeletedPublisher(natsWrapper.client).publish({
            id: deletedUser.id,
        });

        res.status(204).send({});

    });

export { router as adminDeleteUsers };