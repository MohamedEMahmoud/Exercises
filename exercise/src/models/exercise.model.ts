import mongoose from 'mongoose';

interface ExerciseAttrs {
    trainee?: string;
    coach?: string;
    description?: string;
    media?: { id: string; URL: string; }[];
    time_start: string;
    time_end: string;
    total_time: number;
    date: string;
    distance?: number;
};

interface ExerciseDoc extends mongoose.Document {
    trainee: string;
    coach: string;
    description: string;
    media: { id: string; URL: string; }[];
    time_start: string;
    time_end: string;
    total_time: string;
    date: string;
    distance: number;
    done: boolean;
    createdAt: string;
    updatedAt: string;
};

interface ExerciseModel extends mongoose.Model<ExerciseDoc> {
    build(attrs: ExerciseAttrs): ExerciseDoc;
}

const exerciseSchema = new mongoose.Schema({
    trainee: {
        type: String,
    },
    coach: {
        type: String,
    },
    description: {
        type: String,
        trim: true,
    },
    media: {
        type: Array,
    },
    time_start: {
        type: String,
    },
    time_end: {
        type: String,
    },
    total_time: {
        type: String,
    },
    date: {
        type: String,
    },
    distance: {
        type: Number,
    },
    done: {
        type: Boolean,
        default: false
    }
},
    {
        toJSON: { transform(doc, ret) { ret.id = ret._id, delete ret._id; } },
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        versionKey: false
    });


exerciseSchema.statics.build = (attrs: ExerciseAttrs) => new Exercise(attrs);

const Exercise = mongoose.model<ExerciseDoc, ExerciseModel>('Exercise', exerciseSchema);

export { Exercise };