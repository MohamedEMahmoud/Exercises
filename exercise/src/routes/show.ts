import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, RoleType } from "@jogging/common";
import { Exercise } from '../models/exercise.model';
import { User } from '../models/user.model';

const router = express.Router();

router.get('/api/exercise', requireAuth, async (req: Request, res: Response) => {
    const currentUser = await User.findById(req.currentUser!.id);
    let exercises;

    if (currentUser!.role === RoleType.Trainee) {
        exercises = await Exercise.find({ trainee: currentUser!.id });
    } else {
        exercises = await Exercise.find({ coach: currentUser!.id });
        exercises = exercises.filter(exercise => !exercise.trainee);
    }

    if (exercises.length === 0) {
        throw new BadRequestError("Exercises Not Found");
    }

    res.status(200).send({ status: 200, exercises, success: true });


});

export { router as showAllExerciseRouter };