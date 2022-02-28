import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError } from "@jogging/common";
import { Exercise } from '../models/exercise.model';

const router = express.Router();

router.delete('/api/exercise', requireAuth, async (req: Request, res: Response) => {

    const exercise = await Exercise.findByIdAndDelete(req.query.exerciseId);

    if (!exercise) {
        throw new BadRequestError('Exercise Not Found');
    }

    res.send({ status: 204, message: "Task has been deleted Successfully!", success: true });
});

export { router as deleteExerciseRouter };