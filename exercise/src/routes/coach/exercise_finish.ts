import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, RoleType } from "@jogging/common";
import { Exercise } from '../../models/exercise.model';
import { User } from "../../models/user.model";

const router = express.Router();

router.patch('/api/exercise/coach-finish', requireAuth, async (req: Request, res: Response) => {
    const coach = await User.findById(req.currentUser!.id);
    if (!coach || coach!.role !== RoleType.Coach) {
        throw new BadRequestError("You don't have this permission");
    }
    if (!req.query.exerciseId) {
        throw new BadRequestError("Exercise ID must be defined");
    }
    if (!req.query.email) {
        throw new BadRequestError("Trainee Email Must Be Defined");
    }
    const trainee = await User.findOne({ email: req.query.email });

    if (!trainee) {
        throw new BadRequestError("Trainee Not Found");
    }

    if (trainee.coachId !== coach!.id) {
        throw new BadRequestError("Not Register Trainee");
    }

    const exercise = await Exercise.findById(req.query.exerciseId);
    if (!exercise) {
        throw new BadRequestError("Exercise Not Found");
    }

    exercise.done = true;
    await exercise.save();

    res.status(200).send({ status: 200, exercise, success: true });

});

export { router as exerciseFinishByCoachRouter };