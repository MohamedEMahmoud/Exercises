import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, RoleType } from "@jogging/common";
import { Exercise } from '../models/exercise.model';

const router = express.Router();

router.patch('/api/exercise/finish', requireAuth, async (req: Request, res: Response) => {
    if (!req.query.exerciseId) {
        throw new BadRequestError("Exercise ID must be defined");
    }
    const exercise = await Exercise.findById(req.query.exerciseId);
    if (!exercise) {
        throw new BadRequestError("Exercise Not Found");
    }

    exercise.done = true;
    await exercise.save();

    res.status(200).send({ status: 200, exercise, success: true });

});

export { router as exercise_finish_Router };