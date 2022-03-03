import express, { Request, Response } from "express";
import { User } from "../../models/user.model";
import { requireAuth, BadRequestError, validateRequest, upload, RoleType } from "@jogging/common";

const router = express.Router();

router.post("/api/auth/admin",
    upload.none(),
    requireAuth,
    async (req: Request, res: Response) => {

        const admin = await User.findById(req.currentUser!.id);

        if (!admin || admin.role !== RoleType.Admin) {
            throw new BadRequestError("User have no this permission");
        }

        if (!req.body.email.includes("@jogging")) {
            throw new BadRequestError("Email Must Have @jogging Domain");
        }

        const email = await User.findOne({ email: req.body.email });
        if (email) {
            throw new BadRequestError("Email is already exist");
        }

        const username = await User.findOne({ username: req.body.username });
        if (username) {
            throw new BadRequestError("username is already exist");
        }

        const newUser = User.build({ ...req.body });

        newUser.active = true;
        newUser.isReserved = false;
        newUser.creator = admin.id;

        await newUser.save();

        res.status(201).send({ status: 201, newUser, success: true });

    });

export { router as CreateDomainRouter };