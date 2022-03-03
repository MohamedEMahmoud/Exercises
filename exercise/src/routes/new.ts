import express, { Request, Response } from 'express';
import { requireAuth, upload, RoleType } from "@jogging/common";
import { Exercise } from '../models/exercise.model';
import { User } from "../models/user.model";
import { randomBytes } from "crypto";
import { v2 as Cloudinary } from "cloudinary";
const router = express.Router();

router.post('/api/exercise', upload.fields([{ name: "media" }]), requireAuth, async (req: Request, res: Response) => {

    const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

    const currentUser = await User.findById(req.currentUser!.id);

    const exercise = Exercise.build({
        ...req.body,
        trainee: currentUser!.role === RoleType.Trainee ? currentUser!.id : undefined,
        coach: currentUser!.role === RoleType.Coach ? currentUser!.id : undefined
    });

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
    await exercise.save();

    res.status(201).send({ status: 201, exercise, success: true });

});

const msToTime = (duration: number) => {
    let calc_seconds = Math.floor((duration / 1000) % 60),
        calc_minutes = Math.floor((duration / (1000 * 60)) % 60),
        calc_hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const hours = (calc_hours < 10) ? `0${calc_hours}` : calc_hours,
        minutes = (calc_minutes < 10) ? `0${calc_minutes}` : calc_minutes,
        seconds = (calc_seconds < 10) ? `0${calc_seconds}` : calc_seconds;

    return `${hours}:${minutes}:${seconds}`;
};

export { router as createExerciseRouter };