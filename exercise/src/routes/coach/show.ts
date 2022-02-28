import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, RoleType } from "@jogging/common";
import { Exercise } from '../../models/exercise.model';
import { User } from '../../models/user.model';

const router = express.Router();

router.get('/api/exercise/coach', requireAuth, async (req: Request, res: Response) => {

    const coach = await User.findById(req.currentUser!.id);

    if (coach!.role !== RoleType.Coach) {
        throw new BadRequestError("You don't have this permission");
    }

    const exercises = await Exercise.find({ coach: coach!.id });
    
    const filterExercises = exercises.filter(exercise => exercise.coach && exercise.trainee);

    res.status(200).send({ status: 200, exercises: filterExercises, success: true });


});

export { router as showAllTraineesExercisesToCoach };