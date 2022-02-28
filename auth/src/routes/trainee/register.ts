import express, { Request, Response } from "express";
import { User } from "../../models/user.model";
import { requireAuth, BadRequestError, upload } from "@jogging/common";
import { UserUpdatedPublisher } from "../../events/publishers/user-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.post("/api/auth/trainee-register",
    upload.none(),
    requireAuth,
    async (req: Request, res: Response) => {

        const trainee = await User.findById(req.currentUser!.id);

        const coach = await User.findOne({ coachName: req.body.coachName });
        if (!coach) {
            throw new BadRequestError("Coach Not Found");
        }

        trainee!.coachId = coach.id;

        const traineeData = await trainee!.save();

        if (traineeData) {
            await new UserUpdatedPublisher(natsWrapper.client).publish({
                id: traineeData.id,
                coachId: traineeData.coachId,
                version: traineeData.version
            });
        }
        res.status(201).send({ status: 201, trainee, success: true });

    });

export { router as RegisterWithCoachRouter };