import express, { Request, Response } from "express";
import { User } from "../../models/user.model";
import { requireAuth, BadRequestError, RoleType } from "@jogging/common";

const router = express.Router();

router.get("/api/auth/admin-users",
    requireAuth,
    async (req: Request, res: Response) => {

        const admin = await User.findById(req.currentUser!.id);

        if (!admin || admin.role !== RoleType.Admin) {
            throw new BadRequestError("User have no this permission");
        }

        const users = await User.find({});

        if (users.length === 0) {
            throw new BadRequestError("No Users found");
        }
        const filterAdmin = users.filter(el => el.role !== RoleType.Admin);

        res.status(200).send({ status: 200, users: filterAdmin, success: true });

    });
export { router as listOfUsers };