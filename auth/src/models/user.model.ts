import { Password } from "../services/Password";
import mongoose from 'mongoose';
import { GenderType, RoleType } from '@jogging/common';
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface UserAttrs {
    username: string;
    email: string;
    password: string;
    gender?: GenderType;
    picture: string;
    role: RoleType;
    age?: number;
    macAddress: { MAC: String; }[];
    active: boolean;
    activeKey: string;
    resetPasswordKey: string;
    resetPasswordExpires: string;
    isReserved: boolean;
    Creator?: string;
    coachId?: string;
    coachName?: string;
};

interface UserDoc extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    gender: GenderType;
    picture: string;
    role: RoleType;
    age: number;
    macAddress: { MAC: String; }[];
    active: boolean;
    activeKey: string;
    resetPasswordKey: string;
    resetPasswordExpires: string;
    isReserved: boolean;
    creator: string;
    coachId: string;
    coachName: string;
    version: number;
};

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: [8, "Username must be more than 8 characters"],
        max: 20,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        max: 50,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be more than 8 characters"]
    },
    gender: {
        type: String,
        trim: true,
        lowercase: true,
        enum: Object.values(GenderType),
    },
    picture: {
        type: String,
    },
    role: {
        type: String,
        trim: true,
        required: true,
        enum: Object.values(RoleType),
    },
    age: {
        type: Number,
    },
    isReserved: {
        type: Boolean,
    },
    creator: {
        type: String
    },
    coachId: {
        type: String
    },
    coachName: {
        type: String
    },
    macAddress: {
        type: Array,
        default: []
    },
    activeKey: {
        type: String,
        trim: true,
        lowercase: true,
    },
    active: {
        type: Boolean,
        default: false
    },
    resetPasswordKey: {
        type: String,
        trim: true,
        lowercase: true,
    },
    resetPasswordExpires: {
        type: String,
    }
}, {
    toJSON: { transform(doc, ret) { ret.id = ret._id, delete ret._id, delete ret.password; } },
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

userSchema.set("versionKey", "version");

userSchema.plugin(updateIfCurrentPlugin);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    };

    next();
});

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };