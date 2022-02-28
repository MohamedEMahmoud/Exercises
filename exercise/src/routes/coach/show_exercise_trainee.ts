import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, RoleType } from "@jogging/common";
import { Exercise } from '../../models/exercise.model';
import { User } from '../../models/user.model';

const router = express.Router();

router.get('/api/exercise/coach-trainee', requireAuth, async (req: Request, res: Response) => {

    const coach = await User.findById(req.currentUser!.id);

    if (coach!.role !== RoleType.Coach) {
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

    const exercises = await Exercise.find({ coach: coach!.id, trainee: trainee.id });

    res.status(200).send({ status: 200, exercises, success: true });


});

export { router as ShowAllTraineeExercisesToCoach };