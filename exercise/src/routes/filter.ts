import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth, RoleType } from "@jogging/common";
import { Exercise } from '../models/exercise.model';
import { User } from '../models/user.model';
const router = express.Router();

router.get('/api/exercise/filter', requireAuth, async (req: Request, res: Response) => {

      const { from, to } = req.query;

      if (!from) {
            throw new BadRequestError('from field is required');
      }

      if (!to) {
            throw new BadRequestError('to field is required');
      }

      const currentUser = await User.findById(req.currentUser!.id);

      const exercises = await Exercise.find({
            trainee: currentUser!.role === RoleType.Trainee ? currentUser!.id : undefined,
            coach: currentUser!.role === RoleType.Coach ? currentUser!.id : undefined
      });

      if (exercises.length === 0) {
            throw new BadRequestError("Exercises Not Found");
      }

      let filter = exercises.filter(exercise => {
            return new Date(exercise.date) >= new Date(String(from)) && new Date(exercise.date) <= new Date(String(to));
      });

      res.status(200).send({ status: 200, exercises: filter, success: true });
});

export { router as exerciseFilterRouter };