import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ITask extends Document {
    name: string;
    domain: 'HR' | 'Program' | 'IT' | 'Sales' | 'RM';
    link?: string;
    tips?: string;
    images?: string[];
    video?: string;
    xpReward: number;
}

const TaskSchema: Schema<ITask> = new Schema(
    {
        name: { type: String, required: true },
        domain: {
            type: String,
            enum: ['HR', 'Program', 'IT', 'Sales', 'RM'],
            required: true,
        },
        link: { type: String },
        tips: { type: String },
        images: [{ type: String }],
        video: { type: String },
        xpReward: { type: Number, default: 100 },
    },
    { timestamps: true }
);

const Task: Model<ITask> =
    mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
