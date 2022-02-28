import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, RoleType } from "@jogging/common";
import { Exercise } from '../models/exercise.model';
import { User } from '../models/user.model';

const router = express.Router();

router.get('/api/exercise/report', requireAuth, async (req: Request, res: Response) => {

    const currentUser = await User.findById(req.currentUser!.id);

    // Report on average speed & distance per week.

    let exercises = await Exercise.find({
        trainee: currentUser!.role === RoleType.Trainee ? currentUser!.id : undefined,
        coach: currentUser!.role === RoleType.Coach ? currentUser!.id : undefined
    });
    const jogging = exercises.filter(exercise => exercise.distance);

    if (jogging.length === 0) {
        throw new BadRequestError("No Jogging Time");
    }

    const doc = { first: jogging[0].date, last: jogging[jogging.length - 1].date };
    const numberOfWeeks = diff_weeks(new Date(doc.last), new Date(doc.first));
    const dayInWeek = { first: "", last: "" };
    const weeks: { first: string; last: string; }[] = [];

    const date = new Date();
    const joggingDate = new Date(doc.first);
    const indexDay = joggingDate.getDay();

    for (let i = 0; i < numberOfWeeks; i++) {
        if (i === 0) {
            if (indexDay !== 0) {
                dayInWeek.first = new Date(date.setDate(joggingDate.getDate() - indexDay)).toISOString().slice(0, 10);
                dayInWeek.last = new Date(date.setDate(new Date(dayInWeek.first).getDate() + 6)).toISOString().slice(0, 10);
            } else {
                dayInWeek.first = doc.first;
                dayInWeek.last = new Date(date.setDate(new Date(dayInWeek.first).getDate() + 6)).toISOString().slice(0, 10);
            }
        }
        else {
            dayInWeek.first = new Date(date.setDate(new Date(dayInWeek.last).getDate() + 1)).toISOString().slice(0, 10);
            dayInWeek.last = new Date(date.setDate(new Date(dayInWeek.first).getDate() + 6)).toISOString().slice(0, 10);
        }
        weeks.push({ ...dayInWeek });
    }

    let report: {
        from: string;
        to: string;
        week: number;
        totalDistance_M: string;
        totalDistance_KM: string;
        averageSpeed_MPerS: string;
        averageSpeed_KMPerH: string;
    }[] = [];

    weeks.map((week, idx) => {

        const exercisePerWeek = jogging.filter(exercise => {
            return new Date(exercise.date) >= new Date(week.first) && new Date(exercise.date) <= new Date(week.last);
        });

        let activity;
        if (exercisePerWeek.length > 0) {

            activity = exercisePerWeek.reduce((total, current) => {

                const time = current.total_time.split(":").map(Number);

                const convertTimeToHours = (+time[1]) / 60 + (+time[2]) / 3600 + (+time[0]);
                const convertTimeToSeconds = (+time[0]) * 60 * 60 + (+time[1]) * 60 + (+time[2]);

                total.distance_KM += current.distance / 1000;
                total.time_H += convertTimeToHours;

                total.distance_M += current.distance;
                total.time_S += convertTimeToSeconds;

                return total;

            }, { time_H: 0, distance_M: 0, time_S: 0, distance_KM: 0, });

            report = [
                ...report,
                {
                    from: week.first,
                    to: week.last,
                    week: idx + 1,
                    totalDistance_M: `${activity.distance_M} m`,
                    totalDistance_KM: `${activity.distance_KM} km`,
                    averageSpeed_MPerS: `${activity.distance_M / activity.time_S} m/s`,
                    averageSpeed_KMPerH: `${activity.distance_KM / activity.time_H} km/h`
                }];
        };
    });

    res.status(200).send({ status: 200, report, success: true });


});
const diff_weeks = (dt2: Date, dt1: Date) => {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7);
    return Math.abs(Math.round(diff)) + 1;
};

export { router as exerciseReportRouter };