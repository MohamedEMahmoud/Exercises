import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, RoleType } from "@jogging/common";
import { Exercise } from '../../models/exercise.model';
import { User } from '../../models/user.model';

const router = express.Router();

router.delete('/api/exercise/coach', requireAuth, async (req: Request, res: Response) => {

    const coach = await User.findById(req.currentUser!.id);

    if (!coach || coach!.role !== RoleType.Coach) {
        throw new BadRequestError("You don't have this permission");
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

    const exercise = await Exercise.findOne({ id: req.query.exerciseId, trainee: trainee.id, coach: coach.id });

    if (!exercise) {
        throw new BadRequestError('Exercise Not Found');
    }

    await exercise.deleteOne();

    res.send({ status: 204, message: "Task has been deleted Successfully!", success: true });
});

export { router as deleteExerciseRouter };