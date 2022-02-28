import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, upload, RoleType } from "@jogging/common";
import { Exercise } from '../../models/exercise.model';
import _ from 'lodash';
import { v2 as Cloudinary } from "cloudinary";
import { randomBytes } from "crypto";
import { User } from "../../models/user.model";

const router = express.Router();

router.patch('/api/exercise/coach', upload.fields([{ name: "media" }]), requireAuth, async (req: Request, res: Response) => {

    const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

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

    const exercise = await Exercise.findById(req.query.exerciseId);

    if (!exercise) {
        throw new BadRequestError('There is no exercises for you');
    }

    if (exercise.trainee && exercise.trainee !== trainee.id) {
        throw new BadRequestError("Something went wrong");
    }

    if (exercise.coach && exercise.coach !== coach!.id) {
        throw new BadRequestError("Something went wrong");
    }

    const diff = new Date(`${exercise.date} ${exercise.time_end}`).getTime() - new Date(`${exercise.date} ${exercise.time_start}`).getTime();

    exercise.total_time = msToTime(diff);

    if (files.media) {
        await new Promise((resolve, reject) => {
            files.media.map(mediaData => {
                const mediaDataId = randomBytes(16).toString("hex");
                return Cloudinary.uploader.upload_stream({
                    public_id: `exercise-${mediaData.mimetype}/${mediaDataId}-${mediaData.originalname}/jogging`,
                    use_filename: true,
                    tags: `${mediaDataId}-tag`,
                    placeholder: true,
                    resource_type: 'auto'
                }, (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        exercise.media.push({ id: mediaDataId, URL: result?.secure_url! });
                        if (files.media.length === exercise.media.length) {
                            return resolve(exercise.media);
                        }
                    }
                }).end(mediaData.buffer);
            });
        });
    }
    _.extend(exercise, req.body);
    await exercise.save();

    res.status(200).send({ status: 200, exercise, success: true });
});

const msToTime = (duration: number) => {
    let milliseconds = (duration % 1000) / 100,
        calc_seconds = Math.floor((duration / 1000) % 60),
        calc_minutes = Math.floor((duration / (1000 * 60)) % 60),
        calc_hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const hours = (calc_hours < 10) ? `0 ${calc_hours}` : calc_hours,
        minutes = (calc_minutes < 10) ? `0 ${calc_minutes}` : calc_minutes,
        seconds = (calc_seconds < 10) ? `0 ${calc_seconds}` : calc_seconds;

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

export { router as coachUpdateExerciseToTrainee };