import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUser, errorHandler, NotFoundError } from '@jogging/common';
import cookieSession from 'cookie-session';
import { createExerciseRouter } from "./routes/new";
import { updateExerciseRouter } from "./routes/update";
import { showAllExerciseRouter } from "./routes/show";
import { exerciseFilterRouter } from "./routes/filter";
import { deleteExerciseRouter } from "./routes/delete";
import { exercise_finish_Router } from "./routes/exercise_finish";
import { exerciseReportRouter } from "./routes/report";
import { coachCreateExerciseToTrainee } from "./routes/coach/new";
import { coachDeleteExerciseToTrainee } from "./routes/coach/delete";
import { coachUpdateExerciseToTrainee } from "./routes/coach/update";
import { showAllTraineesExercisesToCoach } from "./routes/coach/show";
import { ShowAllTraineeExercisesToCoach } from "./routes/coach/show_exercise_trainee";
import { filterRouter } from "./routes/coach/filter";
import { exerciseFinishByCoachRouter } from "./routes/coach/exercise_finish";
import { ReportRouter } from "./routes/coach/report_trainee";

const app = express();
app.set('trust proxy', true);
app.use([
  json(),
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }),
  currentUser,
  createExerciseRouter,
  updateExerciseRouter,
  showAllExerciseRouter,
  exerciseFilterRouter,
  deleteExerciseRouter,
  exercise_finish_Router,
  exerciseReportRouter,
  coachCreateExerciseToTrainee,
  coachDeleteExerciseToTrainee,
  coachUpdateExerciseToTrainee,
  showAllTraineesExercisesToCoach,
  ShowAllTraineeExercisesToCoach,
  filterRouter,
  exerciseFinishByCoachRouter,
  ReportRouter
]);

app.use(
  '*',
  async () => {
    throw new NotFoundError();
  }, errorHandler);

export { app };