import mongoose, { Schema, Model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    domain: 'HR' | 'Program' | 'IT' | 'Sales' | 'RM' | 'None';
    role: 'admin' | 'intern';
    xp: number;
    completedTasks: mongoose.Types.ObjectId[];
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/@scaler\.com$/, 'Please use a valid @scaler.com email address'],
        },
        password: { type: String, select: false }, // Password is optional for potential SSO future, but required for now manually check
        phone: { type: String },
        domain: {
            type: String,
            enum: ['HR', 'Program', 'IT', 'Sales', 'RM', 'None'],
            default: 'None',
        },
        role: {
            type: String,
            enum: ['admin', 'intern'],
            default: 'intern',
        },
        xp: { type: Number, default: 0 },
        completedTasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

// Prevent overwriting model if already compiled
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
