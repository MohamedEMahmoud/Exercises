import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth, RoleType } from "@jogging/common";
import { Exercise } from '../../models/exercise.model';
import { User } from '../../models/user.model';
const router = express.Router();

router.get('/api/exercise/coach-filter', requireAuth, async (req: Request, res: Response) => {

      const coach = await User.findById(req.currentUser!.id);

      if (coach!.role !== RoleType.Coach) {
            throw new BadRequestError("You don't have this permission");
      }
      const { to, from, email } = req.query;

      if (!email) {
            throw new BadRequestError("Trainee Email Must Be Defined");
      }

      if (!from) {
            throw new BadRequestError('from field is required');
      }

      if (!to) {
            throw new BadRequestError('to field is required');
      }

      const trainee = await User.findOne({ email });

      if (!trainee) {
            throw new BadRequestError("Trainee Not Found");
      }

      if (trainee.coachId !== coach!.id) {
            throw new BadRequestError("Not Register Trainee");
      }

      const exercises = await Exercise.find({
            trainee: trainee.id,
            coach: coach!.id
      });

      if (exercises.length === 0) {
            throw new BadRequestError("Exercises Not Found");
      }

      let filter = exercises.filter((exercise) => {
            return new Date(exercise.date) >= new Date(String(from)) && new Date(exercise.date) <= new Date(String(to));
      });

      res.status(200).send({ status: 200, exercises: filter, success: true });
});

export { router as filterRouter };