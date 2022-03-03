import express, { Request, Response } from "express";
import { User } from "../../models/user.model";
import { BadRequestError, RoleType } from "@jogging/common";

const router = express.Router();

router.get("/api/auth/coach",
    async (req: Request, res: Response) => {

        const coaches = await User.find({ role: RoleType.Coach });

        if (coaches.length === 0) {
            throw new BadRequestError("No Coaches found");
        }

        res.status(200).send({ status: 200, coaches: coaches.filter(coach => coach.coachName), success: true });

    });
export { router as showCoachesName };