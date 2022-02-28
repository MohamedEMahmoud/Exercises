import mongoose from 'mongoose';
import { RoleType } from '@jogging/common';
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface UserAttrs {
    id: string;
    email: string;
    picture: string;
    coachId?: string;
    role: RoleType;
    version: number;
};

interface UserDoc extends mongoose.Document {
    id: string;
    email: string;
    picture: string;
    coachId: string;
    role: RoleType;
    version: number;
    createdAt: string;
    updatedAt: string;
};

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        required: true,
    },
    coachId: {
        type: String,
    },
    role: {
        type: String,
        trim: true,
        enum: Object.values(RoleType),
        default: RoleType.Trainee
    }

},
    {
        toJSON: { transform(doc, ret) { ret.id = ret._id, delete ret._id, delete ret.password; } },
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });

userSchema.set("versionKey", "version");

userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User({ _id: attrs.id, ...attrs });
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };